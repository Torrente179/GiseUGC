import { readFileSync } from 'node:fs';

/**
 * A byte-range HLS media playlist for one fragmented MP4: the init segment
 * (ftyp + moov) as EXT-X-MAP, then one segment per moof + mdat, timed from the
 * video track's tfdt. A fragment that carries no video (the audio tail) joins
 * the segment before it.
 *
 * Fragments are cut every second, not at keyframes: several masters have one
 * keyframe for the whole clip, and a keyframe-cut segment would be the whole
 * file. MSE plays them in order from the keyframe at 0, which is all the feed
 * does (start, and loop back to 0).
 */

const readBoxes = (buf, start, end) => {
  const out = [];
  let at = start;
  while (at + 8 <= end) {
    let size = buf.readUInt32BE(at);
    const type = buf.toString('latin1', at + 4, at + 8);
    let header = 8;
    if (size === 1) {
      size = Number(buf.readBigUInt64BE(at + 8));
      header = 16;
    }
    if (size === 0) size = end - at;
    if (size < header) throw new Error(`Bad ${type} box at ${at}`);
    out.push({ type, start: at, end: at + size, body: at + header });
    at += size;
  }
  return out;
};

export const buildFmp4Playlist = (file, uri) => {
  const buf = readFileSync(file);
  const top = readBoxes(buf, 0, buf.length);
  const inner = (box) => readBoxes(buf, box.body, box.end);
  const child = (box, type) => inner(box).find((b) => b.type === type);

  const moov = top.find((b) => b.type === 'moov');
  if (!moov) throw new Error(`${file}: no moov`);
  if (!child(moov, 'mvex')) throw new Error(`${file}: not fragmented (no mvex)`);

  const tracks = inner(moov)
    .filter((b) => b.type === 'trak')
    .map((trak) => {
      const tkhd = child(trak, 'tkhd');
      const id = buf.readUInt32BE(tkhd.body + (buf[tkhd.body] === 1 ? 20 : 12));
      const mdia = child(trak, 'mdia');
      const mdhd = child(mdia, 'mdhd');
      const timescale = buf.readUInt32BE(mdhd.body + (buf[mdhd.body] === 1 ? 20 : 12));
      const hdlr = child(mdia, 'hdlr');
      return { id, timescale, handler: buf.toString('latin1', hdlr.body + 8, hdlr.body + 12) };
    });
  const video = tracks.find((t) => t.handler === 'vide');
  if (!video) throw new Error(`${file}: no video track`);

  const segments = [];
  let videoEnd = 0;
  for (let i = 0; i < top.length; i += 1) {
    if (top[i].type !== 'moof') continue;
    const moof = top[i];
    const mdat = top[i + 1];
    if (mdat?.type !== 'mdat') throw new Error(`${file}: moof at ${moof.start} without mdat`);
    let time = null;
    for (const traf of inner(moof).filter((b) => b.type === 'traf')) {
      const tfhd = child(traf, 'tfhd');
      if (buf.readUInt32BE(tfhd.body + 4) !== video.id) continue;
      const tfdt = child(traf, 'tfdt');
      const decode = buf[tfdt.body] === 1 ? Number(buf.readBigUInt64BE(tfdt.body + 4)) : buf.readUInt32BE(tfdt.body + 4);
      time = decode / video.timescale;
      // The fragment's video duration, from trun (or tfhd's default).
      const flags = buf.readUInt32BE(tfhd.body) & 0xffffff;
      let offset = tfhd.body + 8;
      if (flags & 0x01) offset += 8;
      if (flags & 0x02) offset += 4;
      const defaultDuration = flags & 0x08 ? buf.readUInt32BE(offset) : 0;
      const trun = child(traf, 'trun');
      const trunFlags = buf.readUInt32BE(trun.body) & 0xffffff;
      const count = buf.readUInt32BE(trun.body + 4);
      let at = trun.body + 8;
      if (trunFlags & 0x01) at += 4;
      if (trunFlags & 0x04) at += 4;
      const stride = [0x100, 0x200, 0x400, 0x800].filter((f) => trunFlags & f).length * 4;
      let ticks = 0;
      for (let s = 0; s < count; s += 1) {
        ticks += trunFlags & 0x100 ? buf.readUInt32BE(at + s * stride) : defaultDuration;
      }
      videoEnd = Math.max(videoEnd, time + ticks / video.timescale);
    }
    if (time === null) {
      if (!segments.length) throw new Error(`${file}: first fragment has no video`);
      segments[segments.length - 1].length = mdat.end - segments[segments.length - 1].offset;
      continue;
    }
    segments.push({ offset: moof.start, length: mdat.end - moof.start, time });
  }
  if (!segments.length) throw new Error(`${file}: no fragments`);
  if (segments[0].time > 0.05) throw new Error(`${file}: first fragment starts at ${segments[0].time}s`);
  segments.forEach((segment, index) => {
    segment.duration = (segments[index + 1]?.time ?? videoEnd) - segment.time;
    if (!(segment.duration > 0)) throw new Error(`${file}: segment ${index} has duration ${segment.duration}`);
  });

  const target = Math.ceil(Math.max(...segments.map((s) => s.duration)));
  const text = [
    '#EXTM3U',
    '#EXT-X-VERSION:7',
    `#EXT-X-TARGETDURATION:${target}`,
    '#EXT-X-PLAYLIST-TYPE:VOD',
    '#EXT-X-MEDIA-SEQUENCE:0',
    `#EXT-X-MAP:URI="${uri}",BYTERANGE="${moov.end}@0"`,
    ...segments.flatMap((s) => [`#EXTINF:${s.duration.toFixed(6)},`, `#EXT-X-BYTERANGE:${s.length}@${s.offset}`, uri]),
    '#EXT-X-ENDLIST',
    '',
  ].join('\n');
  return { text, segments: segments.length, duration: videoEnd, initBytes: moov.end, firstBytes: segments[0].length };
};

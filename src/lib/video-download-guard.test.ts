import { beforeAll, describe, expect, it } from 'vitest';
import { installVideoDownloadGuard } from '@/lib/video-download-guard';

const fire = (target: Element, type: 'contextmenu' | 'dragstart') => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event.defaultPrevented;
};

describe('installVideoDownloadGuard', () => {
  beforeAll(() => {
    installVideoDownloadGuard();
    installVideoDownloadGuard();
  });

  it('blocks the context menu and dragging on any video', () => {
    const video = document.createElement('video');
    document.body.appendChild(video);
    expect(fire(video, 'contextmenu')).toBe(true);
    expect(fire(video, 'dragstart')).toBe(true);
    video.remove();
  });

  it('covers videos created outside React, added after install', () => {
    const wrap = document.createElement('div');
    const video = document.createElement('video');
    const track = document.createElement('track');
    video.appendChild(track);
    wrap.appendChild(video);
    document.body.appendChild(wrap);
    expect(fire(track, 'contextmenu')).toBe(true);
    wrap.remove();
  });

  it('leaves the rest of the page alone', () => {
    const link = document.createElement('a');
    const image = document.createElement('img');
    document.body.append(link, image);
    expect(fire(link, 'contextmenu')).toBe(false);
    expect(fire(image, 'contextmenu')).toBe(false);
    link.remove();
    image.remove();
  });
});

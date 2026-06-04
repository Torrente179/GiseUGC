import { useEffect, useRef, useState } from 'react';
import {
  registerMediaPlaybackEntry,
  type MediaPlaybackPriority,
} from '@/lib/media-playback-scheduler';

export const useMediaPlaybackSlot = (
  active: boolean,
  priority: MediaPlaybackPriority,
  enabled = true,
) => {
  const [granted, setGranted] = useState(!enabled);
  const registrationRef = useRef<ReturnType<typeof registerMediaPlaybackEntry> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setGranted(true);
      return undefined;
    }

    registrationRef.current = registerMediaPlaybackEntry(setGranted, priority);
    return () => {
      registrationRef.current?.unregister();
      registrationRef.current = null;
    };
  }, [enabled, priority]);

  useEffect(() => {
    if (!enabled) return;
    registrationRef.current?.update(active, priority);
  }, [active, enabled, priority]);

  return enabled ? granted : true;
};

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import notifSound from '@/assets/sounds/message-received.mp3';
import sentSound from '@/assets/sounds/message-sent.mp3';
import { api } from '@/auth/utils/api';

import { NotificationsContext } from './NotificationsContext.ts';
import type { NotificationEventDTO } from './types/notifications';
import { useChatSocket } from './ws/useChatSocket';

export function NotificationsProvider({
  currentUserId,
  children,
}: {
  currentUserId: string;
  children: React.ReactNode;
}) {
  const [unreadByGroup, setUnreadByGroup] = useState<Record<string, number>>({});
  const originalTitleRef = useRef<string>(document.title);

  const unlockedRef = useRef(false);
  const receiveAudioRef = useRef<HTMLAudioElement | null>(null);
  const sendAudioRef = useRef<HTMLAudioElement | null>(null);
  const [latestPreview, setLatestPreview] = useState<string>('');

  const normalizePreview = (s: string) => s.replace(/\s+/g, ' ').trim();

  const shorten = (s: string, max = 60) => (s.length > max ? s.slice(0, max) + '…' : s);
  useEffect(() => {
    receiveAudioRef.current = new Audio(notifSound);
    receiveAudioRef.current.preload = 'auto';
    receiveAudioRef.current.volume = 0.6;

    sendAudioRef.current = new Audio(sentSound);
    sendAudioRef.current.preload = 'auto';
    sendAudioRef.current.volume = 0.1;
  }, []);

  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;

      const audios = [receiveAudioRef.current, sendAudioRef.current].filter(
        Boolean
      ) as HTMLAudioElement[];
      if (audios.length === 0) return;

      audios.forEach(a => {
        const prevVolume = a.volume;
        a.volume = 0;
        a.play()
          .then(() => {
            a.pause();
            a.currentTime = 0;
          })
          .catch(() => {})
          .finally(() => {
            a.volume = prevVolume;
          });
      });
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const playSound = useCallback(() => {
    const a = receiveAudioRef.current;
    if (!a) return;
    if (!unlockedRef.current) return;

    a.currentTime = 0;
    void a.play().catch(() => {});
  }, []);

  const playSendSound = useCallback(() => {
    const a = sendAudioRef.current;
    if (!a) return;
    if (!unlockedRef.current) return;

    a.currentTime = 0;
    void a.play().catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadUnread = async () => {
      try {
        const res = await api.get<Record<string, number>>('/notifications/unread');
        if (cancelled) return;
        setUnreadByGroup(res.data ?? {});
      } catch (e) {
        console.warn('Failed to fetch unread counts', e);
      }
    };

    void loadUnread();

    return () => {
      cancelled = true;
    };
  }, []);

  const onNotification = useCallback(
    (evt: NotificationEventDTO) => {
      if (!evt) return;

      if (evt.type === 'MESSAGE_CREATED') {
        if (evt.fromUserId === currentUserId) return;

        const groupId = String(evt.groupId);
        const nextCount = typeof evt.unreadCount === 'number' ? evt.unreadCount : undefined;

        const preview = evt.content ? shorten(normalizePreview(String(evt.content))) : '';
        if (preview) {
          setLatestPreview(preview);
        }

        setUnreadByGroup(prev => {
          const prevCount = prev[groupId] ?? 0;
          const computed = nextCount ?? prevCount + 1;
          if (computed === prevCount) return prev;
          return { ...prev, [groupId]: computed };
        });

        playSound();
        return;
      }

      if (evt.type === 'GROUP_READ') {
        const groupId = String(evt.groupId);
        setUnreadByGroup(prev => {
          if ((prev[groupId] ?? 0) === 0) return prev;
          return { ...prev, [groupId]: 0 };
        });
      }
    },
    [currentUserId, playSound]
  );

  useChatSocket({ currentUserId, onNotification });

  const totalUnread = useMemo(
    () => Object.values(unreadByGroup).reduce((a, b) => a + (b ?? 0), 0),
    [unreadByGroup]
  );

  useEffect(() => {
    const base = originalTitleRef.current;

    if (totalUnread > 0) {
      const previewPart = latestPreview ? ` ${latestPreview}` : '';
      document.title = `(${totalUnread})${previewPart} — ${base}`;
    } else {
      document.title = base;
    }
  }, [totalUnread, latestPreview]);

  useEffect(() => {
    if (totalUnread === 0) setLatestPreview('');
  }, [totalUnread]);

  const markGroupRead = useCallback(async (groupId: string) => {
    const gid = String(groupId);

    setUnreadByGroup(prev => ({ ...prev, [gid]: 0 }));

    try {
      await api.post('/notifications/read', { groupId: gid });
    } catch (e) {
      console.warn('Failed to mark group read', e);
      try {
        const res = await api.get<Record<string, number>>('/notifications/unread');
        setUnreadByGroup(res.data ?? {});
      } catch (e2) {
        console.warn('Failed to re-sync unread counts', e2);
      }
    }
  }, []);

  const value = useMemo(
    () => ({ unreadByGroup, totalUnread, markGroupRead, playSendSound }),
    [unreadByGroup, totalUnread, markGroupRead, playSendSound]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import notifSound from '@/assets/sounds/message-received.mp3';
import sentSound from '@/assets/sounds/message-sent.mp3';
import { api } from '@/auth/utils/api';

import { NotificationsContext } from './NotificationsContext';
import type { NotificationEventDTO } from './types/notifications';
import { useChatSocket } from './ws/useChatSocket';

type UnreadMap = Record<string, number>;

function useStableCallback<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback(((...args: unknown[]) => fnRef.current(...args)) as T, []);
}

export function NotificationsProvider({
  currentUserId,
  children,
}: {
  currentUserId: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const originalTitleRef = useRef<string>(document.title);

  const unlockedRef = useRef(false);
  const receiveAudioRef = useRef<HTMLAudioElement | null>(null);
  const sendAudioRef = useRef<HTMLAudioElement | null>(null);
  const [latestPreview, setLatestPreview] = useState('');

  const unreadKey = useMemo(
    () => ['notifications', 'unread', currentUserId] as const,
    [currentUserId]
  );

  const { data: unreadByGroup = {} } = useQuery<UnreadMap>({
    queryKey: unreadKey,
    queryFn: async () => {
      const res = await api.get<UnreadMap>('/notifications/unread');
      return res.data ?? {};
    },
    enabled: Boolean(currentUserId),
    staleTime: 10_000,
  });

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
        (a): a is HTMLAudioElement => Boolean(a)
      );

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

  const playReceiveSound = () => {
    const a = receiveAudioRef.current;
    if (!a || !unlockedRef.current) return;

    a.currentTime = 0;
    void a.play().catch(() => {});
  };

  // exposed via context → must be stable
  const playSendSound = useStableCallback(() => {
    const a = sendAudioRef.current;
    if (!a || !unlockedRef.current) return;

    a.currentTime = 0;
    void a.play().catch(() => {});
  });

  const updateUnreadCache = useCallback(
    (updater: (prev: UnreadMap) => UnreadMap) => {
      queryClient.setQueryData<UnreadMap>(unreadKey, prev => updater(prev ?? {}));
    },
    [queryClient, unreadKey]
  );

  const onNotification = useCallback(
    (evt: NotificationEventDTO) => {
      if (!evt) return;

      // helperiai vietoje → jokių deps warningų
      const normalizePreview = (s: string) => s.replace(/\s+/g, ' ').trim();
      const shorten = (s: string, max = 60) => (s.length > max ? s.slice(0, max) + '…' : s);

      if (evt.type === 'MESSAGE_CREATED') {
        if (evt.fromUserId === currentUserId) return;

        const groupId = String(evt.groupId);
        const nextCount = typeof evt.unreadCount === 'number' ? evt.unreadCount : undefined;

        const preview = evt.content ? shorten(normalizePreview(String(evt.content))) : '';

        if (preview) setLatestPreview(preview);

        updateUnreadCache(prev => {
          const prevCount = prev[groupId] ?? 0;
          const computed = nextCount ?? prevCount + 1;
          return computed === prevCount ? prev : { ...prev, [groupId]: computed };
        });

        playReceiveSound();
        return;
      }

      if (evt.type === 'GROUP_READ') {
        const groupId = String(evt.groupId);
        updateUnreadCache(prev => (prev[groupId] ? { ...prev, [groupId]: 0 } : prev));
      }
    },
    [currentUserId, updateUnreadCache]
  );

  useChatSocket({ currentUserId, onNotification });

  const totalUnread = useMemo(
    () => Object.values(unreadByGroup).reduce((a, b) => a + b, 0),
    [unreadByGroup]
  );

  useEffect(() => {
    const base = originalTitleRef.current;
    document.title = totalUnread > 0 ? `(${totalUnread}) ${latestPreview} — ${base}` : base;
  }, [totalUnread, latestPreview]);

  useEffect(() => {
    if (totalUnread === 0) setLatestPreview('');
  }, [totalUnread]);

  const markGroupRead = useCallback(
    async (groupId: string) => {
      const gid = String(groupId);

      updateUnreadCache(prev => ({ ...prev, [gid]: 0 }));

      try {
        await api.post('/notifications/read', { groupId: gid });
      } catch {
        void queryClient.invalidateQueries({ queryKey: unreadKey });
      }
    },
    [queryClient, unreadKey, updateUnreadCache]
  );

  const value = useMemo(
    () => ({ unreadByGroup, totalUnread, markGroupRead, playSendSound }),
    [unreadByGroup, totalUnread, markGroupRead, playSendSound]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

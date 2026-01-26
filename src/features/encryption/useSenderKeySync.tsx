import { useEffect } from 'react';

import { api } from '@/auth/utils/api';
import { useWebSocket } from '@/hooks/useWebSocket';

import { base64ToArrayBuffer } from './encoding';
import { getDeviceId, getSenderKey } from './indexedDb';
import { shareSharedSecretWithSpecificDevice } from './sharedSecretCreation';
import { tryFetchAndDecryptSenderKey } from './sharedSecretReceive';

type PendingSenderKeyRequestRow = {
  id: number;
  chatId: string;
  requesterUserId: string;
  requesterDeviceId: string;
  createdAt: string;
};

export function useSenderKeySync(
  chatId: string,
  currentUserId: string,
  onKeyReceived?: () => void
) {
  const { client, isConnected } = useWebSocket();

  useEffect(() => {
    if (!chatId || !isConnected || !client) return;

    let cancelled = false;
    let requestSub: { unsubscribe: () => void } | null = null;
    let availableSub: { unsubscribe: () => void } | null = null;

    void (async () => {
      const fulfillPendingRequestsIfPossible = async () => {
        const mySenderKey = await getSenderKey(chatId);
        if (!mySenderKey) return;

        const myDeviceId = await getDeviceId();

        let pending: PendingSenderKeyRequestRow[] = [];
        try {
          const res = await api.get<PendingSenderKeyRequestRow[]>(
            `/encryption/sender-keys/requests/pending?chatId=${encodeURIComponent(chatId)}`
          );
          pending = Array.isArray(res.data) ? res.data : [];
        } catch (e: unknown) {
          const err = e as { response?: { status?: number } };
          if (err?.response?.status !== 204) {
            console.error('Failed to fetch pending sender-key requests', e);
          }
          return;
        }

        if (cancelled || pending.length === 0) return;

        const senderKeyRaw = base64ToArrayBuffer(mySenderKey.key);

        for (const req of pending) {
          if (cancelled) return;

          if (req.requesterUserId === currentUserId && req.requesterDeviceId === myDeviceId)
            continue;

          await shareSharedSecretWithSpecificDevice(
            chatId,
            senderKeyRaw,
            currentUserId,
            myDeviceId,
            req.requesterUserId,
            req.requesterDeviceId
          );
        }
      };

      try {
        await fulfillPendingRequestsIfPossible();
      } catch (e) {
        console.error('Durable sender-key fulfillment failed', e);
      }

      requestSub = client.subscribe(`/topic/groups.${chatId}.senderkey.requests`, message => {
        void (async () => {
          const request = JSON.parse(message.body) as {
            chatId: string;
            requesterUserId: string;
            requesterDeviceId: string;
          };

          const mySenderKey = await getSenderKey(chatId);
          if (!mySenderKey) return;

          const myDeviceId = await getDeviceId();

          if (request.requesterDeviceId === myDeviceId && request.requesterUserId === currentUserId)
            return;

          const senderKeyRaw = base64ToArrayBuffer(mySenderKey.key);

          await shareSharedSecretWithSpecificDevice(
            chatId,
            senderKeyRaw,
            currentUserId,
            myDeviceId,
            request.requesterUserId,
            request.requesterDeviceId
          );
        })();
      });

      const deviceId = await getDeviceId();
      if (cancelled) return;

      availableSub = client.subscribe(`/topic/device.${deviceId}.senderkey.available`, message => {
        void (async () => {
          const data = JSON.parse(message.body) as { chatId: string; toDeviceId: string };

          if (data.chatId !== chatId) return;

          const success = await tryFetchAndDecryptSenderKey(chatId, currentUserId);
          if (success) {
            onKeyReceived?.();

            try {
              await fulfillPendingRequestsIfPossible();
            } catch (e) {
              console.error('Post-receive durable fulfillment failed', e);
            }
          }
        })();
      });
    })();

    return () => {
      cancelled = true;
      requestSub?.unsubscribe();
      availableSub?.unsubscribe();
    };
  }, [chatId, currentUserId, client, isConnected, onKeyReceived]);
}

import { useState, useCallback } from 'react';
import type { SendStatus, SendResult, SendPayload } from '../types';
import mockSendNotification from '../mocks/mockSendApi';

export default function useSendNotification() {
  const [status, setStatus] = useState<SendStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SendResult | null>(null);

  const startConfirmation = useCallback(() => {
    setStatus('confirming');
  }, []);

  const cancelConfirmation = useCallback(() => {
    setStatus('idle');
  }, []);

  const confirmAndSend = useCallback(async (payload: SendPayload) => {
    setStatus('sending');
    setProgress(0);

    try {
      const sendResult = await mockSendNotification(
        payload,
        (p) => setProgress(p)
      );
      setResult(sendResult);
      setStatus(sendResult.success ? 'success' : 'error');
    } catch (error) {
      setResult({
        success: false,
        sentCount: 0,
        errorMessage: 'Произошла ошибка при отправке',
      });
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setResult(null);
  }, []);

  return {
    status,
    progress,
    result,
    startConfirmation,
    cancelConfirmation,
    confirmAndSend,
    reset,
  };
}
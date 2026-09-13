import type { SendPayload, SendResult } from '../types';

/**
 * Мок-API отправки уведомления.
 * Имитирует задержку и успешный ответ.
 * Реальный API подключим, когда бэк 2.1 будет готов.
 */
export default async function mockSendNotification(
  payload: SendPayload,
  onProgress?: (progress: number) => void
): Promise<SendResult> {
  const totalSteps = 5;

  for (let i = 0; i < totalSteps; i++) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const progress = Math.round(((i + 1) / totalSteps) * 100);
    onProgress?.(progress);
  }

  // Мок: считаем количество получателей
  const sentCount = payload.recipients
    .split(/[\s,;]+/)
    .filter(Boolean).length;

  return {
    success: true,
    sentCount,
  };
}
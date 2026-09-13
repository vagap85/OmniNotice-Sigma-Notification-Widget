import type { Channel } from '../types';

export const mockChannels: Channel[] = [
  {
    id: 'email',
    name: 'По e-mail',
    icon: '📧',
    description: 'Отправить на почту',
    available: true,
  },
  {
    id: 'sms',
    name: 'По смс',
    icon: '📱',
    description: 'SMS-сообщение',
    available: false, // «СКОРО»
  },
  {
    id: 'telegram',
    name: 'В телеграм',
    icon: '✈️',
    description: 'Telegram-сообщение',
    available: false,
  },
  {
    id: 'max',
    name: 'В MAX',
    icon: '💬',
    description: 'Сообщение в MAX',
    available: false,
  },
];
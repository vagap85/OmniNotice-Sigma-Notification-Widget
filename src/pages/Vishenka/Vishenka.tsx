import { useState } from 'react';
import './Vishenka.css';
import { mockChannels } from './mocks/mockChannels';
import useSendNotification from './hooks/useSendNotification';
import ConfirmDialog from './components/ConfirmDialog';
import ProgressBar from './components/ProgressBar';
import ResultMessage from './components/ResultMessage';
import type { DeliveryChannel } from './types';

export default function Vishenka() {
  const [channel, setChannel] = useState<DeliveryChannel>('email');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const {
    status,
    progress,
    result,
    startConfirmation,
    cancelConfirmation,
    confirmAndSend,
    reset,
  } = useSendNotification();

  const recipientsCount = recipients
    .split(/\s+/)
    .filter(Boolean).length;

  const selectedChannel = mockChannels.find((c) => c.id === channel);

  const canSend = recipientsCount > 0 && subject.trim().length > 0;

  const handleConfirm = () => {
    confirmAndSend({ channel, recipients, subject, message });
  };

  return (
    <div className="vishenka">
      <h1>🍒 Вишенка — создание рассылки</h1>
      <p className="vishenka__subtitle">
        Заглушка. Реальный переход из OmniNotice подключим после 2.1
      </p>

      {/* Меню каналов */}
      <div className="vishenka__channels">
        {mockChannels.map((ch) => (
          <button
            key={ch.id}
            className={`channel-btn ${
              channel === ch.id ? 'channel-btn--active' : ''
            } ${!ch.available ? 'channel-btn--disabled' : ''}`}
            onClick={() => ch.available && setChannel(ch.id)}
            disabled={!ch.available}
          >
            <span>{ch.icon}</span>
            <span>{ch.name}</span>
            {!ch.available && <span className="channel-btn__badge">СКОРО</span>}
          </button>
        ))}
      </div>

      {/* Форма */}
      <div className="vishenka__content">
        <div className="vishenka__form">
          <label>
            Тема
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Специальное предложение"
              maxLength={70}
            />
            <span>{subject.length}/70</span>
          </label>

          <label>
            Сообщение
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите текст рассылки"
            />
          </label>
        </div>

        <aside className="vishenka__sidebar">
          <label>
            Получатели
            <textarea
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="example@mail.com user@yandex.ru"
            />
          </label>
          <p>Добавлено адресов: {recipientsCount}</p>
          <button
            className="btn btn--primary"
            disabled={!canSend}
            onClick={startConfirmation}
          >
            Отправить
          </button>
        </aside>
      </div>

      {/* Модалки */}
      {status === 'confirming' && selectedChannel && (
        <ConfirmDialog
          channelName={selectedChannel.name}
          recipientsCount={recipientsCount}
          onConfirm={handleConfirm}
          onCancel={cancelConfirmation}
        />
      )}

      {status === 'sending' && <ProgressBar progress={progress} />}

      {(status === 'success' || status === 'error') && result && (
        <ResultMessage result={result} onClose={reset} />
      )}
    </div>
  );
}
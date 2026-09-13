import type { SendResult } from '../types';

interface ResultMessageProps {
  result: SendResult;
  onClose: () => void;
}

export default function ResultMessage({ result, onClose }: ResultMessageProps) {
  return (
    <div className="result-message">
      {result.success ? (
        <p>✅ Успешно отправлено {result.sentCount} получателям!</p>
      ) : (
        <p>❌ {result.errorMessage}</p>
      )}
      <button onClick={onClose} className="btn btn--primary">
        Закрыть
      </button>
    </div>
  );
}
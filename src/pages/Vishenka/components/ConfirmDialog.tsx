interface ConfirmDialogProps {
  channelName: string;
  recipientsCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  channelName,
  recipientsCount,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog" role="dialog" aria-modal="true">
      <h3>Подтвердите отправку</h3>
      <p>
        Канал: <strong>{channelName}</strong>
      </p>
      <p>
        Получателей: <strong>{recipientsCount}</strong>
      </p>
      <div className="confirm-dialog__actions">
        <button onClick={onCancel} className="btn btn--secondary">
          Отмена
        </button>
        <button onClick={onConfirm} className="btn btn--primary">
          Подтвердить
        </button>
      </div>
    </div>
  );
}
interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <p>Отправка... {progress}%</p>
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
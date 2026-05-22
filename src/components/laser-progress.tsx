import type { CSSProperties } from "react";
import "./laser-progress.css";

type LaserVariant = "blue" | "green";

type LaserProgressBarProps = {
  progress: number; // 0 - 100
  variant?: LaserVariant;
  label?: string;
  showPercentage?: boolean;
  className?: string;
};

const SPARK_COUNT = 18;

export function LaserProgressBar({
  progress,
  variant = "blue",
  label = "Processing",
  showPercentage = true,
  className = "",
}: LaserProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={`laser-progress laser-progress--${variant} ${className}`}
      style={
        {
          "--laser-progress": `${clampedProgress}%`,
        } as CSSProperties
      }
    >
      <div className="laser-progress__header">
        <span className="laser-progress__label">{label}</span>

        {showPercentage && (
          <span className="laser-progress__percentage">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>

      <div
        className="laser-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedProgress}
        aria-label={label}
      >
        <div className="laser-progress__fill">
          <div className="laser-progress__energy" />

          <div className="laser-progress__head">
            <div className="laser-progress__sparks">
              {Array.from({ length: SPARK_COUNT }).map((_, index) => (
                <span
                  key={index}
                  className="laser-progress__spark"
                  style={
                    {
                      "--spark-index": index,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
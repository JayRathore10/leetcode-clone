import { useEffect, useState } from "react";
import "./ContestTimer.css";

interface ContestTimerProps {
  targetDate: string; // ISO string
  onExpire?: () => void;
  label?: string;
}

export function ContestTimer({ targetDate, onExpire, label }: ContestTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    let hasExpired = false;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        if (!hasExpired) {
          hasExpired = true;
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          if (onExpire) onExpire();
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="contest-timer">
      {label && <div className="timer-label">{label}</div>}
      <div className="timer-display">
        {timeLeft.days > 0 && (
          <>
            <div className="timer-block">
              <span className="timer-val">{pad(timeLeft.days)}</span>
              <span className="timer-unit">d</span>
            </div>
            <span className="timer-sep">:</span>
          </>
        )}
        <div className="timer-block">
          <span className="timer-val">{pad(timeLeft.hours)}</span>
          <span className="timer-unit">h</span>
        </div>
        <span className="timer-sep">:</span>
        <div className="timer-block">
          <span className="timer-val">{pad(timeLeft.minutes)}</span>
          <span className="timer-unit">m</span>
        </div>
        <span className="timer-sep">:</span>
        <div className="timer-block">
          <span className="timer-val">{pad(timeLeft.seconds)}</span>
          <span className="timer-unit">s</span>
        </div>
      </div>
    </div>
  );
}

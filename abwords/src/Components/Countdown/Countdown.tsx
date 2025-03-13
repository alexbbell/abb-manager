import React, { useState, useEffect, useCallback } from "react";

interface CountdownProps {
  targetDate: string; // ISO date string (e.g., "2024-12-31T23:59:59")
  onTimeOut: () => void;
  isActive: boolean; // Whether the timer should run
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onTimeOut, isActive }) => {
  const calculateTimeLeft =  useCallback(() => {
    const now = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());


  useEffect(() => {
    if (!isActive) return; // Timer only runs if isActive is true

    // Immediately update the timer when it starts
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer); // Stop timer
        onTimeOut(); // Notify parent when time runs out
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount or isActive change
  }, [isActive, targetDate, onTimeOut, calculateTimeLeft]);

  return (
    <div>
      { (timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0) || !isActive ? (
        <div>Time is up!</div>
      ) : (
        <div>
          <span>{timeLeft.days} days </span>
          <span>{timeLeft.hours} hours </span>
          <span>{timeLeft.minutes} minutes </span>
          <span>{timeLeft.seconds} seconds</span>
        </div>
      )}
    </div>
  );
};

export default Countdown;

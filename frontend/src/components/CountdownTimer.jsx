import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import './CountdownTimer.css';

const CountdownTimer = () => {
    // Set deadline to FCA claim deadline (in real scenario, this would be configurable)
    // For demo, we'll set it to a future date
    const getDeadline = () => {
        const deadline = new Date('2026-06-30T23:59:59');
        return deadline;
    };

    const calculateTimeLeft = () => {
        const difference = getDeadline() - new Date();

        if (difference <= 0) {
            return null;
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            // Set urgent mode if less than 30 days
            if (newTimeLeft && newTimeLeft.days < 30) {
                setIsUrgent(true);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) {
        return null; // Deadline passed
    }

    return (
        <div className={`countdown-timer ${isUrgent ? 'urgent' : ''}`}>
            <div className="countdown-inner">
                <div className="countdown-icon">
                    {isUrgent ? <AlertTriangle size={20} /> : <Clock size={20} />}
                </div>
                <div className="countdown-content">
                    <span className="countdown-label">FCA Claim Deadline:</span>
                    <div className="countdown-time">
                        <div className="time-unit">
                            <span className="time-value">{String(timeLeft.days).padStart(2, '0')}</span>
                            <span className="time-label">Days</span>
                        </div>
                        <span className="time-separator">:</span>
                        <div className="time-unit">
                            <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="time-label">Hours</span>
                        </div>
                        <span className="time-separator">:</span>
                        <div className="time-unit">
                            <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="time-label">Mins</span>
                        </div>
                        <span className="time-separator">:</span>
                        <div className="time-unit">
                            <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="time-label">Secs</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;

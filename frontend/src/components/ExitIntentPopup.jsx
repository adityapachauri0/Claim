import { useState, useEffect } from 'react';
import { X, Gift, Clock, ArrowRight } from 'lucide-react';
import './ExitIntentPopup.css';

const ExitIntentPopup = ({ onStartClaim }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if popup was already shown in this session
        if (sessionStorage.getItem('exitPopupShown')) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e) => {
            // Only trigger when mouse leaves through the top
            if (e.clientY <= 0 && !hasShown && !isVisible) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exitPopupShown', 'true');
            }
        };

        // Add listener after a short delay to avoid triggering on page load
        const timeout = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 5000);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasShown, isVisible]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleClaim = () => {
        setIsVisible(false);
        if (onStartClaim) {
            onStartClaim();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="exit-popup-overlay" onClick={handleClose}>
            <div className="exit-popup" onClick={(e) => e.stopPropagation()}>
                <button className="exit-popup-close" onClick={handleClose} aria-label="Close popup">
                    <X size={24} />
                </button>

                <div className="exit-popup-content">
                    <div className="exit-popup-icon">
                        <Gift size={48} />
                    </div>

                    <h2>Wait! Don't Leave Empty Handed</h2>
                    <p className="exit-popup-subtitle">
                        You could be owed <strong>£700+</strong> in mis-sold car finance compensation!
                    </p>

                    <div className="exit-popup-features">
                        <div className="feature-item">
                            <Clock size={20} />
                            <span>60-second eligibility check</span>
                        </div>
                        <div className="feature-item">
                            <Gift size={20} />
                            <span>100% FREE to check</span>
                        </div>
                    </div>

                    <div className="exit-popup-urgency">
                        <span className="urgency-badge">⚡ Limited Time</span>
                        <p>FCA deadline approaching - check your eligibility before it's too late!</p>
                    </div>

                    <button className="btn btn-primary btn-large exit-popup-cta" onClick={handleClaim}>
                        Check My Eligibility Now
                        <ArrowRight size={20} />
                    </button>

                    <p className="exit-popup-note">
                        No credit check • No upfront fees • No obligation
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExitIntentPopup;

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import './RecentClaims.css';

// Sample recent claims data (in production, this could come from an API)
const claimsData = [
    { name: 'Sarah M.', location: 'Birmingham', amount: 680 },
    { name: 'David K.', location: 'Manchester', amount: 920 },
    { name: 'Emma T.', location: 'Leeds', amount: 750 },
    { name: 'Michael R.', location: 'Bristol', amount: 1100 },
    { name: 'Jessica P.', location: 'Liverpool', amount: 540 },
    { name: 'James H.', location: 'Sheffield', amount: 890 },
    { name: 'Sophie W.', location: 'Newcastle', amount: 720 },
    { name: 'Oliver B.', location: 'Nottingham', amount: 650 },
    { name: 'Charlotte L.', location: 'Cardiff', amount: 980 },
    { name: 'Thomas A.', location: 'Edinburgh', amount: 830 },
    { name: 'Grace F.', location: 'Glasgow', amount: 770 },
    { name: 'Harry C.', location: 'Belfast', amount: 615 },
    { name: 'Amelia D.', location: 'Southampton', amount: 945 },
    { name: 'Jack N.', location: 'Brighton', amount: 580 },
    { name: 'Mia S.', location: 'Oxford', amount: 1050 }
];

// Generate random time ago string
const getRandomTimeAgo = () => {
    const options = [
        '2 minutes ago',
        '5 minutes ago',
        '8 minutes ago',
        '12 minutes ago',
        '15 minutes ago',
        '23 minutes ago',
        '35 minutes ago',
        '1 hour ago',
        '2 hours ago'
    ];
    return options[Math.floor(Math.random() * options.length)];
};

const RecentClaims = () => {
    const [currentClaim, setCurrentClaim] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [claimIndex, setClaimIndex] = useState(0);

    useEffect(() => {
        // Show first claim after 3 seconds
        const initialDelay = setTimeout(() => {
            showNextClaim();
        }, 3000);

        return () => clearTimeout(initialDelay);
    }, []);

    useEffect(() => {
        if (currentClaim) {
            // Hide after 5 seconds
            const hideTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 5000);

            // Show next claim after 8-15 seconds
            const nextTimeout = setTimeout(() => {
                showNextClaim();
            }, 8000 + Math.random() * 7000);

            return () => {
                clearTimeout(hideTimeout);
                clearTimeout(nextTimeout);
            };
        }
    }, [currentClaim]);

    const showNextClaim = () => {
        const claim = claimsData[claimIndex % claimsData.length];
        setCurrentClaim({
            ...claim,
            timeAgo: getRandomTimeAgo()
        });
        setClaimIndex(prev => prev + 1);
        setIsVisible(true);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!currentClaim) return null;

    return (
        <div className={`recent-claims-ticker ${isVisible ? 'visible' : ''}`}>
            <div className="ticker-content">
                <div className="ticker-icon">
                    <CheckCircle size={20} />
                </div>
                <div className="ticker-text">
                    <span className="ticker-name">{currentClaim.name}</span>
                    <span className="ticker-location">from {currentClaim.location}</span>
                    <span className="ticker-amount">just claimed <strong>£{currentClaim.amount}</strong></span>
                    <span className="ticker-time">{currentClaim.timeAgo}</span>
                </div>
                <button className="ticker-close" onClick={handleClose} aria-label="Close notification">
                    ×
                </button>
            </div>
        </div>
    );
};

export default RecentClaims;

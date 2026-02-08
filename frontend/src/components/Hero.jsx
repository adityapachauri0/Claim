import { Shield, Clock, Users, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import './Hero.css';

const Hero = ({ onStartClaim }) => {
    const stats = [
        { icon: <Shield size={24} />, value: '100%', label: 'No Win No Fee' },
        { icon: <Clock size={24} />, value: '60s', label: 'Quick Check' },
        { icon: <Users size={24} />, value: '400k+', label: 'Customers Helped' },
    ];

    const trustPoints = [
        'FCA Approved Claims Process',
        'No Upfront Fees or Costs',
        'Free Initial Case Assessment',
        'Average Payout £700 Per Claim'
    ];

    return (
        <section className="hero" id="hero">
            {/* Background Image + Overlay */}
            <div className="hero-background">
                <div className="hero-image-bg"></div>
                <div className="hero-overlay"></div>
                <div className="hero-particles">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                        }}></div>
                    ))}
                </div>
            </div>

            <div className="container hero-container">
                <div className="hero-content">
                    {/* Trust Badges */}
                    <div className="hero-trust-badges animate-fadeInUp">
                        <img src="/images/badge-fca.png" alt="FCA Authorised Partner" className="trust-badge" />
                        <img src="/images/badge-no-fee.png" alt="No Win No Fee" className="trust-badge" />
                    </div>

                    <div className="hero-badge animate-fadeInUp">
                        <span className="badge badge-accent">
                            <span className="pulse-dot"></span>
                            Claim Deadline Approaching - Act Now
                        </span>
                    </div>

                    <h1 className="hero-title animate-fadeInUp stagger-1">
                        Were You Mis-Sold Car Finance? <span className="highlight">Claim Up to £700+</span>
                    </h1>

                    <p className="hero-subtitle animate-fadeInUp stagger-2">
                        <strong>Millions of UK drivers</strong> were charged hidden commissions on PCP & HP car finance agreements without their knowledge.
                        You could be owed compensation. <strong>Check your eligibility in under 60 seconds</strong> – it's completely free.
                    </p>

                    {/* Trust Points */}
                    <ul className="hero-checklist animate-fadeInUp stagger-2">
                        {trustPoints.map((point, idx) => (
                            <li key={idx}>
                                <CheckCircle2 size={18} className="check-icon" />
                                {point}
                            </li>
                        ))}
                    </ul>

                    <div className="hero-cta animate-fadeInUp stagger-3">
                        <button className="btn btn-primary btn-large" onClick={onStartClaim}>
                            Check If You're Eligible Now
                            <ArrowRight size={20} />
                        </button>
                        <span className="cta-note">
                            <Star size={14} className="star-icon" />
                            Rated Excellent on Trustpilot • 4.8/5 (2,430 reviews)
                        </span>
                    </div>

                    <div className="hero-stats animate-fadeInUp stagger-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-icon">{stat.icon}</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero-visual animate-fadeInUp stagger-3">
                    <div className="hero-card">
                        <div className="card-header">
                            <span className="card-icon">💷</span>
                            <span className="card-title">Average Claim Payout</span>
                        </div>
                        <div className="card-amount">£700</div>
                        <div className="card-subtitle">per finance agreement</div>
                        <div className="card-progress">
                            <div className="progress-bar"></div>
                        </div>
                        <div className="card-stat">
                            <span>£8 Billion+</span> expected to be reclaimed
                        </div>
                    </div>

                    {/* Floating testimonial */}
                    <div className="floating-testimonial">
                        <img src="/images/person-1.png" alt="Customer" className="testimonial-avatar" />
                        <div className="testimonial-content">
                            <p>"Submitted for my 2019 PCP claim easily!"</p>
                            <span>James T., Manchester</span>
                        </div>
                    </div>

                    <div className="floating-badge badge-1">
                        <span>✓</span> Claim Submitted
                    </div>
                    <div className="floating-badge badge-2">
                        <span>£</span> No Win No Fee
                    </div>
                </div>
            </div>

            {/* As Seen In section */}
            <div className="hero-as-seen">
                <span>As reported by:</span>
                <div className="media-logos">
                    <span className="media-logo">The Guardian</span>
                    <span className="media-logo">BBC News</span>
                    <span className="media-logo">The Telegraph</span>
                    <span className="media-logo">Sky News</span>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <div className="mouse">
                    <div className="wheel"></div>
                </div>
                <span>Scroll to learn more</span>
            </div>
        </section>
    );
};

export default Hero;

import { Search, FileText, Send } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search size={32} />,
            number: '01',
            title: 'Check Your Eligibility',
            description: 'Complete our quick 60-second form with your basic details. We\'ll search for your car finance agreements linked to your name and address.',
            highlight: '60 seconds'
        },
        {
            icon: <FileText size={32} />,
            number: '02',
            title: 'We Find Your Agreements',
            description: 'Our system connects with major credit reference agencies to identify all your PCP and HP finance agreements, even those from years ago.',
            highlight: 'Automatic search'
        },
        {
            icon: <Send size={32} />,
            number: '03',
            title: 'We Submit Your Claim',
            description: 'Our expert team handles everything. We\'ll submit your claim to the relevant lenders and negotiate on your behalf to maximize your compensation.',
            highlight: 'No Win, No Fee'
        }
    ];

    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Simple Process</span>
                    <h2>How It Works</h2>
                    <p>Getting started takes just minutes. We handle the hard work so you don't have to.</p>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card animate-fadeInUp" style={{ animationDelay: `${index * 0.15}s` }}>
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                            <span className="step-highlight">{step.highlight}</span>
                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="cta-banner">
                    <div className="cta-content">
                        <h3>Ready to Start Your Claim?</h3>
                        <p>Join over 400,000 customers who have already checked their eligibility</p>
                    </div>
                    <a href="#claim-form" className="btn btn-primary btn-large">
                        Check My Eligibility
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

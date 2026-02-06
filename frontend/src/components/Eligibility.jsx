import { Check, AlertTriangle } from 'lucide-react';
import './Eligibility.css';

const Eligibility = () => {
    const eligibilityCriteria = [
        {
            text: 'You had PCP or HP car finance between April 2007 and November 2024',
            eligible: true
        },
        {
            text: 'You were not told about any commission paid to the dealer',
            eligible: true
        },
        {
            text: 'You felt the interest rate was higher than expected',
            eligible: true
        },
        {
            text: 'You were not offered alternative finance options',
            eligible: true
        },
        {
            text: 'You felt pressured into taking out the finance',
            eligible: true
        },
        {
            text: 'The dealer claimed to find you the "best deal" but was tied to one lender',
            eligible: true
        }
    ];

    const ineligibleCriteria = [
        {
            text: 'You purchased the vehicle outright without finance',
            eligible: false
        },
        {
            text: 'You took out a personal loan (not car-specific finance)',
            eligible: false
        },
        {
            text: 'Your finance was taken out before April 2007',
            eligible: false
        }
    ];

    return (
        <section className="eligibility" id="eligibility">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Check Your Eligibility</span>
                    <h2>Could You Be Owed Money?</h2>
                    <p>If any of the following apply to you, you may be entitled to compensation</p>
                </div>

                <div className="eligibility-grid">
                    <div className="eligibility-card eligible-card">
                        <div className="card-header-badge">
                            <Check size={20} />
                            <span>You May Be Eligible If...</span>
                        </div>
                        <ul className="criteria-list">
                            {eligibilityCriteria.map((item, index) => (
                                <li key={index} className="criteria-item">
                                    <span className="criteria-icon eligible">
                                        <Check size={16} />
                                    </span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        <a href="#claim-form" className="btn btn-primary">
                            Check My Eligibility
                        </a>
                    </div>

                    <div className="eligibility-card ineligible-card">
                        <div className="card-header-badge ineligible">
                            <AlertTriangle size={20} />
                            <span>You May Not Be Eligible If...</span>
                        </div>
                        <ul className="criteria-list">
                            {ineligibleCriteria.map((item, index) => (
                                <li key={index} className="criteria-item">
                                    <span className="criteria-icon ineligible">
                                        <AlertTriangle size={16} />
                                    </span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="not-sure-text">
                            Not sure if you're eligible? Start your check anyway – it's free and takes just 60 seconds.
                        </p>
                    </div>
                </div>

                <div className="stats-banner">
                    <div className="stat-box">
                        <span className="stat-number">£8 Billion</span>
                        <span className="stat-text">Expected to be paid out</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-number">14 Million</span>
                        <span className="stat-text">Affected agreements</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-number">£700</span>
                        <span className="stat-text">Average claim per agreement</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Eligibility;

import { Star, Quote, CheckCircle } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'James Thompson',
            location: 'Manchester',
            amount: '£820',
            lender: 'BMW Financial Services',
            rating: 5,
            text: 'I had no idea I could claim for my old PCP deal from 2019. The process was incredibly simple – I filled out the form in a few minutes and they handled everything else. My claim has been submitted and I\'m waiting for the outcome!',
            image: '/images/person-1.png',
            verified: true
        },
        {
            name: 'Sarah Mitchell',
            location: 'London',
            amount: '£1,234',
            lender: 'Black Horse Finance',
            rating: 5,
            text: 'I was skeptical at first but decided to give it a try. So glad I did! The team was incredibly helpful and patient with all my questions. They found two agreements I had completely forgotten about and submitted my claim.',
            image: '/images/person-2.png',
            verified: true
        },
        {
            name: 'Robert Clarke',
            location: 'Birmingham',
            amount: '£675',
            lender: 'Santander Consumer Finance',
            rating: 5,
            text: 'Quick and easy process from start to finish. Submitted my claim details and received confirmation that my application was accepted. The no win no fee policy gives me complete peace of mind.',
            image: '/images/person-3.png',
            verified: true
        }
    ];

    const stats = [
        { value: '£8.4 Billion', label: 'Expected Total Payouts' },
        { value: '400,000+', label: 'Customers Helped' },
        { value: '97%', label: 'Success Rate' },
        { value: 'Fully Managed', label: 'Claim Process', subtitle: 'We handle every step on your behalf.' }
    ];

    return (
        <section className="testimonials" id="testimonials">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Real Success Stories</span>
                    <h2>Thousands of Customers Have Claimed Successfully</h2>
                    <p>Join the hundreds of thousands of UK drivers who have already received their compensation. Here's what some of them had to say about their experience.</p>
                </div>

                {/* Stats Bar */}
                <div className="testimonials-stats">
                    {stats.map((stat, index) => (
                        <div key={index} className="testimonial-stat">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                            {stat.subtitle && <span className="stat-subtitle">{stat.subtitle}</span>}
                        </div>
                    ))}
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="testimonial-card animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="testimonial-header">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="avatar-image"
                                />
                                <div className="customer-info">
                                    <h4>
                                        {testimonial.name}
                                        {testimonial.verified && (
                                            <CheckCircle size={16} className="verified-icon" />
                                        )}
                                    </h4>
                                    <span className="location">{testimonial.location}</span>
                                </div>
                            </div>

                            <div className="rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="star filled" />
                                ))}
                            </div>

                            <div className="quote-icon">
                                <Quote size={24} />
                            </div>

                            <p className="testimonial-text">"{testimonial.text}"</p>

                            <div className="lender-tag">
                                <span>Claimed from:</span>
                                <strong>{testimonial.lender}</strong>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="trust-section">
                    <div className="trustpilot-badge">
                        <div className="tp-logo">★ Trustpilot</div>
                        <div className="tp-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} className="star filled" />
                            ))}
                        </div>
                        <span className="tp-rating">Rated <strong>4.8</strong> out of 5</span>
                        <span className="tp-reviews">Based on <strong>12,430</strong> verified reviews</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

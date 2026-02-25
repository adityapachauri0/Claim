import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-main">
                    <div className="footer-brand">
                        <a href="#" className="logo">
                            <span className="logo-icon">✓</span>
                            <span className="logo-text">PCP Claim <span className="logo-accent">Today</span></span>
                        </a>
                        <p className="brand-description">
                            Helping UK drivers reclaim compensation for mis-sold car finance.
                            Our expert team handles everything on a No Win, No Fee basis.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#eligibility">Am I Eligible?</a></li>
                            <li><a href="#faq">FAQs</a></li>
                            <li><a href="#claim-form">Start Your Claim</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/complaints">Complaints Procedure</Link></li>
                            <li><Link to="/cookies">Cookie Policy</Link></li>
                            <li><Link to="/gdpr">GDPR Compliance</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>
                                <Mail size={18} />
                                <div>
                                    <span>Email</span>
                                    <a href="mailto:info@pcpclaimtoday.co.uk">info@pcpclaimtoday.co.uk</a>
                                </div>
                            </li>
                            <li>
                                <Clock size={18} />
                                <div>
                                    <span>Opening Hours</span>
                                    <p>Mon-Fri: 9am-6pm</p>
                                </div>
                            </li>
                            <li>
                                <MapPin size={18} />
                                <div>
                                    <span>Address</span>
                                    <p>Houldsworth Mill, Houldsworth Street, Stockport, SK5 6DA</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-disclaimer">
                    <h5>Important Information</h5>
                    <p>
                        PCP Claim Today is a trading style of Bamboo Marketing NW Ltd. Bamboo Marketing NW Ltd is registered in England and Wales (Company No. 12686308) with its registered office at Houldsworth Mill, Houldsworth Street, Stockport, SK5 6DA.
                    </p>
                    <p>
                        Bamboo Marketing NW Ltd is authorised and regulated by the Financial Conduct Authority (FCA) under Firm Reference Number 930314. You can check this on the Financial Services Register at <a href="https://www.fca.org.uk/register" target="_blank" rel="noopener noreferrer">www.fca.org.uk/register</a>.
                    </p>
                    <p>
                        We are a claims management company. You can make a claim yourself for free without using our service.
                    </p>
                    <p>
                        Outcomes are not guaranteed and the amount you may receive will depend on the circumstances of your claim.
                    </p>
                    <p>
                        We do not provide legal or financial advice.
                    </p>
                    <p>
                        Telephone calls may be recorded and monitored for training, compliance and quality assurance purposes.
                    </p>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} PCP Claim Today. All rights reserved.</p>
                    <div className="footer-badges">
                        <span className="badge-item">FCA Regulated</span>
                        <span className="badge-item">ICO Registered</span>
                        <span className="badge-item">SSL Secured</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

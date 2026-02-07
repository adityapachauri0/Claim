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
                                    <p>123 Claim Street, London, EC1A 1BB</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-disclaimer">
                    <h5>Important Information</h5>
                    <p>
                        PCP Claim Today is a trading style of Example Claims Ltd, a company registered in England and Wales
                        (Company No. 12345678). We are authorised and regulated by the Financial Conduct Authority
                        (FRN 123456) in respect of regulated claims management activities.
                    </p>
                    <p>
                        We operate on a No Win, No Fee basis. You only pay a fee if your claim is successful.
                        Our fee is between 18-36% (including VAT) of any compensation received. You have the right
                        to make a claim directly to your lender or through the Financial Ombudsman Service for free.
                        For more details, please read our <a href="#">Terms and Conditions</a>.
                    </p>
                    <p>
                        The FCA has confirmed plans for an industry-wide motor finance compensation scheme expected
                        in 2026 covering agreements from April 2007 to November 2024.
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

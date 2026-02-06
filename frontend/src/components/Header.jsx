import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <a href="#" className="logo" onClick={() => scrollToSection('hero')}>
                        <span className="logo-icon">✓</span>
                        <span className="logo-text">PCP Claim <span className="logo-accent">Today</span></span>
                    </a>

                    <div className={`nav-links ${isMobileMenuOpen ? 'nav-links-open' : ''}`}>
                        <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
                            How It Works
                        </a>
                        <a href="#eligibility" onClick={(e) => { e.preventDefault(); scrollToSection('eligibility'); }}>
                            Am I Eligible?
                        </a>
                        <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>
                            FAQs
                        </a>
                        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
                            Contact
                        </a>
                    </div>

                    <div className="nav-actions">
                        <a href="tel:08001234567" className="phone-link">
                            <Phone size={18} />
                            <span>0800 123 4567</span>
                        </a>
                        <button
                            className="btn btn-primary"
                            onClick={() => scrollToSection('claim-form')}
                        >
                            Start Your Claim
                        </button>
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;

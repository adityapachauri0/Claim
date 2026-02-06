import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, Info, Cookie, Settings, BarChart2, Megaphone, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import './LegalPages.css';

const CookiePolicy = () => {
    const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        // Load saved preferences
        const saved = localStorage.getItem('cookiePreferences');
        if (saved) {
            setCookiePreferences(JSON.parse(saved));
        }
    }, []);

    const cookieTypes = [
        {
            name: "Necessary Cookies",
            icon: <Shield className="cookie-type-icon green" />,
            key: "necessary",
            required: true,
            description: "Essential for website functionality and security",
            examples: [
                "Session cookies for maintaining your login state",
                "Security cookies for preventing CSRF attacks",
                "Load balancing cookies for optimal performance",
                "Cookie consent preferences"
            ]
        },
        {
            name: "Functional Cookies",
            icon: <Settings className="cookie-type-icon blue" />,
            key: "functional",
            required: false,
            description: "Enhance website functionality and personalization",
            examples: [
                "Language preference settings",
                "Form auto-save functionality (saves your claim form progress)",
                "Auto-fill information for faster form completion",
                "Accessibility settings",
                "Live chat functionality"
            ]
        },
        {
            name: "Analytics Cookies",
            icon: <BarChart2 className="cookie-type-icon purple" />,
            key: "analytics",
            required: false,
            description: "Help us understand how visitors use our website",
            examples: [
                "Google Analytics for visitor statistics",
                "Page view tracking",
                "User journey analysis",
                "Performance monitoring"
            ]
        },
        {
            name: "Marketing Cookies",
            icon: <Megaphone className="cookie-type-icon orange" />,
            key: "marketing",
            required: false,
            description: "Used to deliver relevant advertisements",
            examples: [
                "Retargeting cookies for relevant ads",
                "Social media tracking pixels",
                "Conversion tracking",
                "Interest-based advertising"
            ]
        }
    ];

    const handleToggle = (key) => {
        if (key !== 'necessary') {
            setCookiePreferences(prev => ({
                ...prev,
                [key]: !prev[key]
            }));
        }
    };

    const savePreferences = () => {
        localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
        alert('Your cookie preferences have been saved.');
    };

    return (
        <div className="legal-page">
            {/* Hero Section */}
            <section className="legal-hero cookies-hero">
                <div className="hero-pattern"></div>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hero-content"
                    >
                        <div className="hero-icon-wrapper">
                            <Cookie size={48} />
                        </div>
                        <h1>Cookie Policy</h1>
                        <p className="hero-subtitle">Understanding How We Use Cookies</p>
                        <p className="hero-date">Last Updated: January 2024</p>
                    </motion.div>
                </div>
            </section>

            {/* Cookie Preferences Manager */}
            <section className="cookie-manager-section">
                <div className="container">
                    <div className="cookie-manager-card">
                        <h2>Manage Your Cookie Preferences</h2>
                        <div className="cookie-toggles-grid">
                            {cookieTypes.map((type) => (
                                <div key={type.key} className="cookie-toggle-item">
                                    <div className="toggle-header">
                                        <div className="toggle-info">
                                            {type.icon}
                                            <span className="toggle-name">{type.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(type.key)}
                                            disabled={type.required}
                                            className={`toggle-button ${type.required ? 'disabled' : ''}`}
                                        >
                                            {cookiePreferences[type.key] ? (
                                                <ToggleRight className="toggle-icon on" />
                                            ) : (
                                                <ToggleLeft className="toggle-icon off" />
                                            )}
                                        </button>
                                    </div>
                                    {type.required && (
                                        <p className="always-active">Always Active</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="save-preferences">
                            <button onClick={savePreferences} className="save-button">
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="legal-content">
                <div className="container">
                    {/* Introduction */}
                    <div className="intro-section">
                        <h2>What Are Cookies?</h2>
                        <p>
                            Cookies are small text files that are placed on your device when you visit our website. They help us provide
                            you with a better experience by remembering your preferences, understanding how you use our site, and
                            delivering relevant content.
                        </p>
                        <p>
                            PCP Claim Today uses cookies in accordance with UK GDPR and the Privacy and Electronic Communications
                            Regulations (PECR). We are committed to protecting your privacy and giving you control over your data.
                        </p>
                    </div>

                    {/* Cookie Types Detailed */}
                    <div className="sections-grid">
                        {cookieTypes.map((type, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="content-card"
                            >
                                <div className="card-header">
                                    <div className="icon-wrapper">
                                        {type.icon}
                                    </div>
                                    <div className="header-text">
                                        <h3>{type.name}</h3>
                                        <p className="card-description">{type.description}</p>
                                        {type.required && (
                                            <span className="required-badge">Always Required</span>
                                        )}
                                    </div>
                                </div>
                                <div className="examples-section">
                                    <h4>Examples:</h4>
                                    <ul className="content-list">
                                        {type.examples.map((example, exIndex) => (
                                            <li key={exIndex}>
                                                <CheckCircle className="list-icon" />
                                                <span>{example}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Specific Cookies Table */}
                    <div className="table-card">
                        <h3>
                            <Info className="inline-icon primary" />
                            Specific Cookies We Use
                        </h3>
                        <div className="table-wrapper">
                            <table className="cookies-table">
                                <thead>
                                    <tr>
                                        <th>Cookie Name</th>
                                        <th>Type</th>
                                        <th>Purpose</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>sessionId</td>
                                        <td>Necessary</td>
                                        <td>Maintains user session</td>
                                        <td>Session</td>
                                    </tr>
                                    <tr>
                                        <td>cookieConsent</td>
                                        <td>Necessary</td>
                                        <td>Stores cookie preferences</td>
                                        <td>1 year</td>
                                    </tr>
                                    <tr>
                                        <td>_ga</td>
                                        <td>Analytics</td>
                                        <td>Google Analytics tracking</td>
                                        <td>2 years</td>
                                    </tr>
                                    <tr>
                                        <td>_fbp</td>
                                        <td>Marketing</td>
                                        <td>Facebook Pixel</td>
                                        <td>3 months</td>
                                    </tr>
                                    <tr>
                                        <td>formDraft</td>
                                        <td>Functional</td>
                                        <td>Auto-save form progress</td>
                                        <td>30 days</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* How to Control Cookies */}
                    <div className="info-card">
                        <h3>How to Control Cookies</h3>
                        <p>You have several options for managing cookies:</p>
                        <div className="control-options">
                            <div className="control-option">
                                <h4>1. Through Our Cookie Manager</h4>
                                <p>Use the preferences manager at the top of this page to control which cookies we set.</p>
                            </div>
                            <div className="control-option">
                                <h4>2. Browser Settings</h4>
                                <p>Most browsers allow you to control cookies through their settings:</p>
                                <ul className="browser-list">
                                    <li>Chrome: Settings → Privacy and security → Cookies</li>
                                    <li>Firefox: Settings → Privacy & Security → Cookies</li>
                                    <li>Safari: Preferences → Privacy → Cookies</li>
                                    <li>Edge: Settings → Privacy, search, and services → Cookies</li>
                                </ul>
                            </div>
                            <div className="control-option">
                                <h4>3. Opt-Out Links</h4>
                                <p>You can opt out of specific third-party cookies:</p>
                                <ul className="opt-out-list">
                                    <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Opt-out</a></li>
                                    <li>Facebook: <a href="https://www.facebook.com/help/568137493302217" target="_blank" rel="noopener noreferrer">Ad Preferences</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Auto-Save Feature */}
                    <div className="info-card highlight">
                        <h3>Auto-Save Feature for Claim Forms</h3>
                        <p>Our website offers an auto-save feature specifically designed for PCP compensation claim forms:</p>
                        <div className="feature-grid">
                            <div className="feature-item">
                                <h4>How Auto-Save Works:</h4>
                                <ul className="bullet-list">
                                    <li>When enabled, your form progress is automatically saved as you type</li>
                                    <li>Data is stored locally in your browser (not on our servers)</li>
                                    <li>If you close the browser accidentally, your progress is preserved</li>
                                    <li>You can return to complete your claim form at any time</li>
                                </ul>
                            </div>
                            <div className="feature-item">
                                <h4>Privacy & Security:</h4>
                                <ul className="bullet-list">
                                    <li>Data is encrypted and stored only on your device</li>
                                    <li>Auto-save can be disabled at any time via cookie preferences</li>
                                    <li>Saved data is automatically cleared after form submission</li>
                                    <li>No auto-saved data is transmitted until you submit the form</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Impact of Disabling */}
                    <div className="warning-card">
                        <h3>Impact of Disabling Cookies</h3>
                        <p>Please note that disabling certain cookies may affect your experience on our website:</p>
                        <ul className="bullet-list">
                            <li><strong>Necessary cookies:</strong> Cannot be disabled. Website may not function properly without them.</li>
                            <li><strong>Functional cookies & Auto-Save:</strong> Form progress won't be saved automatically. You'll need to complete forms in one session.</li>
                            <li><strong>Analytics cookies:</strong> We won't be able to improve our services based on usage patterns.</li>
                            <li><strong>Marketing cookies:</strong> You may still see ads, but they won't be personalized to your interests.</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="contact-card center">
                        <h3>Questions About Cookies?</h3>
                        <p>If you have any questions about our use of cookies or this Cookie Policy, please contact our Data Protection Officer:</p>
                        <div className="contact-buttons">
                            <a href="mailto:info@pcpclaimtoday.co.uk" className="contact-btn primary">
                                <Cookie size={20} />
                                info@pcpclaimtoday.co.uk
                            </a>
                            <a href="tel:08001234567" className="contact-btn secondary">
                                <Shield size={20} />
                                0800 123 4567
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CookiePolicy;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, UserCheck, Mail, Phone, CheckCircle, AlertTriangle, Info, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import './LegalPages.css';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Information We Collect",
            icon: <Info className="section-icon" />,
            content: [
                "Personal identification information (Name, email address, phone number)",
                "Financial details relevant to your PCP/car finance claim",
                "Vehicle and finance agreement information",
                "Employment and income details as required for compensation claims",
                "Communications between you and our team"
            ]
        },
        {
            title: "How We Use Your Information",
            icon: <UserCheck className="section-icon" />,
            content: [
                "Processing and managing your compensation claim",
                "Communicating with you about your claim status",
                "Complying with legal and regulatory requirements",
                "Improving our services and client experience",
                "Protecting against fraud and ensuring security"
            ]
        },
        {
            title: "Data Protection",
            icon: <Lock className="section-icon" />,
            content: [
                "Encryption of all sensitive data in transit and at rest",
                "Regular security audits and assessments",
                "Limited access to personal data on a need-to-know basis",
                "Secure data centers with 24/7 monitoring",
                "Compliance with UK GDPR and Data Protection Act 2018"
            ]
        },
        {
            title: "Your Rights",
            icon: <CheckCircle className="section-icon accent" />,
            content: [
                "Right to access your personal data",
                "Right to rectification of inaccurate data",
                "Right to erasure ('right to be forgotten')",
                "Right to restrict processing",
                "Right to data portability",
                "Right to object to processing",
                "Right to withdraw consent at any time"
            ]
        }
    ];

    return (
        <div className="legal-page">
            {/* Hero Section */}
            <section className="legal-hero privacy-hero">
                <div className="hero-pattern"></div>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hero-content"
                    >
                        <div className="hero-icon-wrapper">
                            <Shield size={48} />
                        </div>
                        <h1>Privacy Policy</h1>
                        <p className="hero-subtitle">Your Privacy is Our Priority</p>
                        <p className="hero-date">Last Updated: January 2024</p>
                    </motion.div>
                </div>
            </section>

            {/* Company Information */}
            <section className="company-info-section">
                <div className="container">
                    <div className="company-info-card">
                        <h2>
                            <AlertTriangle className="inline-icon warning" />
                            Data Controller Information
                        </h2>
                        <div className="info-grid">
                            <div>
                                <p><strong>Company:</strong> PCP Claim Today (Trading as Example Claims Ltd)</p>
                                <p><strong>Company Number:</strong> 12345678</p>
                                <p><strong>FCA Registration:</strong> FRN 123456</p>
                            </div>
                            <div>
                                <p><strong>Registered Address:</strong> 123 Claim Street, London, EC1A 1BB</p>
                                <p><strong>Email:</strong> info@pcpclaimtoday.co.uk</p>
                                <p><strong>Phone:</strong> 0800 123 4567</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="legal-content">
                <div className="container">
                    <div className="intro-section">
                        <h2>Introduction</h2>
                        <p>
                            PCP Claim Today is committed to protecting your privacy and personal data.
                            This Privacy Policy explains how we collect, use, store, and protect your information when you use our services
                            for PCP car finance compensation claims.
                        </p>
                        <p>
                            We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                            As a claims management company regulated by the Financial Conduct Authority (FCA), we adhere to strict
                            data protection standards.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="sections-grid">
                        {sections.map((section, index) => (
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
                                        {section.icon}
                                    </div>
                                    <h3>{section.title}</h3>
                                </div>
                                <ul className="content-list">
                                    {section.content.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            <CheckCircle className="list-icon" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Sections */}
                    <div className="additional-sections">
                        <div className="info-card">
                            <h3>Auto-Save Feature and Local Storage</h3>
                            <p>
                                To improve your experience when completing compensation claim forms, we offer an optional auto-save feature:
                            </p>
                            <ul className="bullet-list">
                                <li><strong>Local Storage Only:</strong> Form data is saved only in your browser's local storage, not on our servers</li>
                                <li><strong>Opt-in Feature:</strong> You must consent to enable auto-save functionality</li>
                                <li><strong>Temporary Storage:</strong> Data is automatically cleared after successful form submission</li>
                                <li><strong>User Control:</strong> You can disable auto-save or clear saved data at any time</li>
                                <li><strong>No Server Transmission:</strong> Auto-saved data is never sent to our servers until you explicitly submit the form</li>
                            </ul>
                        </div>

                        <div className="info-card">
                            <h3>Data Retention</h3>
                            <p>
                                We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected,
                                including satisfying legal, regulatory, accounting, or reporting requirements.
                            </p>
                            <ul className="bullet-list">
                                <li>Claim records: 6 years after claim conclusion</li>
                                <li>Financial records: 7 years as required by law</li>
                                <li>Marketing communications: Until consent withdrawn</li>
                                <li>Website analytics: 26 months</li>
                            </ul>
                        </div>

                        <div className="info-card">
                            <h3>Third-Party Sharing</h3>
                            <p>
                                We may share your information with trusted third parties only when necessary:
                            </p>
                            <ul className="bullet-list">
                                <li>Financial institutions for claim assessment</li>
                                <li>Legal representatives acting on your behalf</li>
                                <li>The Financial Ombudsman Service for dispute resolution</li>
                                <li>Regulatory bodies as required by law</li>
                                <li>Our insurance providers</li>
                            </ul>
                            <p className="note">
                                We never sell your personal data to third parties for marketing purposes.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>Cookies</h3>
                            <p>
                                We use cookies to enhance your experience on our website. For detailed information about the cookies we use
                                and your choices regarding them, please see our <Link to="/cookies" className="text-link">Cookie Policy</Link>.
                            </p>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="contact-card">
                        <h3>Contact Our Data Protection Officer</h3>
                        <p>
                            If you have any questions about this Privacy Policy or how we handle your personal data, please contact our
                            Data Protection Officer:
                        </p>
                        <div className="contact-grid">
                            <div className="contact-item">
                                <Mail className="contact-icon" />
                                <div>
                                    <p className="label">Email</p>
                                    <a href="mailto:info@pcpclaimtoday.co.uk">info@pcpclaimtoday.co.uk</a>
                                </div>
                            </div>
                            <div className="contact-item">
                                <Phone className="contact-icon" />
                                <div>
                                    <p className="label">Phone</p>
                                    <a href="tel:08001234567">0800 123 4567</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ICO Information */}
                    <div className="warning-card">
                        <h4>Supervisory Authority</h4>
                        <p>
                            You have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe
                            we have not handled your personal data properly.
                        </p>
                        <p>
                            <strong>ICO Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-link">www.ico.org.uk</a><br />
                            <strong>ICO Helpline:</strong> 0303 123 1113
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;

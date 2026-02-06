import React, { useEffect } from 'react';
import { AlertCircle, Database, Globe, FileText, Shield, UserCheck, Trash2, Download, CheckCircle, Hand, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import './LegalPages.css';

const GDPR = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const rights = [
        {
            title: "Right to Access",
            icon: <Database className="right-icon primary" />,
            description: "You have the right to request copies of your personal data",
            details: [
                "Request a copy of all personal data we hold about you",
                "Receive information about how we process your data",
                "Understand the purposes of processing",
                "Know who we share your data with"
            ],
            timeframe: "Response within 30 days"
        },
        {
            title: "Right to Rectification",
            icon: <FileText className="right-icon blue" />,
            description: "You can request correction of inaccurate personal data",
            details: [
                "Correct any inaccurate information",
                "Complete any incomplete data",
                "Update outdated information",
                "Verify corrections have been made"
            ],
            timeframe: "Correction within 30 days"
        },
        {
            title: "Right to Erasure",
            icon: <Trash2 className="right-icon red" />,
            description: "The 'right to be forgotten' in certain circumstances",
            details: [
                "Request deletion when data is no longer necessary",
                "Withdraw consent for processing",
                "Object to direct marketing use",
                "Data was unlawfully processed"
            ],
            timeframe: "Deletion within 30 days"
        },
        {
            title: "Right to Restrict Processing",
            icon: <Hand className="right-icon yellow" />,
            description: "Limit how we use your personal data",
            details: [
                "Contest the accuracy of data",
                "Processing is unlawful but you don't want erasure",
                "We no longer need data but you need it for legal claims",
                "You've objected to processing pending verification"
            ],
            timeframe: "Restriction within 30 days"
        },
        {
            title: "Right to Data Portability",
            icon: <Download className="right-icon green" />,
            description: "Receive your data in a structured, machine-readable format",
            details: [
                "Transfer data to another service provider",
                "Receive data in common format (CSV, JSON)",
                "Direct transfer between controllers where feasible",
                "Applies to automated processing based on consent"
            ],
            timeframe: "Provided within 30 days"
        },
        {
            title: "Right to Object",
            icon: <AlertCircle className="right-icon orange" />,
            description: "Object to processing of your personal data",
            details: [
                "Object to direct marketing at any time",
                "Object to processing for legitimate interests",
                "Object to processing for research/statistics",
                "We must stop unless we have compelling grounds"
            ],
            timeframe: "Immediate for marketing"
        }
    ];

    const lawfulBases = [
        {
            basis: "Consent",
            description: "You have given clear consent for us to process your personal data",
            examples: ["Marketing communications", "Cookie usage", "Newsletter subscriptions"]
        },
        {
            basis: "Contract",
            description: "Processing is necessary for our contract with you",
            examples: ["Managing your compensation claim", "Providing our services", "Client communications"]
        },
        {
            basis: "Legal Obligation",
            description: "We need to comply with the law",
            examples: ["Anti-money laundering checks", "Tax records", "FCA regulatory requirements"]
        },
        {
            basis: "Legitimate Interests",
            description: "Processing is necessary for our legitimate interests",
            examples: ["Fraud prevention", "Network security", "Service improvements"]
        },
        {
            basis: "Vital Interests",
            description: "Processing is necessary to protect someone's life",
            examples: ["Medical emergencies", "Safeguarding concerns"]
        }
    ];

    return (
        <div className="legal-page">
            {/* Hero Section */}
            <section className="legal-hero gdpr-hero">
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
                        <h1>GDPR Compliance</h1>
                        <p className="hero-subtitle">Your Rights Under UK GDPR</p>
                        <p className="hero-date">Effective Date: May 25, 2018 | Last Updated: January 2024</p>
                    </motion.div>
                </div>
            </section>

            {/* Key Information Banner */}
            <section className="gdpr-banner-section">
                <div className="container">
                    <div className="gdpr-banner">
                        <div className="banner-header">
                            <UserCheck className="banner-icon" />
                            <h2>UK General Data Protection Regulation (UK GDPR)</h2>
                        </div>
                        <p>
                            The UK GDPR and Data Protection Act 2018 give you important rights over your personal data.
                            PCP Claim Today is committed to protecting your privacy and ensuring
                            transparent processing of your information.
                        </p>
                        <div className="banner-badges">
                            <div className="banner-badge">
                                <CheckCircle className="badge-icon green" />
                                <h3>ICO Registered</h3>
                                <p>Registration: ZA123456</p>
                            </div>
                            <div className="banner-badge">
                                <Globe className="badge-icon blue" />
                                <h3>Data Protection Officer</h3>
                                <p>info@pcpclaimtoday.co.uk</p>
                            </div>
                            <div className="banner-badge">
                                <Clock className="badge-icon purple" />
                                <h3>Response Time</h3>
                                <p>Within 30 days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Your Rights */}
            <section className="legal-content">
                <div className="container">
                    <h2 className="section-title">Your Data Protection Rights</h2>

                    <div className="rights-grid">
                        {rights.map((right, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="right-card"
                            >
                                <div className="right-header">
                                    <div className="right-icon-wrapper">
                                        {right.icon}
                                    </div>
                                    <span className="right-timeframe">{right.timeframe}</span>
                                </div>
                                <h3>{right.title}</h3>
                                <p className="right-description">{right.description}</p>
                                <ul className="right-details">
                                    {right.details.map((detail, detailIndex) => (
                                        <li key={detailIndex}>
                                            <CheckCircle className="detail-icon" />
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* How to Exercise Rights */}
                    <div className="exercise-rights-card">
                        <h3>How to Exercise Your Rights</h3>
                        <div className="exercise-grid">
                            <div>
                                <h4>Submit a Request:</h4>
                                <ol className="numbered-list">
                                    <li>Contact our Data Protection Officer</li>
                                    <li>Specify which right you wish to exercise</li>
                                    <li>Provide identification for verification</li>
                                    <li>Include any relevant details about your data</li>
                                    <li>We'll respond within 30 days</li>
                                </ol>
                            </div>
                            <div>
                                <h4>Contact Methods:</h4>
                                <div className="contact-methods">
                                    <div className="method">
                                        <Shield className="method-icon" />
                                        <div>
                                            <p className="method-label">Email (Preferred)</p>
                                            <a href="mailto:info@pcpclaimtoday.co.uk">info@pcpclaimtoday.co.uk</a>
                                        </div>
                                    </div>
                                    <div className="method">
                                        <Shield className="method-icon" />
                                        <div>
                                            <p className="method-label">Post</p>
                                            <p className="method-text">PCP Claim Today, 123 Claim Street, London, EC1A 1BB</p>
                                        </div>
                                    </div>
                                    <div className="method">
                                        <Shield className="method-icon" />
                                        <div>
                                            <p className="method-label">Phone</p>
                                            <a href="tel:08001234567">0800 123 4567</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lawful Bases */}
            <section className="lawful-bases-section">
                <div className="container">
                    <h2 className="section-title">Lawful Bases for Processing</h2>
                    <p className="section-intro">
                        Under UK GDPR, we must have a lawful basis for processing your personal data.
                        Here are the bases we rely on and examples of when we use each:
                    </p>

                    <div className="bases-list">
                        {lawfulBases.map((item, index) => (
                            <div key={index} className="basis-card">
                                <div className="basis-header">
                                    <CheckCircle className="basis-icon" />
                                    <div>
                                        <h3>{item.basis}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                                <div className="basis-examples">
                                    <p className="examples-label">Examples:</p>
                                    <ul>
                                        {item.examples.map((example, exIndex) => (
                                            <li key={exIndex}>
                                                <span className="example-dot"></span>
                                                <span>{example}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* International Transfers */}
            <section className="legal-content">
                <div className="container">
                    <div className="info-card highlight">
                        <h3>
                            <Globe className="inline-icon blue" />
                            International Data Transfers
                        </h3>
                        <p>We primarily process your data within the UK. However, some services may involve international transfers:</p>
                        <ul className="transfer-list">
                            <li>
                                <CheckCircle className="list-icon green" />
                                <div>
                                    <strong>Cloud Storage:</strong> Data may be stored on servers in the EU (adequate decision in place)
                                </div>
                            </li>
                            <li>
                                <CheckCircle className="list-icon green" />
                                <div>
                                    <strong>Analytics:</strong> Google Analytics may process data in the US (using Standard Contractual Clauses)
                                </div>
                            </li>
                            <li>
                                <CheckCircle className="list-icon green" />
                                <div>
                                    <strong>Support Tools:</strong> Customer support tools with appropriate safeguards
                                </div>
                            </li>
                        </ul>
                        <div className="safeguards-note">
                            <strong>Safeguards:</strong> We ensure all international transfers comply with UK GDPR through adequacy decisions,
                            Standard Contractual Clauses, or other appropriate safeguards.
                        </div>
                    </div>

                    {/* Data Breach Response */}
                    <div className="breach-card">
                        <h3>
                            <AlertCircle className="inline-icon red" />
                            Data Breach Response
                        </h3>
                        <p>In the unlikely event of a personal data breach that poses a high risk to your rights and freedoms:</p>
                        <div className="breach-timeline">
                            <div className="breach-item">
                                <span className="breach-badge red">72h</span>
                                <div>
                                    <strong>ICO Notification:</strong> We report to the Information Commissioner's Office within 72 hours
                                </div>
                            </div>
                            <div className="breach-item">
                                <span className="breach-badge orange">ASAP</span>
                                <div>
                                    <strong>Individual Notification:</strong> We inform affected individuals without undue delay
                                </div>
                            </div>
                            <div className="breach-item">
                                <span className="breach-badge blue">Ongoing</span>
                                <div>
                                    <strong>Incident Response:</strong> Our security team works to contain and remediate the breach
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Complaints Process */}
                    <div className="complaints-card">
                        <h3>How to Make a Complaint</h3>
                        <p>If you're unhappy with how we've handled your personal data, you have the right to complain:</p>

                        <div className="complaints-grid">
                            <div className="complaint-option">
                                <h4>1. Contact Us First</h4>
                                <p>We'd like the opportunity to resolve your concerns directly.</p>
                                <div className="complaint-details">
                                    <p><strong>Email:</strong> info@pcpclaimtoday.co.uk</p>
                                    <p><strong>Response:</strong> Within 30 days</p>
                                </div>
                            </div>

                            <div className="complaint-option">
                                <h4>2. Contact the ICO</h4>
                                <p>You can complain to the Information Commissioner's Office:</p>
                                <div className="complaint-details">
                                    <p><strong>Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a></p>
                                    <p><strong>Phone:</strong> 0303 123 1113</p>
                                    <p><strong>Live chat:</strong> Available on ICO website</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Updates Notice */}
                    <div className="updates-notice">
                        <h3>Updates to This GDPR Notice</h3>
                        <p>
                            We may update this GDPR notice to reflect changes in law or our practices.
                            We'll notify you of significant changes via email or prominent notice on our website.
                        </p>
                        <p className="review-dates">
                            <strong>Last Review Date:</strong> January 2024<br />
                            <strong>Next Review Date:</strong> January 2025
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default GDPR;

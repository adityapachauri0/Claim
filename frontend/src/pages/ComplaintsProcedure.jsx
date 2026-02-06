import React, { useEffect } from 'react';
import { Phone, Mail, MapPin, CheckCircle, FileText, Clock, ClipboardCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import './LegalPages.css';

const ComplaintsProcedure = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-page">
            {/* Hero Section */}
            <section className="legal-hero complaints-hero">
                <div className="hero-pattern"></div>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hero-content"
                    >
                        <div className="hero-icon-wrapper">
                            <ClipboardCheck size={48} />
                        </div>
                        <h1>Complaints Procedure</h1>
                        <p className="hero-subtitle">Your Satisfaction is Our Priority</p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="legal-content">
                <div className="container">
                    {/* Making a Complaint */}
                    <div className="content-card highlight-card">
                        <h2>
                            <AlertCircle className="inline-icon primary" />
                            Making a Complaint
                        </h2>

                        <p>
                            We endeavour to provide you with excellent customer service at all times. However, in the unlikely event that you wish to raise a complaint or are dissatisfied with our service in any way, you can make a complaint by any reasonable means, such as telephone, email, post or in person using the following contact details:
                        </p>

                        {/* Contact Options */}
                        <div className="contact-box">
                            <div className="contact-row">
                                <Phone className="contact-icon" />
                                <div>
                                    <strong>Telephone:</strong>
                                    <p>Complaints Department on 0800 123 4567</p>
                                </div>
                            </div>

                            <div className="contact-row">
                                <MapPin className="contact-icon" />
                                <div>
                                    <strong>Post/In Person:</strong>
                                    <p>For the attention of Complaints Department, PCP Claim Today, 123 Claim Street, London, EC1A 1BB</p>
                                </div>
                            </div>

                            <div className="contact-row">
                                <Mail className="contact-icon" />
                                <div>
                                    <strong>Email:</strong>
                                    <p><a href="mailto:complaints@pcpclaimtoday.co.uk">complaints@pcpclaimtoday.co.uk</a></p>
                                </div>
                            </div>
                        </div>

                        <p>
                            We try to resolve complaints as soon as possible. Should we resolve your complaint by the close of the third business day following the day on which we receive your complaint, we will issue you with a written communication called a summary resolution communication acknowledging that you made a complaint and setting out that the complaint has been resolved. It will make you aware of your right to refer the complaint to the Financial Ombudsman Service should you be dissatisfied with our resolution.
                        </p>

                        <p>
                            Should a further (or new) complaint arise from you, or we are not able to resolve the complaint by the close of the third business day, it will be logged and dealt with as follows:
                        </p>
                    </div>

                    {/* Acknowledgement */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="content-card success-card"
                    >
                        <h3>
                            <CheckCircle className="inline-icon success" />
                            Acknowledgement
                        </h3>
                        <p>
                            Where we need more time to resolve a complaint, or a further complaint is received, we will send a written or electronic acknowledgement to you within five business days of receipt of your complaint, outlining our understanding of the complaint points and identifying the individual handling the complaint.
                        </p>
                        <p>
                            Wherever possible, that individual will not have been directly involved in the matter that is the subject of the complaint, and will have authority to settle the complaint.
                        </p>
                    </motion.div>

                    {/* Complaints about third parties */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="content-card warning-accent-card"
                    >
                        <h3>Complaints About Third Parties</h3>
                        <p>
                            If your complaint solely relates to a third party such as a solicitor, we will forward your complaint to the third party that we believe is solely responsible for the complaint. We will send you an acknowledgment letter within 5 working days to inform you of this. The letter will include the third party's details and their complaints handling procedure and how they will address your complaint. If we are jointly responsible with a third party for the complaint, we will issue to you an acknowledgment within 5 working days, and inform you of how we will investigate your complaint and the timescales within which we have to address your complaint.
                        </p>
                    </motion.div>

                    {/* Complaints Investigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="content-card"
                    >
                        <h3>
                            <FileText className="inline-icon primary" />
                            Complaints Investigation
                        </h3>
                        <p>
                            The Complaints Handler will investigate the subject matter of the complaint and, where required, may contact you to obtain further information to investigate the complaint. The nature of the investigation will depend on the nature of the complaint, but may involve reviewing internal records and reviewing all communications with you. The Complaints Handler will assess whether the complaint should be upheld or rejected, and whether remedial action is necessary.
                        </p>

                        <p>
                            We will keep you informed about the progress of investigations by sending written communication either by email or post on a weekly basis. We will ensure that the individual(s) involved in investigating complaints is/are independent and have not been involved in the events complained about (where possible).
                        </p>

                        <p>
                            We will endeavour to issue a final response to you within eight weeks of receiving your complaint. This will be considered our 'final response' which will be a written response that either:
                        </p>

                        <ul className="styled-list">
                            <li>(a) Accepts the complaint and, where appropriate, offers redress or remedial action (appropriate redress will not always involve financial redress); or</li>
                            <li>(b) Offers redress or remedial action without accepting the complaint; or</li>
                            <li>(c) Rejects the complaint and gives reason for doing so.</li>
                        </ul>

                        <p>
                            The response will inform the complainant that if they are not satisfied with our response, they may refer their complaint to the Financial Ombudsman Service by letter, email or telephone and will:
                        </p>

                        <ul className="styled-list">
                            <li>(i) Enclose a copy of the Financial Ombudsman standard explanatory leaflet;</li>
                            <li>(ii) Provide the website address of the Financial Ombudsman Service;</li>
                            <li>(iii) Indicate that we waive the relevant time limits (where relevant).</li>
                        </ul>

                        <p>
                            If a complaint is not resolved after eight weeks, we will explain in writing why we are not in a position to make a final response and indicate when we expect to be able to provide a final response. You have the right to refer the matter to the Financial Ombudsman Service at this point; full contact details will be provided to you. In either case you must refer your complaint to the Financial Ombudsman Service within six months of the date of our letter.
                        </p>
                    </motion.div>

                    {/* Appeal Process */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="content-card info-accent-card"
                    >
                        <h3>
                            <Clock className="inline-icon info" />
                            Appeal Process
                        </h3>

                        <p>
                            The Financial Ombudsman Service (FOS) is an independent body established to settle disputes between financial services companies and consumers in a fair and impartial way. They may investigate complaints up to six years from the date of the problem happening or within three years of you becoming aware of the problem. You can refer your complaint to the FOS on any of the below contact details:
                        </p>

                        <div className="contact-box alt">
                            <div className="contact-row">
                                <MapPin className="contact-icon info" />
                                <div>
                                    <strong>Post:</strong> Financial Ombudsman Service, Exchange Tower, London E14 9SR
                                </div>
                            </div>

                            <div className="contact-row">
                                <Phone className="contact-icon info" />
                                <div>
                                    <strong>Telephone:</strong> 0800 023 4567
                                </div>
                            </div>

                            <div className="contact-row">
                                <Mail className="contact-icon info" />
                                <div>
                                    <strong>Web:</strong> <a href="https://www.financial-ombudsman.org.uk" target="_blank" rel="noopener noreferrer">www.financial-ombudsman.org.uk</a>
                                </div>
                            </div>
                        </div>

                        <p className="highlight-text">
                            Complaints to the Financial Ombudsman Service must be submitted within six months of our final response to you.
                        </p>

                        <p className="note-text">
                            The Financial Ombudsman Service advises that you do not send original documents as they scan any documents sent to them and destroy the originals.
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ComplaintsProcedure;

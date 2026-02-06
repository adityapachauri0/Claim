import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, FileText, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ViewSubmissionModal.css';

const ViewSubmissionModal = ({ isOpen, onClose, submission }) => {
    if (!submission) return null;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'new': return 'status-new';
            case 'processing': return 'status-processing';
            case 'completed': return 'status-completed';
            case 'draft': return 'status-draft';
            default: return 'status-default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-overlay"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="modal-header">
                            <div className="modal-header-content">
                                <h2>Submission Details</h2>
                                <div className="modal-header-meta">
                                    <span className={`status-badge ${getStatusColor(submission.status)}`}>
                                        {submission.status?.toUpperCase() || 'NEW'}
                                    </span>
                                    {submission.referenceNumber && (
                                        <span className="reference-number">
                                            Ref: {submission.referenceNumber}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button className="modal-close-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="modal-content">
                            {/* Personal Information */}
                            <div className="modal-section">
                                <h3 className="section-title">
                                    <User size={18} />
                                    Personal Information
                                </h3>
                                <div className="section-grid">
                                    <div className="field-group">
                                        <label>Full Name</label>
                                        <p>{submission.firstName} {submission.lastName}</p>
                                    </div>
                                    <div className="field-group">
                                        <label>Email</label>
                                        <p>{submission.email || <span className="not-provided">Not provided</span>}</p>
                                    </div>
                                    <div className="field-group">
                                        <label>Phone</label>
                                        <p>{submission.phone || <span className="not-provided">Not provided</span>}</p>
                                    </div>
                                    <div className="field-group">
                                        <label>City</label>
                                        <p>{submission.city || <span className="not-provided">Not provided</span>}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Claim Information */}
                            <div className="modal-section">
                                <h3 className="section-title">
                                    <FileText size={18} />
                                    Claim Information
                                </h3>
                                <div className="section-grid">
                                    <div className="field-group">
                                        <label>Reference Number</label>
                                        <p className="reference-code">{submission.referenceNumber || 'N/A'}</p>
                                    </div>
                                    <div className="field-group">
                                        <label>Status</label>
                                        <p>
                                            <span className={`status-badge inline ${getStatusColor(submission.status)}`}>
                                                {submission.status?.toUpperCase() || 'NEW'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="field-group">
                                        <label>Submitted On</label>
                                        <p>{formatDate(submission.createdAt)}</p>
                                    </div>
                                    <div className="field-group">
                                        <label>Last Updated</label>
                                        <p>{formatDate(submission.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            {submission.additionalInfo && (
                                <div className="modal-section">
                                    <h3 className="section-title">
                                        <AlertCircle size={18} />
                                        Additional Information
                                    </h3>
                                    <div className="info-box">
                                        <p>{submission.additionalInfo}</p>
                                    </div>
                                </div>
                            )}

                            {/* Draft Progress */}
                            {submission.status === 'draft' && submission.completionPercentage !== undefined && (
                                <div className="modal-section">
                                    <h3 className="section-title">
                                        <Clock size={18} />
                                        Form Completion
                                    </h3>
                                    <div className="progress-container">
                                        <div className="progress-header">
                                            <span>Progress</span>
                                            <span className="progress-percentage">{submission.completionPercentage}%</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${submission.completionPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Location Info */}
                            {(submission.location || submission.ipAddress) && (
                                <div className="modal-section">
                                    <h3 className="section-title">
                                        <MapPin size={18} />
                                        Location Details
                                    </h3>
                                    <div className="section-grid">
                                        {submission.location && (
                                            <div className="field-group">
                                                <label>Location</label>
                                                <p>{submission.location}</p>
                                            </div>
                                        )}
                                        {submission.ipAddress && (
                                            <div className="field-group">
                                                <label>IP Address</label>
                                                <p className="mono-text">{submission.ipAddress}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ViewSubmissionModal;

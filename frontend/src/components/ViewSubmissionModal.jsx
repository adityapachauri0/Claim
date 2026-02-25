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

                            {/* Address Information */}
                            {(submission.addressLine1 || submission.postcode) && (
                                <div className="modal-section">
                                    <h3 className="section-title">
                                        <MapPin size={18} />
                                        Address
                                    </h3>
                                    <div className="section-grid">
                                        <div className="field-group">
                                            <label>Address Line 1</label>
                                            <p>{submission.addressLine1 || <span className="not-provided">Not provided</span>}</p>
                                        </div>
                                        {submission.addressLine2 && (
                                            <div className="field-group">
                                                <label>Address Line 2</label>
                                                <p>{submission.addressLine2}</p>
                                            </div>
                                        )}
                                        <div className="field-group">
                                            <label>County</label>
                                            <p>{submission.county || <span className="not-provided">Not provided</span>}</p>
                                        </div>
                                        <div className="field-group">
                                            <label>Postcode</label>
                                            <p>{submission.postcode || <span className="not-provided">Not provided</span>}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

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

                            {/* R2R API Status */}
                            {submission.r2rStatus && (
                                <div className="modal-section">
                                    <h3 className="section-title">
                                        <CheckCircle size={18} />
                                        R2R Submission Status
                                    </h3>
                                    <div className="field-group">
                                        <label>Status</label>
                                        <p>
                                            <span style={{
                                                display:'inline-block',
                                                padding:'4px 12px',
                                                borderRadius:'12px',
                                                fontSize:'12px',
                                                fontWeight:'600',
                                                color:'#fff',
                                                background: submission.r2rStatus === 'success' ? '#10b981' :
                                                            submission.r2rStatus === 'no_stream' ? '#f59e0b' :
                                                            submission.r2rStatus === 'auth_required' ? '#3b82f6' :
                                                            submission.r2rStatus === 'pending' ? '#6b7280' :
                                                            submission.r2rStatus === 'not_configured' ? '#9ca3af' : '#ef4444'
                                            }}>
                                                {submission.r2rStatus === 'success' ? 'Accepted' :
                                                 submission.r2rStatus === 'no_stream' ? 'Not Qualifying' :
                                                 submission.r2rStatus === 'auth_required' ? 'OTP Required' :
                                                 submission.r2rStatus === 'pending' ? 'Pending' :
                                                 submission.r2rStatus === 'not_configured' ? 'Not Configured' : 'Failed'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Signature */}
                            {submission.signature && (
                                <div className="modal-section">
                                    <h3 className="section-title">
                                        <FileText size={18} />
                                        Signature
                                    </h3>
                                    <div className="signature-display" style={{background:'#fff',padding:'15px',borderRadius:'8px',border:'1px solid #e2e8f0',textAlign:'center'}}>
                                        <img src={submission.signature} alt="Signature" style={{maxWidth:'100%',maxHeight:'150px',objectFit:'contain'}} />
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

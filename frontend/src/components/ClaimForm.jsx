import { useState, useEffect, useCallback, useRef } from 'react';
import { Check, AlertCircle, Loader2, Save } from 'lucide-react';
import './ClaimForm.css';

// Generate or retrieve session ID
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('claimSessionId');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem('claimSessionId', sessionId);
    }
    return sessionId;
};

const API_BASE_URL = 'http://localhost:5001';

const ClaimForm = ({ formRef }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [sessionId] = useState(getSessionId);
    const [lastSaved, setLastSaved] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const autoSaveTimer = useRef(null);

    const [formData, setFormData] = useState({
        // Personal Details
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',

        // Address
        addressLine1: '',
        addressLine2: '',
        city: '',
        county: '',
        postcode: '',
        hasPreviousAddress: false,
        prevAddressLine1: '',
        prevAddressLine2: '',
        prevCity: '',
        prevPostcode: '',

        // Claim Details
        hadCarFinance: true,
        financeType: '',
        financePeriod: '',
        financePeriodStart: '',
        financePeriodEnd: '',
        wasCommissionDisclosed: 'unsure',

        // Consent (simplified)
        termsAccepted: false
    });

    // Load existing draft on component mount
    useEffect(() => {
        const loadDraft = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/drafts/get-draft`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-session-id': sessionId
                    }
                });

                const data = await response.json();

                if (data.success && data.draft && data.draft.formData) {
                    const savedData = data.draft.formData;
                    setFormData(prev => ({
                        ...prev,
                        ...savedData
                    }));
                    setLastSaved(new Date(data.draft.lastSaved));
                    setDraftLoaded(true);
                    console.log('Draft loaded successfully');
                }
            } catch (error) {
                console.log('No draft found or error loading:', error);
            }
        };

        loadDraft();
    }, [sessionId]);

    // Auto-save function
    const saveDraft = useCallback(async () => {
        if (isSaving) return;

        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/drafts/auto-save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({
                    sessionId,
                    formData,
                    formType: 'claim',
                    currentStep: 1
                })
            });

            const data = await response.json();
            if (data.success) {
                setLastSaved(new Date());
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            setIsSaving(false);
        }
    }, [formData, sessionId, isSaving]);

    // Debounced auto-save on form changes
    useEffect(() => {
        if (draftLoaded || formData.firstName || formData.email) {
            if (autoSaveTimer.current) {
                clearTimeout(autoSaveTimer.current);
            }
            autoSaveTimer.current = setTimeout(() => {
                saveDraft();
            }, 3000);
        }

        return () => {
            if (autoSaveTimer.current) {
                clearTimeout(autoSaveTimer.current);
            }
        };
    }, [formData, draftLoaded, saveDraft]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Personal Details
        if (!formData.title) newErrors.title = 'Please select a title';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';

        // Address
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
        else if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(formData.postcode)) newErrors.postcode = 'Invalid UK postcode';

        // Finance Details
        if (!formData.financeType) newErrors.financeType = 'Please select finance type';
        if (!formData.financePeriodStart) newErrors.financePeriodStart = 'Start year is required';
        if (!formData.financePeriodEnd) newErrors.financePeriodEnd = 'End year is required';

        // Consent
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('.form-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setIsSubmitting(true);

        const claimData = {
            sessionId,
            ...formData,
            // Map dob to dateOfBirth for backend consistency if needed, 
            // but the backend schema now expects dateOfBirth.
            // Let's ensure dob from form is sent as dateOfBirth.
            dateOfBirth: formData.dob,
            financePeriod: formData.financePeriod || `${formData.financePeriodStart}-${formData.financePeriodEnd}`,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/claims`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify(claimData),
            });


            const data = await response.json();

            if (response.ok || data.success) {
                sessionStorage.removeItem('claimSessionId');
                setSubmitSuccess(true);
            } else {
                console.error('Submission failed:', data);
                alert(data.message || 'There was an error submitting your claim. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('A network error occurred. Please check your connection and try again.');
        }

        setIsSubmitting(false);
    };

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2000; y--) {
        years.push(y);
    }

    if (submitSuccess) {
        return (
            <section className="claim-form-section" id="claim-form" ref={formRef}>
                <div className="container">
                    <div className="form-card success-card">
                        <div className="success-icon">
                            <Check size={48} />
                        </div>
                        <h2>Claim Submitted Successfully!</h2>
                        <p>Thank you for submitting your claim. Our team will review your details and be in touch within 24-48 hours.</p>
                        <p className="success-note">A confirmation email has been sent to <strong>{formData.email}</strong></p>
                        <div className="success-steps">
                            <h4>What happens next?</h4>
                            <ol>
                                <li>Our team will review your submission</li>
                                <li>We'll search for your eligible finance agreements</li>
                                <li>If eligible, we'll submit your claim on your behalf</li>
                                <li>You'll only pay if your claim is successful</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="claim-form-section" id="claim-form" ref={formRef}>
            <div className="container">
                <div className="section-header">
                    <h2>Start Your Claim</h2>
                    <p>Complete the form below to check your eligibility for PCP car finance compensation</p>
                </div>

                <div className="form-card single-page-form">
                    {/* Auto-save indicator */}
                    {lastSaved && (
                        <div className="auto-save-indicator">
                            {isSaving ? (
                                <>
                                    <Loader2 size={14} className="spinner-icon" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                                </>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Personal Details */}
                        <div className="form-section">
                            <div className="section-title">
                                <span className="section-number">1</span>
                                <h3>Personal Details</h3>
                            </div>
                            <p className="section-description">Tell us a bit about yourself</p>

                            <div className="form-row">
                                <div className="form-group form-group-small">
                                    <label className="form-label">Title *</label>
                                    <select
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={`form-select ${errors.title ? 'error' : ''}`}
                                    >
                                        <option value="">Select</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Miss">Miss</option>
                                        <option value="Ms">Ms</option>
                                        <option value="Dr">Dr</option>
                                    </select>
                                    {errors.title && <span className="form-error">{errors.title}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                                        placeholder="John"
                                    />
                                    {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                                        placeholder="Smith"
                                    />
                                    {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        placeholder="john.smith@example.com"
                                    />
                                    {errors.email && <span className="form-error">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`form-input ${errors.phone ? 'error' : ''}`}
                                        placeholder="07XXX XXXXXX"
                                    />
                                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className={`form-input ${errors.dob ? 'error' : ''}`}
                                    />
                                    {errors.dob && <span className="form-error">{errors.dob}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Address */}
                        <div className="form-section">
                            <div className="section-title">
                                <span className="section-number">2</span>
                                <h3>Your Address</h3>
                            </div>
                            <p className="section-description">We need your address to locate your finance agreements</p>

                            <div className="form-group">
                                <label className="form-label">Address Line 1 *</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    className={`form-input ${errors.addressLine1 ? 'error' : ''}`}
                                    placeholder="123 Main Street"
                                />
                                {errors.addressLine1 && <span className="form-error">{errors.addressLine1}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address Line 2</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Apartment, suite, etc. (optional)"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`form-input ${errors.city ? 'error' : ''}`}
                                        placeholder="London"
                                    />
                                    {errors.city && <span className="form-error">{errors.city}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">County</label>
                                    <input
                                        type="text"
                                        name="county"
                                        value={formData.county}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Greater London"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Postcode *</label>
                                    <input
                                        type="text"
                                        name="postcode"
                                        value={formData.postcode}
                                        onChange={handleChange}
                                        className={`form-input ${errors.postcode ? 'error' : ''}`}
                                        placeholder="SW1A 1AA"
                                    />
                                    {errors.postcode && <span className="form-error">{errors.postcode}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="hasPreviousAddress"
                                        checked={formData.hasPreviousAddress}
                                        onChange={handleChange}
                                    />
                                    <span>I have lived at a different address in the last 3 years</span>
                                </label>
                            </div>

                            {formData.hasPreviousAddress && (
                                <div className="previous-address animate-fadeIn">
                                    <h4>Previous Address</h4>
                                    <div className="form-group">
                                        <label className="form-label">Address Line 1</label>
                                        <input
                                            type="text"
                                            name="prevAddressLine1"
                                            value={formData.prevAddressLine1}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                name="prevCity"
                                                value={formData.prevCity}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Postcode</label>
                                            <input
                                                type="text"
                                                name="prevPostcode"
                                                value={formData.prevPostcode}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 3: Finance Details */}
                        <div className="form-section">
                            <div className="section-title">
                                <span className="section-number">3</span>
                                <h3>Finance Details</h3>
                            </div>
                            <p className="section-description">Tell us about your car finance</p>

                            <div className="form-group">
                                <label className="form-label">What type of car finance did you have? *</label>
                                <div className="radio-group">
                                    {['PCP', 'HP', 'Both', 'Not Sure'].map(type => (
                                        <label key={type} className="radio-option">
                                            <input
                                                type="radio"
                                                name="financeType"
                                                value={type}
                                                checked={formData.financeType === type}
                                                onChange={handleChange}
                                            />
                                            <span className="radio-label">{type === 'HP' ? 'HP (Hire Purchase)' : type === 'PCP' ? 'PCP (Personal Contract Purchase)' : type}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.financeType && <span className="form-error">{errors.financeType}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">When did your finance start? *</label>
                                    <select
                                        name="financePeriodStart"
                                        value={formData.financePeriodStart}
                                        onChange={handleChange}
                                        className={`form-select ${errors.financePeriodStart ? 'error' : ''}`}
                                    >
                                        <option value="">Select year</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    {errors.financePeriodStart && <span className="form-error">{errors.financePeriodStart}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">When did your finance end? *</label>
                                    <select
                                        name="financePeriodEnd"
                                        value={formData.financePeriodEnd}
                                        onChange={handleChange}
                                        className={`form-select ${errors.financePeriodEnd ? 'error' : ''}`}
                                    >
                                        <option value="">Select year</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    {errors.financePeriodEnd && <span className="form-error">{errors.financePeriodEnd}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Were you made aware of any commission paid to the dealer?</label>
                                <div className="radio-group horizontal">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="wasCommissionDisclosed"
                                            value="yes"
                                            checked={formData.wasCommissionDisclosed === 'yes'}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-label">Yes</span>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="wasCommissionDisclosed"
                                            value="no"
                                            checked={formData.wasCommissionDisclosed === 'no'}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-label">No</span>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="wasCommissionDisclosed"
                                            value="unsure"
                                            checked={formData.wasCommissionDisclosed === 'unsure'}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-label">Not sure</span>
                                    </label>
                                </div>
                            </div>

                            <div className="info-box">
                                <AlertCircle size={20} />
                                <p>If you answered "No" or "Not sure", you may be entitled to compensation as the dealer may have earned hidden commission without your knowledge.</p>
                            </div>
                        </div>

                        {/* Terms acceptance */}
                        <div className="consent-section">
                            <div className="form-group">
                                <label className={`form-checkbox ${errors.termsAccepted ? 'checkbox-error' : ''}`}>
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                    />
                                    <span>I have read and agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a> *</span>
                                </label>
                                {errors.termsAccepted && <span className="form-error">{errors.termsAccepted}</span>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="form-submit">
                            <button type="submit" className="btn btn-primary btn-large" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={20} className="spinner-icon" />
                                        Submitting Your Claim...
                                    </>
                                ) : (
                                    <>
                                        Submit My Claim
                                        <Check size={20} />
                                    </>
                                )}
                            </button>
                            <p className="submit-note">By submitting, you agree to our terms and authorize us to process your claim.</p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ClaimForm;

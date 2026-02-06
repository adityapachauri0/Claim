import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Shield, BarChart2, Settings, Save, Cookie } from 'lucide-react';
import './CookieConsent.css';

const CookieConsent = () => {
    const [showModal, setShowModal] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true,    // Always true for necessary cookies
        analytics: false,
        functional: false,
        marketing: false,
        autoSave: false
    });

    // Handle escape key to dismiss modal
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && showModal) {
                handleRejectAll();
            }
        };

        if (showModal) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    // Check for existing consent on mount
    useEffect(() => {
        const existingConsent = localStorage.getItem('pcpClaimTodayConsent');

        if (!existingConsent) {
            const timer = setTimeout(() => {
                setShowModal(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            try {
                const savedPreferences = JSON.parse(existingConsent);
                setPreferences(savedPreferences);
                applyConsentSettings(savedPreferences);
                setShowModal(false);
            } catch (error) {
                localStorage.removeItem('pcpClaimTodayConsent');
                setShowModal(true);
            }
        }

        // Initialize Google Consent Mode v2 with default denied state
        if (window.gtag) {
            window.gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500
            });
        }
    }, []);

    const applyConsentSettings = (prefs) => {
        // Update Google Consent Mode
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': prefs.analytics ? 'granted' : 'denied',
                'ad_storage': prefs.marketing ? 'granted' : 'denied',
                'ad_user_data': prefs.marketing ? 'granted' : 'denied',
                'ad_personalization': prefs.marketing ? 'granted' : 'denied',
                'functionality_storage': prefs.functional ? 'granted' : 'denied',
                'personalization_storage': prefs.functional ? 'granted' : 'denied',
                'security_storage': 'granted'
            });
        }

        // Push consent event to dataLayer for GTM
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'consent_update',
                'consent_categories': {
                    'essential': prefs.essential,
                    'analytics': prefs.analytics,
                    'functional': prefs.functional,
                    'marketing': prefs.marketing,
                    'autoSave': prefs.autoSave
                }
            });
        }
    };

    const handleAcceptAll = () => {
        const allAccepted = {
            essential: true,
            analytics: true,
            functional: true,
            marketing: true,
            autoSave: true
        };
        savePreferences(allAccepted);
    };

    const handleRejectAll = () => {
        const allRejected = {
            essential: true,
            analytics: false,
            functional: false,
            marketing: false,
            autoSave: false
        };
        savePreferences(allRejected);
    };

    const handleSavePreferences = () => {
        savePreferences(preferences);
    };

    const savePreferences = (prefs) => {
        // Save consent preferences
        localStorage.setItem('pcpClaimTodayConsent', JSON.stringify(prefs));
        localStorage.setItem('consentTimestamp', new Date().toISOString());

        // Set auto-save consent separately for form handling
        localStorage.setItem('globalAutoSaveConsent', prefs.autoSave.toString());

        // Set cookie for server-side checking
        Cookies.set('cookieConsent', prefs.analytics || prefs.marketing ? 'accepted' : 'essential', {
            expires: 365,
            sameSite: 'strict'
        });

        // Apply consent settings
        applyConsentSettings(prefs);

        // Track consent event
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'cookie_consent_updated',
                'consent_type': prefs.analytics && prefs.marketing ? 'all' :
                    prefs.analytics || prefs.marketing ? 'partial' : 'essential'
            });
        }

        setShowModal(false);
    };

    const togglePreference = (key) => {
        if (key === 'essential') return;

        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    if (!showModal) return null;

    return (
        <div className="cookie-consent-overlay">
            <div className="cookie-consent-modal">
                {/* Header */}
                <div className="cookie-consent-header">
                    <h2>
                        <Shield size={20} />
                        Privacy Settings
                    </h2>
                    <p>We respect your privacy and your choices</p>
                </div>

                {/* Consent Options */}
                <div className="cookie-consent-options">
                    {/* Essential Cookies - Always On */}
                    <div className="consent-option essential">
                        <div className="consent-option-info">
                            <Shield size={18} />
                            <div>
                                <p className="consent-option-title">Essential</p>
                                <p className="consent-option-desc">Required for site functionality</p>
                            </div>
                        </div>
                        <div className="toggle-switch always-on">
                            <div className="toggle-slider on"></div>
                        </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="consent-option analytics">
                        <div className="consent-option-info">
                            <BarChart2 size={18} />
                            <div>
                                <p className="consent-option-title">Analytics</p>
                                <p className="consent-option-desc">Help us improve our services</p>
                            </div>
                        </div>
                        <button
                            onClick={() => togglePreference('analytics')}
                            className={`toggle-switch ${preferences.analytics ? 'on' : 'off'}`}
                            aria-label="Toggle analytics cookies"
                        >
                            <div className={`toggle-slider ${preferences.analytics ? 'on' : 'off'}`}></div>
                        </button>
                    </div>

                    {/* Functional Cookies */}
                    <div className="consent-option functional">
                        <div className="consent-option-info">
                            <Settings size={18} />
                            <div>
                                <p className="consent-option-title">Functional</p>
                                <p className="consent-option-desc">Enhanced website features</p>
                            </div>
                        </div>
                        <button
                            onClick={() => togglePreference('functional')}
                            className={`toggle-switch ${preferences.functional ? 'on' : 'off'}`}
                            aria-label="Toggle functional cookies"
                        >
                            <div className={`toggle-slider ${preferences.functional ? 'on' : 'off'}`}></div>
                        </button>
                    </div>

                    {/* Auto-Save */}
                    <div className="consent-option autosave">
                        <div className="consent-option-info">
                            <Save size={18} />
                            <div>
                                <p className="consent-option-title">Auto-Save</p>
                                <p className="consent-option-desc">Save form progress automatically</p>
                            </div>
                        </div>
                        <button
                            onClick={() => togglePreference('autoSave')}
                            className={`toggle-switch ${preferences.autoSave ? 'on' : 'off'}`}
                            aria-label="Toggle auto-save"
                        >
                            <div className={`toggle-slider ${preferences.autoSave ? 'on' : 'off'}`}></div>
                        </button>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="consent-option marketing">
                        <div className="consent-option-info">
                            <Cookie size={18} />
                            <div>
                                <p className="consent-option-title">Marketing</p>
                                <p className="consent-option-desc">Personalized content</p>
                            </div>
                        </div>
                        <button
                            onClick={() => togglePreference('marketing')}
                            className={`toggle-switch ${preferences.marketing ? 'on' : 'off'}`}
                            aria-label="Toggle marketing cookies"
                        >
                            <div className={`toggle-slider ${preferences.marketing ? 'on' : 'off'}`}></div>
                        </button>
                    </div>
                </div>

                {/* Footer with Actions */}
                <div className="cookie-consent-footer">
                    <div className="cookie-consent-buttons">
                        <button onClick={handleSavePreferences} className="btn-save">
                            Save
                        </button>
                        <button onClick={handleRejectAll} className="btn-reject">
                            Reject All
                        </button>
                        <button onClick={handleAcceptAll} className="btn-accept">
                            Accept All
                        </button>
                    </div>
                    <p className="cookie-consent-note">
                        Essential cookies always enabled. View our{' '}
                        <a href="/cookies">Cookie Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;

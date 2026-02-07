import { useRef } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Eligibility from '../components/Eligibility';
import ClaimForm from '../components/ClaimForm';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import FeesAndCharges from '../components/FeesAndCharges';
import Footer from '../components/Footer';
import RecentClaims from '../components/RecentClaims';
import ExitIntentPopup from '../components/ExitIntentPopup';

const Home = () => {
    const formRef = useRef(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="home-page">
            <Header />
            <main>
                <Hero onStartClaim={scrollToForm} />
                <HowItWorks />
                <Eligibility />
                <ClaimForm formRef={formRef} />
                <Testimonials />
                <FAQ />
                <FeesAndCharges />
            </main>
            <Footer />

            {/* Recent Claims Ticker - Social Proof */}
            <RecentClaims />

            {/* Exit Intent Popup */}
            <ExitIntentPopup onStartClaim={scrollToForm} />

            {/* Mobile Sticky CTA */}
            <div className="mobile-sticky-cta">
                <button className="btn btn-primary" onClick={scrollToForm}>
                    Start Your Free Claim Check
                </button>
            </div>
        </div>
    );
};

export default Home;

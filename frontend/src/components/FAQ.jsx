import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: 'What is a PCP car finance claim?',
            answer: 'A PCP (Personal Contract Purchase) car finance claim is a compensation claim made against car finance providers who may have mis-sold your finance agreement. This typically involves hidden commission arrangements where the dealer received a commission from the lender without your knowledge, which may have resulted in you paying a higher interest rate than necessary.'
        },
        {
            question: 'How much compensation can I expect to receive?',
            answer: 'The average compensation is around £700 per finance agreement, though this can vary significantly. Some customers have received over £1,500 depending on factors such as the size of the hidden commission, the interest rate you paid, and the length of your agreement. The FCA estimates that £8 billion will be paid out across affected customers.'
        },
        {
            question: 'How long does the claims process take?',
            answer: 'Most claims are resolved within 3-6 months, though the timeframe can vary depending on the complexity of your claim and the lender\'s response time. The FCA has set deadlines for lenders to respond to complaints. We\'ll keep you updated on the progress of your claim throughout the process.'
        },
        {
            question: 'What does "No Win, No Fee" mean?',
            answer: 'No Win, No Fee means you won\'t pay anything if your claim is unsuccessful. Our service is completely free to use unless we successfully recover compensation for you. If your claim is successful, we charge a fee between 18-36% (including VAT) of the compensation received.'
        },
        {
            question: 'Am I eligible to make a claim?',
            answer: 'You may be eligible if you took out PCP or HP car finance between April 2007 and November 2024, and you weren\'t made aware of any commission paid to the dealer. Even if you\'re not sure, it\'s worth checking – our eligibility check is free and takes just 60 seconds.'
        },
        {
            question: 'What information do I need to make a claim?',
            answer: 'To start your claim, you\'ll need to provide basic personal information including your name, address history, date of birth, and contact details. We\'ll use this information to search for your finance agreements. You don\'t need to have your original finance documents – we can locate these for you.'
        },
        {
            question: 'Can I claim if I\'ve already paid off my finance?',
            answer: 'Yes! You can claim for any PCP or HP finance agreements you\'ve had since April 2007, even if they\'ve been fully paid off. In fact, most successful claims are for agreements that have already ended.'
        },
        {
            question: 'What happens after I submit my claim?',
            answer: 'After you submit your claim, our team will review your details and search for your finance agreements. We\'ll then send a letter of complaint to each relevant lender on your behalf. The lender will investigate your claim and respond within the timeframes set by the FCA. We\'ll keep you informed at every stage of the process.'
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="faq" id="faq">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Got Questions?</span>
                    <h2>Frequently Asked Questions</h2>
                    <p>Find answers to common questions about the claims process</p>
                </div>

                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{faq.question}</span>
                                <ChevronDown className="faq-icon" size={24} />
                            </button>
                            <div className="faq-answer">
                                <div className="faq-answer-content">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="faq-cta">
                    <p>Still have questions?</p>
                    <a href="#contact" className="btn btn-secondary">
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;

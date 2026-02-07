import { Info, AlertCircle } from 'lucide-react';
import './FeesAndCharges.css';

const FeesAndCharges = () => {
    const feeBands = [
        { band: 'A', redress: '1–1,499', percentage: '30.00%', maxFee: '£420' },
        { band: 'B', redress: '1,500–9,999', percentage: '28.00%', maxFee: '£2,500' },
        { band: 'C', redress: '10,000–24,999', percentage: '25.00%', maxFee: '£5,000' },
        { band: 'D', redress: '25,000–49,999', percentage: '20.00%', maxFee: '£7,500' },
        { band: 'E', redress: '50,000+', percentage: '15.00%', maxFee: '£10,000' },
    ];

    return (
        <section className="fees-section" id="fees">
            <div className="container">
                <div className="fees-header">
                    <span className="section-badge">Transparent Pricing</span>
                    <h2>Fees & Charges</h2>
                    <p className="fees-intro">
                        PCP Refunds will act on a <strong>'NO WIN NO FEE'</strong> basis, and there are no administration charges or hidden fees payable.
                        Our charging rates are set in bands depending upon the amount of redress or refund you receive.
                    </p>
                    <p className="fees-vat-note">
                        <Info size={16} />
                        The fees shown are exclusive of VAT and are subject to VAT at the prevailing rate.
                    </p>
                </div>

                <div className="fees-table-wrapper">
                    <table className="fees-table">
                        <thead>
                            <tr>
                                <th>Band</th>
                                <th>Redress (£)</th>
                                <th>Fee %</th>
                                <th>Maximum Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeBands.map((row, index) => (
                                <tr key={index}>
                                    <td className="band-cell">{row.band}</td>
                                    <td>£{row.redress}</td>
                                    <td className="percentage-cell">{row.percentage}</td>
                                    <td className="max-fee-cell">{row.maxFee}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="fca-compliance">
                    These fees are in line with the <strong>FCA guidelines</strong> on compensation refunds of up to £49,999.
                </p>

                <div className="cancellation-section">
                    <h3>
                        <AlertCircle size={20} />
                        Cancellation Policy
                    </h3>

                    <div className="cancellation-content">
                        <div className="cooling-off">
                            <h4>14-Day Cooling Off Period</h4>
                            <p>
                                You have a 14-day cooling off period which starts from the date you sign/e-sign the Letter of Authority
                                in which you can cancel your contract without charge.
                            </p>
                            <p className="contact-info">
                                To cancel, please email <a href="mailto:info@pcprefunds.co.uk">info@pcprefunds.co.uk</a> or write to us at:
                                <br />
                                <strong>PCP Refunds, Biz Space Cheadle Place, Stockport Rd, Cheadle SK8 2JX</strong>
                            </p>
                            <p className="note">
                                <strong>Note:</strong> If at any time during the 14-day cooling off period, we receive an offer of compensation, our normal fees will be payable.
                            </p>
                        </div>

                        <div className="after-cooling-off">
                            <h4>Cancellation After 14 Days</h4>
                            <p>
                                If you cancel after the 14-day cooling off period but before an offer of redress is made,
                                PCP Refunds may decide to make a fair and reasonable cancellation charge which will be determined
                                by the amount of work completed to that point in time in relation to your claim.
                            </p>
                            <p>
                                Once a cancellation is requested outside the 14 days, we will send out an itemised bill
                                detailing the work PCP Refunds have completed on your behalf.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeesAndCharges;

import React from 'react';
import './AboutLoyalty.css';

const AboutLoyalty = () => {
  return (
    <div className="about-loyalty-page">
      <div className="container">
        <h1 className="page-title">NIMASA TEX CLUB</h1>
        
        <div className="content-section">
          <h2>Nimasa Tex Club</h2>
          <p>
            Welcome to <strong>Nimasa Tex Club</strong>, the official loyalty program exclusively for customers shopping through our online store at www.nimasatex.com. Designed to reward our loyal online customers, this program allows you to earn points on every purchase and enjoy valuable savings on future orders.
          </p>
        </div>

        <div className="content-section">
          <h2>How to Enroll</h2>
          <p>Joining <strong>Nimasa Tex Club</strong> is easy and completely free:</p>
          <ul>
            <li>Simply create or log into your account at https://nimasatex.com/account.</li>
            <li>Upon your first online purchase, you will be automatically enrolled in the program.</li>
            <li>No physical card is required — your loyalty is tracked through your online account.</li>
          </ul>
        </div>

        <div className="content-section">
          <h2>How It Works</h2>
          <ul>
            <li>Earn <strong>1 point</strong> for every <strong>Rs.100</strong> spent on www.nimasatex.com.</li>
            <li><strong>1 point = Rs.1</strong> in redeemable value.</li>
            <li>Points can be redeemed as discount vouchers of <strong>Rs.500, Rs.1,000, Rs.2,000,</strong> or <strong>Rs.5,000</strong> on future online purchases.</li>
            <li>Vouchers can be redeemed during checkout when your point balance qualifies.</li>
            <li>Redemption options will be visible on the checkout page once eligible thresholds are met.</li>
            <li>Partial redemptions are not supported. You must redeem one of the preset voucher amounts.</li>
            <li>Points cannot be redeemed for cash or transferred between accounts.</li>
          </ul>
        </div>

        <div className="content-section">
          <h2>Loyalty Program Benefits</h2>
          <ul>
            <li>Lifetime membership with no renewal required.</li>
            <li>Special promotions and bonus points campaigns during seasonal sales.</li>
            <li>Exclusive access to loyalty-only online discounts and early product releases.</li>
            <li>Notifications of offers via email or SMS (if opted-in).</li>
          </ul>
        </div>

        <div className="content-section">
          <h2>Terms and Conditions</h2>
          <ol>
            <li><strong>Nimasa Tex Club</strong> is valid for <strong>online store purchases only</strong> at www.nimasatex.com.</li>
            <li>Points are awarded <strong>only for completed and paid orders</strong>. Cancelled, returned, or refunded orders will not earn points (or will result in point deduction).</li>
            <li>Points <strong>cannot be combined with other customer accounts</strong> or shared/transferred.</li>
            <li>Loyalty points are <strong>valid for 12 months</strong> from the date of issue and will automatically expire after this period.</li>
            <li>Redemption is subject to system availability and may not be available during website maintenance or technical outages.</li>
            <li><strong>Nimasa Tex</strong> reserves the right to:
              <ul>
                <li>Modify or discontinue the loyalty program at any time without prior notice.</li>
                <li>Adjust point values, redemption thresholds, and promotional benefits.</li>
                <li>Cancel any membership that is deemed to be misused or fraudulent.</li>
              </ul>
            </li>
            <li>In case of any disputes, the decision of <strong>Nimasa Tex Online</strong> will be final.</li>
          </ol>
        </div>

        <div className="content-section customer-support">
          <h2>Customer Support</h2>
          <p>For inquiries or assistance regarding <strong>Nimasa Tex Club</strong>, please contact:</p>
          <ul>
            <li><strong>WhatsApp:</strong> +94 75 436 0408</li>
            <li><strong>Hotline:</strong> +94 312 259 681</li>
            <li><strong>Store Location:</strong> No 7 Pannala Road, Dankotuwa.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutLoyalty;

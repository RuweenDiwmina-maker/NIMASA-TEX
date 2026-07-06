import React from 'react';

const Shipping = () => {
  return (
    <>
      <header className="info-page-header">
        <h1>Shipping & Delivery</h1>
        <p>Everything you need to know about getting your Nimasa Tex gear.</p>
      </header>
      <main className="info-page-content">
        <div className="info-block">
          <h2>Delivery Options & Times</h2>
          <p>Nimasa Tex offers multiple shipping options to ensure your premium gear arrives when you need it. Note that orders placed after 2 PM will begin processing the following business day.</p>
          <table className="shipping-table">
            <thead>
              <tr>
                <th>Shipping Method</th>
                <th>Delivery Time</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard Delivery</td>
                <td>3-5 Business Days</td>
                <td>$8.00 (Free for orders over $150)</td>
              </tr>
              <tr>
                <td>Express Delivery</td>
                <td>2 Business Days</td>
                <td>$15.00</td>
              </tr>
              <tr>
                <td>Next Day Delivery</td>
                <td>1 Business Day</td>
                <td>$25.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-block">
          <h2>Free Shipping Eligibility</h2>
          <p>We offer free Standard Delivery on all orders totaling $150 or more (before taxes and after discounts are applied). Simply select the standard shipping option at checkout and the discount will be automatically applied.</p>
        </div>
      </main>
    </>
  );
};

export default Shipping;

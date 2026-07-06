import React from 'react';

const Returns = () => {
  return (
    <>
      <header className="info-page-header">
        <h1>Returns & Exchanges</h1>
        <p>Hassle-free returns because we want you to be perfectly satisfied.</p>
      </header>
      <main className="info-page-content">
        <div className="info-block">
          <h2>Our Return Policy</h2>
          <p>If you are not completely satisfied with your Nimasa Tex purchase, you may return it within 30 days of receipt for a full refund or exchange. Items must be unworn, unwashed, and have original tags attached.</p>
          <ul className="info-list">
            <li><strong>Standard Items:</strong> 30 days to return.</li>
            <li><strong>Sale Items:</strong> 14 days to return.</li>
            <li><strong>Intimates & Swimwear:</strong> Final sale. Cannot be returned.</li>
          </ul>
        </div>

        <div className="info-block">
          <h2>How to Return</h2>
          <ol className="info-list">
            <li>Log into your account and select "Order History".</li>
            <li>Select the order you wish to return and click "Start Return".</li>
            <li>Print the prepaid shipping label provided.</li>
            <li>Pack the item(s) securely and attach the label to the outside of the package.</li>
            <li>Drop it off at any authorized courier location.</li>
          </ol>
          <p>Please note: A $5.00 return shipping fee will be deducted from your refund amount. Exchanges are always free!</p>
        </div>
      </main>
    </>
  );
};

export default Returns;

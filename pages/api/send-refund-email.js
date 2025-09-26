import nodemailer from 'nodemailer';

// Reuse the transporter from other email endpoints
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }
  return transporter;
}

// Simple authentication check
function checkAuth(req) {
  const sessionCookie = req.headers.cookie?.split(';')
    .find(cookie => cookie.trim().startsWith('session='));
  
  if (!sessionCookie) {
    return false;
  }
  
  try {
    const sessionValue = sessionCookie.split('=')[1];
    // Basic JWT validation (same as other email endpoints)
    const parts = sessionValue.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.userId === '1234567890';
  } catch (error) {
    console.error('Auth validation error:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { customerEmail, customerName, productName, refundAmount } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !productName || !refundAmount) {
      return res.status(400).json({ 
        error: 'Missing required fields: customerEmail, customerName, productName, and refundAmount are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate refund amount
    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid refund amount' });
    }

    console.log('=== SENDING REFUND CONFIRMATION EMAIL ===');
    console.log('Customer Email:', customerEmail);
    console.log('Product:', productName);
    console.log('Refund Amount:', `$${amount.toFixed(2)}`);

    // Get the email transporter
    const emailTransporter = getTransporter();

    // HTML email template - Redesigned based on design guidelines
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Refund Confirmation</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header-section { 
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
            color: white; 
            padding: 48px 32px; 
            text-align: center; 
            position: relative;
          }
          .header-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="20" cy="80" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          .header-title { 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          .header-subtitle { 
            font-size: 18px; 
            opacity: 0.9;
            font-weight: 400;
            position: relative;
            z-index: 1;
          }
          .content { 
            padding: 48px 32px; 
          }
          .refund-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .refund-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          }
          .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 32px;
            color: white;
            font-size: 32px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
            position: relative;
          }
          .refund-title {
            font-size: 28px;
            font-weight: 600;
            color: #1f2937;
            text-align: center;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
          }
          .refund-subtitle {
            font-size: 16px;
            color: #6b7280;
            text-align: center;
            margin-bottom: 32px;
            line-height: 1.5;
          }
          .amount-display {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-bottom: 0;
            position: relative;
          }
          .amount-display::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 0 0 8px 8px;
          }
          .amount-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
            font-weight: 500;
          }
          .amount-value {
            font-size: 32px;
            font-weight: 700;
            color: #1e3a8a;
          }
          .status-badge {
            display: inline-block;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #000000;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
          }
          .refund-details {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          .detail-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
          }
          .detail-value {
            color: #1f2937;
            font-weight: 600;
            text-align: right;
            max-width: 60%;
          }
          .timeline {
            background: #e0f2fe;
            border: 1px solid #3b82f6;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
          }
          .timeline h3 {
            color: #1e3a8a;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .timeline-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;
            padding-left: 8px;
          }
          .timeline-item:last-child {
            margin-bottom: 0;
          }
          .timeline-number {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #000000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            margin-right: 12px;
            flex-shrink: 0;
          }
          .timeline-content {
            color: #1e3a8a;
            font-size: 14px;
            line-height: 1.5;
          }
          .footer { 
            background: #f8fafc; 
            padding: 32px; 
            text-align: center; 
            border-top: 1px solid #e5e7eb;
          }
          .footer-content {
            max-width: 400px;
            margin: 0 auto;
          }
          .footer h3 {
            color: #374151;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .footer p { 
            color: #6b7280; 
            font-size: 14px; 
            margin-bottom: 16px;
          }
          .contact-info {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-bottom: 16px;
          }
          .contact-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
          }
          .contact-link:hover {
            color: #1e3a8a;
          }
          .copyright {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
          }
          @media (max-width: 600px) {
            .container { margin: 16px; }
            .header-section { padding: 32px 24px; }
            .content { padding: 32px 24px; }
            .refund-card { padding: 24px; }
            .refund-details { padding: 20px; }
            .timeline { padding: 20px; }
            .footer { padding: 24px; }
            .contact-info { flex-direction: column; gap: 12px; }
            .detail-row { flex-direction: column; align-items: flex-start; gap: 4px; }
            .detail-value { max-width: 100%; text-align: left; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-section">
            <h1 class="header-title">Refund Processed</h1>
            <p class="header-subtitle">Your refund has been successfully processed</p>
          </div>
          
          <div class="content">
            <p style="font-size: 18px; margin-bottom: 32px; color: #374151;">Dear ${customerName},</p>
            
            <div class="refund-card">
              <div class="success-icon">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                    <path d="M12 20L17 25L28 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  </svg>
                </div>
              <h2 class="refund-title">Your Order Has Been Successfully Refunded</h2>
              <p class="refund-subtitle">We have processed a full refund for your order. The refund amount will appear in your original payment method.</p>
              
              <div class="amount-display">
                <div class="amount-label">Full Refund Amount</div>
                <div class="amount-value">$${amount.toFixed(2)}</div>
              </div>
            </div>

            <div class="refund-details">
              <h3 class="detail-title">Refund Details</h3>
              <div class="detail-row">
                <span class="detail-label">Product</span>
                <span class="detail-value">${productName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer Email</span>
                <span class="detail-value">${customerEmail}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Refund Amount</span>
                <span class="detail-value" style="color: #1e3a8a; font-weight: 700;">$${amount.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value" style="color: #3b82f6; font-weight: 700;">Processed</span>
              </div>
            </div>

            <div class="timeline">
              <h3>What happens next?</h3>
              <div class="timeline-item">
                <div class="timeline-number">1</div>
                <div class="timeline-content">Your full refund has been processed by our team</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-number">2</div>
                <div class="timeline-content">The full refund amount will appear in your original payment method within 3-5 business days</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-number">3</div>
                <div class="timeline-content">You'll see the transaction reflected in your account statement</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <h3>Need Help?</h3>
              <p>If you have any questions about your refund, our customer service team is here to help.</p>
              <div class="contact-info">
                <a href="mailto:support@happydeel.com" class="contact-link">📧 Email Support</a>
                <a href="tel:+17176484487" class="contact-link">📞 +17176484487</a>
              </div>
              <div class="copyright">
                © 2024 HappyDeel. All rights reserved.<br>
                The smart way to buy quality items — for less.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the email
    const mailOptions = {
      from: `"Customer Service" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: 'Your Refund Has Been Processed',
      html: htmlTemplate,
      text: `
        Your Order Has Been Successfully Refunded
        
        Dear ${customerName},
        
        Great news! Your order has been successfully refunded with a full refund.
        
        Refund Details:
        - Product: ${productName}
        - Full Refund Amount: $${amount.toFixed(2)}
        - Status: Processed
        
        What happens next:
        1. Your full refund has been processed by our team
        2. The full refund amount will appear in your original payment method within 3-5 business days
        3. You'll see the transaction reflected in your account statement
        
        If you have any questions, please contact us:
        Email: support@happydeel.com
        Phone: +17176484487
        
        Thank you for your business!
        
        This email was sent to ${customerEmail}
      `
    };

    // Send the email
    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log('✅ Refund email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Refund confirmation email sent successfully',
      data: {
        customerEmail,
        productName,
        refundAmount: `$${amount.toFixed(2)}`,
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error sending refund email:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Failed to send refund confirmation email',
      details: error.message
    });
  }
}
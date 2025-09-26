import nodemailer from 'nodemailer';

// Reuse the transporter from the shipping email
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
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
    // Basic JWT validation (same as shipping email)
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
    const { customerEmail, customerAddress, productName } = req.body;

    // Validate required fields
    if (!customerEmail || !customerAddress || !productName) {
      return res.status(400).json({ 
        error: 'Missing required fields: customerEmail, customerAddress, and productName are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('=== SENDING ORDER CONFIRMATION EMAIL ===');
    console.log('Customer Email:', customerEmail);
    console.log('Email:', customerEmail);
    console.log('Product:', productName);

    // Get the email transporter
    const emailTransporter = getTransporter();

    // HTML email template - HappyDeel Branded
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - HappyDeel</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8f9fa; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1d4ed8 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .logo { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .logo-icon {
            width: 32px;
            height: 32px;
            background: white;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #1e3a8a;
            font-weight: bold;
            font-size: 18px;
          }
          .content { 
            padding: 40px 30px; 
            background-color: #ffffff;
          }
          .order-details { 
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
            padding: 25px; 
            border-radius: 12px; 
            margin: 25px 0; 
            border-left: 4px solid #3b82f6;
          }
          .footer { 
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px; 
          }
          .button { 
            display: inline-block; 
            padding: 14px 28px; 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
            color: white; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 20px 0; 
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
          }
          .highlight { 
            color: #3b82f6; 
            font-weight: 600; 
            background-color: #eff6ff;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .step-list {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .step-list li {
            margin: 8px 0;
            padding-left: 10px;
          }
          .tagline {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Thank You for Your Purchase!</h1>
            <p class="tagline" style="margin: 15px 0 0 0;">Your order has been confirmed and is being processed</p>
          </div>

          <!-- Main Content -->
          <div class="content">
            <p style="font-size: 18px; margin-bottom: 25px;">Dear Customer,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for choosing <strong>HappyDeel</strong> — the smart way to buy quality items for less! We're excited to confirm that we've received your order and it's being prepared for shipment.</p>
            
            <div class="order-details">
              <h3 style="margin-top: 0; color: #1e3a8a; font-size: 20px; font-weight: 600;">📋 Order Details</h3>
              <p style="margin: 15px 0;"><strong>Product:</strong> <span style="color: #3b82f6; font-weight: 600;">${productName}</span></p>
              <p style="margin: 15px 0;"><strong>Delivery Address:</strong><br>
              <span style="background-color: #f1f5f9; padding: 8px; border-radius: 4px; display: inline-block; margin-top: 5px;">${customerAddress.replace(/\n/g, '<br>')}</span></p>
            </div>
            
            <h3 style="color: #1e3a8a; font-size: 18px; margin-top: 30px;">🚀 What happens next?</h3>
            <div class="step-list">
              <ul style="margin: 0; padding-left: 20px;">
                <li>✅ Your order is now being processed by our expert team</li>
                <li>🔍 We'll carefully inspect and package your item with our reliable service</li>
                <li>📧 In <span class="highlight">2-3 business days</span>, you'll receive another email with your tracking number</li>
                <li>📦 Once shipped, you can track your package in real-time</li>
              </ul>
            </div>
            
            <p style="margin: 25px 0;">We take the risk out of used gear with expert inspection and reliable service on every order.</p>
            
            <p style="margin: 20px 0;">If you have any questions about your order, please don't hesitate to contact our support team.</p>
            
            <p style="margin: 25px 0 10px 0; font-size: 16px;">Thank you for choosing HappyDeel!</p>
            
            <p style="margin: 0;">Best regards,<br>
            <strong style="color: #3b82f6;">The HappyDeel Team</strong></p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9; font-weight: 500;">The smart way to buy quality items — for less.</p>
            </div>
            <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">This email was sent to ${customerEmail}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.7;">© 2024 HappyDeel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textTemplate = `
      Thank You for Your Purchase!
      
      Dear Customer,
      
      Thank you for choosing Happydeel! We're excited to confirm that we've received your order and it's being prepared for shipment.
      
      Order Details:
      Product: ${productName}
      Delivery Address: ${customerAddress}
      
      What happens next?
      - Your order is now being processed by our team
      - We'll carefully inspect and package your item
      - In 2-3 business days, you'll receive another email with your tracking number
      - Once shipped, you can track your package in real-time
      
      If you have any questions about your order, please don't hesitate to contact our support team.
      
      Thank you for choosing Happydeel!
      
      Best regards,
      The Happydeel Team
      
      ---
      Happydeel • Premium Pre-Owned Technology
      This email was sent to ${customerEmail}
    `;

    // Email options
    const mailOptions = {
      from: `"Happydeel" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${productName} 🎉`,
      html: htmlTemplate,
      text: textTemplate,
    };

    // Send email
    const startTime = Date.now();
    const info = await emailTransporter.sendMail(mailOptions);
    const endTime = Date.now();
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log(`Email sent in ${endTime - startTime}ms`);

    res.status(200).json({ 
      success: true, 
      message: 'Order confirmation email sent successfully!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
}
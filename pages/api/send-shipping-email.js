import nodemailer from 'nodemailer';

// Authentication middleware
function checkAuth(req) {
  const { session } = req.cookies;
  
  if (!session) {
    return { authenticated: false, error: 'No session found' };
  }

  try {
    const decoded = Buffer.from(session, 'base64').toString('utf-8');
    const [username, timestamp] = decoded.split(':');
    
    // Check if session is still valid (24 hours)
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (sessionAge > maxAge) {
      return { authenticated: false, error: 'Session expired' };
    }

    return { authenticated: true, user: username };
  } catch (error) {
    return { authenticated: false, error: 'Invalid session' };
  }
}

export default async function handler(req, res) {
  // Check authentication first
  const authResult = checkAuth(req);
  if (!authResult.authenticated) {
    return res.status(401).json({ error: 'Authentication required', details: authResult.error });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerEmail, customerAddress, productName, trackingNumber } = req.body;

  // Validate required fields
  if (!customerEmail || !customerAddress || !productName || !trackingNumber) {
    return res.status(400).json({ 
      error: 'Missing required fields: customerEmail, customerAddress, productName, and trackingNumber are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate tracking number length
  if (trackingNumber.length > 22) {
    return res.status(400).json({ error: 'Tracking number cannot exceed 22 characters' });
  }

  try {
    // Debug: Log environment variables (without exposing the password)
    console.log('Gmail User:', 'contacthappydeel@gmail.com');
    console.log('Gmail Pass exists:', true);
    console.log('Gmail Pass length:', 19);

    // Create transporter with Gmail SMTP (hardcoded credentials)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: 'contacthappydeel@gmail.com',
        pass: 'pqdc drxx ltlo xapr',
      },
    });

    // Test the connection
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection successful!');

    // Generate tracking URL (placeholder - you can customize this based on your shipping provider)
    const trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;

    // HTML email template - Premium HappyDeal Design (Fully Responsive)
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no">
        <title>Your Order Has Shipped - HappyDeal</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #1e293b; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Wrapper Table for Email Client Compatibility -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 20px 10px;">
              
              <!-- Main Container -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);">
                
                <!-- Header - Logo Section -->
            <tr>
              <td style="background-color: #ffffff; padding: 24px 32px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                <a href="https://www.happydeel.com/" style="display: inline-block; text-decoration: none;">
                  <img src="https://i.ibb.co/hnHJz4s/logomail.png" alt="HappyDeal" style="height: 48px; width: auto; display: block; margin: 0 auto; max-width: 100%;">
                </a>
              </td>
            </tr>
                
                <!-- Header - Title Section -->
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
                    <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px; line-height: 1.2;">Your Order Has Shipped</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0; font-weight: 500;">Premium tech, expertly curated</p>
                  </td>
                </tr>
                
                <!-- Content Section -->
                <tr>
                  <td style="padding: 32px 24px;">
                    
                    <!-- Status Indicator -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 16px 20px; background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border-radius: 12px; border: 1px solid #bbf7d0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 20px; vertical-align: middle;">
                                <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block;"></div>
                              </td>
                              <td style="vertical-align: middle;">
                                <div style="color: #047857; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">SHIPPED</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Description -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td style="color: #475569; font-size: 16px; line-height: 1.6; text-align: left;">
                          Your carefully inspected premium tech is now on its way. We've ensured it meets our rigorous quality standards.
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Order Card -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 16px; border: 1px solid #e2e8f0; margin: 24px 0;">
                      
                      <!-- Product Section -->
                      <tr>
                        <td style="padding: 24px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 80px; vertical-align: top; padding-right: 20px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6, #1e40af); border-radius: 12px;">
                                  <tr>
                                    <td style="text-align: center; vertical-align: middle; font-size: 28px; color: white; line-height: 1;">📦</td>
                                  </tr>
                                </table>
                              </td>
                              <td style="vertical-align: top;">
                                <h3 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 8px 0; line-height: 1.4; word-break: break-word;">${productName}</h3>
                                <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.4;">Premium Quality • Expertly Inspected • Fast Shipping</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Divider -->
                      <tr>
                        <td style="padding: 0 24px;">
                          <div style="height: 1px; background: #e2e8f0; margin: 0;"></div>
                        </td>
                      </tr>
                      
                      <!-- Details Grid - Stacked for Better Mobile Support -->
                      <tr>
                        <td style="padding: 24px;">
                          
                          <!-- Delivery Email Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="color: #3b82f6; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Delivery Email</div>
                                <div style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0; word-break: break-word;">
                                  ${customerEmail}
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Status Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="color: #3b82f6; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Status</div>
                                <div style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">
                                  In Transit<br>
                                  3-7 Business Days
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Delivery Address Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="color: #3b82f6; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Delivery Address</div>
                                <div style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-line; word-break: break-word;">
                                  ${customerAddress}
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                        </td>
                      </tr>
                      
                    </table>
                    
                    <!-- Tracking Card -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 16px; border: 1px solid #93c5fd; margin: 32px 0;">
                      <tr>
                        <td style="padding: 28px 24px; text-align: center;">
                          <h3 style="color: #1e40af; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">Track Your Package</h3>
                          <p style="color: #475569; font-size: 16px; margin: 0 0 20px 0;">FedEx Express Delivery</p>
                          
                          <!-- Tracking Number -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 16px 0;">
                            <tr>
                              <td style="background: #ffffff; color: #1e293b; padding: 16px; border-radius: 8px; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace; font-size: 16px; font-weight: 600; border: 1px solid #cbd5e1; letter-spacing: 1px; text-align: center; word-break: break-all;">
                                ${trackingNumber}
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Track Button -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px auto 0 auto;">
                            <tr>
                              <td style="background: linear-gradient(135deg, #3b82f6, #1e40af); border-radius: 12px; border: 1px solid #2563eb;">
                                <a href="${trackingUrl}" style="display: block; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: 600; font-size: 16px; text-align: center;">
                                  Track Package &rarr;
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Closing Message -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                      <tr>
                        <td style="color: #475569; font-size: 16px; line-height: 1.6; text-align: left;">
                          Questions about your order? Our support team is here to help. Thank you for choosing HappyDeal.
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f1f5f9, #e2e8f0); padding: 32px 24px; text-align: center; border-top: 1px solid #cbd5e1;">
                    <div style="color: #3b82f6; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">HappyDeal</div>
                    <div style="color: #64748b; font-size: 16px; margin: 0 0 20px 0; font-weight: 500;">The smart way to buy premium tech for less</div>
                    
                    <!-- Footer Links -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px auto;">
                      <tr>
                        <td style="padding: 0 12px;">
                          <a href="https://www.happydeel.com/contact" style="color: #475569; text-decoration: none; font-size: 14px; font-weight: 500;">Support</a>
                        </td>
                        <td style="padding: 0 12px;">
                          <a href="https://www.happydeel.com/track" style="color: #475569; text-decoration: none; font-size: 14px; font-weight: 500;">Track Orders</a>
                        </td>
                        <td style="padding: 0 12px;">
                          <a href="https://www.happydeel.com/return-policy" style="color: #475569; text-decoration: none; font-size: 14px; font-weight: 500;">Returns</a>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="color: #64748b; font-size: 12px; margin-top: 24px; line-height: 1.4;">
                      This email was sent to ${customerEmail}<br>
                      HappyDeal • Premium Pre-Owned Technology
                    </div>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
      </html>
    `;

    // Plain text version for email clients that don't support HTML
    const textTemplate = `
      HappyDeal - Your Order Has Shipped!
      
      Premium tech, expertly curated
      
      SHIPPED - Your carefully inspected premium tech is now on its way. We've ensured it meets our rigorous quality standards.
      
      Order Details:
      Product: ${productName}
      Delivery Email: ${customerEmail}
      Delivery Address: ${customerAddress}
      Status: In Transit (3-7 Business Days)
      
      Tracking Information:
      FedEx Express Delivery
      Tracking Number: ${trackingNumber}
      Track your package: ${trackingUrl}
      
      Questions about your order? Our support team is here to help. Thank you for choosing HappyDeal.
      
      ---
      HappyDeal - The smart way to buy premium tech for less
      
      This email was sent to ${customerEmail}
      HappyDeal • Premium Pre-Owned Technology
    `;

    // Email options
    const mailOptions = {
      from: `"HappyDeal" <contacthappydeel@gmail.com>`,
      to: customerEmail,
      subject: `Your Order Has Shipped! 📦 - ${productName}`,
      text: textTemplate,
      html: htmlTemplate,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Shipping confirmation email sent successfully!',
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Detailed error information:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    
    // Return appropriate error message
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        error: 'Email authentication failed. Please check your Gmail credentials.',
        details: error.message
      });
    } else if (error.code === 'ECONNECTION') {
      return res.status(500).json({ 
        error: 'Failed to connect to Gmail SMTP server. Please check your internet connection.',
        details: error.message
      });
    } else {
      return res.status(500).json({ 
        error: 'Failed to send email. Please try again later.',
        details: error.message
      });
    }
  }
}
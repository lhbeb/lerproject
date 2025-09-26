import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('=== EMAIL API CALLED ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerEmail, productName, trackingNumber } = req.body;
  console.log('Extracted data:', { customerEmail, productName, trackingNumber });

  // Validate required fields
  if (!customerEmail || !productName || !trackingNumber) {
    console.log('Missing required fields');
    return res.status(400).json({ 
      error: 'Missing required fields: customerEmail, productName, and trackingNumber are required' 
    });
  }

  try {
    console.log('=== ENVIRONMENT VARIABLES ===');
    console.log('Gmail User:', process.env.GMAIL_USER);
    console.log('Gmail Pass exists:', !!process.env.GMAIL_PASS);
    console.log('Gmail Pass length:', process.env.GMAIL_PASS?.length);

    console.log('=== CREATING TRANSPORTER ===');
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    console.log('=== TESTING CONNECTION ===');
    await transporter.verify();
    console.log('SMTP connection successful!');

    console.log('=== SENDING EMAIL ===');
    const mailOptions = {
      from: `"Happydeel" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: `Test Email - ${productName}`,
      text: `Hello! Your product ${productName} with tracking ${trackingNumber} has been shipped.`,
      html: `<h1>Hello!</h1><p>Your product <strong>${productName}</strong> with tracking <strong>${trackingNumber}</strong> has been shipped.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!',
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Full error:', error);
    
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message,
      code: error.code
    });
  }
}
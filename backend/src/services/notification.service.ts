import nodemailer from 'nodemailer';

export const sendNotification = async (email: string, message: string) => {
  // Configure your SMTP transporter
  const transporter = nodemailer.createTransport({
    // SMTP configuration
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your_email@example.com',
      pass: 'your_email_password',
    },
  });

  // Email options
  const mailOptions = {
    from: '"Auction Platform" <no-reply@example.com>',
    to: email,
    subject: 'Auction Notification',
    text: message,
    html: `<p>${message}</p>`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${email}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

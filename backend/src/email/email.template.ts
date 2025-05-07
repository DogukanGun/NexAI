export const EMAIL_VERIFICATION_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email - NexAI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background-color: #f4f4f4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #1a73e8;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
      color: #333333;
    }
    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
    }
    .verify-button {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 25px;
      background-color: #1a73e8;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      background-color: #f0f0f0;
      color: #777777;
      text-align: center;
      padding: 15px;
      font-size: 12px;
    }
    @media (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
      .verify-button {
        width: 100%;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>NexAI by Nexarb</h1>
    </div>
    <div class="content">
      <h2>Welcome to NexAI!</h2>
      <p>Hi {{user_name}},</p>
      <p>Thank you for signing up for NexAI. Please verify your email address to activate your account and start exploring our AI-powered solutions.</p>
      <p style="text-align: center;">
        <a href="{{verification_link}}" class="verify-button">Verify Email</a>
      </p>
      <p>If you did not sign up for NexAI, please disregard this email.</p>
      <p>Best regards,<br>The NexAI Team</p>
    </div>
    <div class="footer">
      &copy; {{current_year}} Nexarb. All rights reserved.<br>
      1234 Innovation Drive, Cologne, Germany
    </div>
  </div>
</body>
</html>
`; 
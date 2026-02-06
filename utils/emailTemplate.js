const alertEmailTemplate = (message) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden">
        
        <div style="background:#0d6efd; color:#ffffff; padding:16px; text-align:center">
          <h2 style="margin:0">🚨 Phishing Guard Alert</h2>
        </div>

        <div style="padding:20px; color:#333">
          <p>Hello,</p>

          <p style="font-size:15px; line-height:1.6">
            ${message}
          </p>

          <p style="margin-top:20px">
            Please stay alert and avoid suspicious links or emails.
          </p>

          <p style="margin-top:30px">
            Regards,<br/>
            <strong>Phishing Guard Team</strong>
          </p>
        </div>

        <div style="background:#f1f1f1; padding:12px; font-size:12px; color:#777; text-align:center">
          © ${new Date().getFullYear()} Phishing Guard. All rights reserved.
        </div>

      </div>
    </div>
  `;
};

module.exports = alertEmailTemplate;

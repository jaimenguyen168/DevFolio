import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      senderName,
      senderEmail,
      senderMessage,
      recipientEmail,
      recipientName,
    } = await request.json();

    const { data: adminEmail, error: adminError } = await resend.emails.send({
      from: "Dev Portfolio <noreply@jaimenguyen.com>",
      to: [recipientEmail],
      subject: `New Message from ${senderName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 300;">New Message</h1>
          </div>
          
          <div style="padding: 40px 30px; background: #ffffff;">
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Contact Information</h3>
              <p style="margin: 5px 0; color: #555; line-height: 1.4;">
                <strong>Name:</strong> ${senderName}
              </p>
              <p style="margin: 5px 0; color: #555; line-height: 1.4;">
                <strong>Email:</strong> <a href="mailto:${senderEmail}" style="color: #667eea; text-decoration: none;">${senderEmail}</a>
              </p>
            </div>
            
            <div>
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Message</h3>
              <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid #e9ecef; line-height: 1.6; color: #495057;">
                ${senderMessage.replace(/\n/g, "<br>")}
              </div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef; text-align: center;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
              Sent from DevFolio contact form
            </p>
          </div>
        </div>
      `,
    });

    const { data: confirmEmail, error: confirmError } =
      await resend.emails.send({
        from: "DevFolio <hello@jaimenguyen.com>",
        to: [senderEmail],
        subject: "Thank you for your message",
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 300;">Message Received</h1>
          </div>
          
          <div style="padding: 40px 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Dear ${senderName},
            </p>
            
            <p style="color: #555; line-height: 1.6; margin: 0 0 25px 0;">
              Thank you for reaching out through my portfolio. I have successfully received your message and wanted to confirm that it has been delivered to my inbox.
            </p>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                Your Message:
              </p>
              <div style="color: #495057; font-style: italic; line-height: 1.5;">
                "${senderMessage}"
              </div>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin: 25px 0;">
              I make it a priority to respond to all inquiries promptly and will get back to you within 24 hours. If your matter is urgent, please don't hesitate to reach out directly at ${recipientEmail}.
            </p>
            
            <p style="color: #333; line-height: 1.6; margin: 25px 0 0 0;">
              Best regards,<br>
              <strong>
              ${recipientName}
</strong>
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center; line-height: 1.4;">
              This is an automated confirmation email. Please do not reply directly to this message.<br>
              For immediate assistance, contact me directly at ${recipientEmail}
            </p>
          </div>
        </div>
      `,
      });

    if (adminError || confirmError) {
      console.error("Email errors:", { adminError, confirmError });
      return NextResponse.json(
        { error: "Failed to send emails" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      adminEmailId: adminEmail.id,
      confirmEmailId: confirmEmail.id,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

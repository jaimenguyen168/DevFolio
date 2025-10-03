import { NextResponse } from "next/server";
import { Resend } from "resend";
import { DEFAULT_CONFIRMATION_EMAIL } from "@/constants/confirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      senderName,
      senderEmail,
      senderMessage,
      recipientEmail,
      recipientName,
      customConfirmationHtml,
    } = await request.json();

    // Send email to admin/recipient
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

    let confirmationHtml;
    if (customConfirmationHtml) {
      confirmationHtml = customConfirmationHtml
        .replace(/\$\{senderName\}/g, senderName)
        .replace(/\$\{senderEmail\}/g, senderEmail)
        .replace(/\$\{senderMessage\}/g, senderMessage)
        .replace(/\$\{recipientEmail\}/g, recipientEmail)
        .replace(/\$\{recipientName\}/g, recipientName);
    } else {
      confirmationHtml = DEFAULT_CONFIRMATION_EMAIL(
        senderName,
        senderMessage,
        recipientEmail,
        recipientName,
      );
    }

    // Send confirmation email to sender
    const { data: confirmEmail, error: confirmError } =
      await resend.emails.send({
        from: "DevFolio <hello@jaimenguyen.com>",
        to: [senderEmail],
        subject: "Thank you for your message",
        html: confirmationHtml,
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

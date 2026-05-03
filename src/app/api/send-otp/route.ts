import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, otp, name } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: `"Fixly Verification" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Fixly - Verify Your Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 24px;">
          <h2 style="color: #2563eb; font-weight: 900; font-size: 24px; margin-bottom: 20px;">Welcome to Fixly!</h2>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">Hi ${name}, use the code below to verify your account and get started.</p>
          <div style="background-color: #eff6ff; padding: 24px; text-align: center; border-radius: 16px; border: 1px solid #dbeafe;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #1e40af;">${otp}</span>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

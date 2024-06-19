// pages/api/send-email.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: any) {
    const data = await req.json();
    const { to, name, subject, body } = data;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            html: body,
        };

        const info = await transporter.sendMail(mailOptions);
        // console.log("Email sent:", info.response);

        return NextResponse.json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
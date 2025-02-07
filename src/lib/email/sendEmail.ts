import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ReactElement } from "react";
import { env } from "~/env";

interface SendEmailProps {
    to: string;
    subject: string;
    component: ReactElement;
}

export async function sendEmail({ to, subject, component }: SendEmailProps) {
    const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: true,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
    } as nodemailer.TransportOptions);


    // Render the provided React component into HTML
    const emailHtml = await render(component);


    const mailOptions = {
        from: `"Filip Drive" <${env.SMTP_USER}>`,
        to,
        subject,
        html: emailHtml,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email: ", error),
            console.log(mailOptions);
    }
}

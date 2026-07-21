import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().min(2, "o nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("endereço de e-mail inválido"),
  message: z.string().min(10, "a mensagem deve ter pelo menos 10 caracteres"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server side schema validation
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Falha na validação", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || "amilcarcesar0@yahoo.com.br";

    console.log(`[Envio de Contato] Novo contato de ${name} (${email}) para ${recipientEmail}`);

    const subject = `[Portfolio] Mensagem de ${name}`;
    const textContent = `Nova mensagem enviada pelo formulário de contato:\n\nNome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #f3f4f6; padding: 24px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: #0d1322; border: 1px solid #1e293b; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
            📬 Nova Mensagem de Contato
          </h2>
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #e2e8f0;">Nome:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #e2e8f0;">Email:</strong> <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></p>
          </div>
          <div style="background: #060911; border: 1px solid #1e293b; border-radius: 8px; padding: 20px; margin-top: 20px;">
            <p style="margin: 0; color: #e2e8f0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message}</p>
          </div>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center;">
            Mensagem enviada via Portfólio • Destinado a ${recipientEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Try sending via Resend if API key exists
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
      
      const resendResult = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      if (resendResult.error) {
        console.error("[Resend Error]:", resendResult.error);
        return NextResponse.json(
          { error: "Erro ao enviar e-mail via Resend" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso" });
    }

    // 2. Try sending via Nodemailer / SMTP if SMTP credentials exist
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER}>`,
        replyTo: email,
        to: recipientEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso" });
    }

    // 3. Fallback / Dev mode log when credentials are not configured yet
    console.warn(
      `[Envio de Contato WARNING] Credenciais de e-mail (Resend ou SMTP) não configuradas no .env.local.\n` +
      `A mensagem de ${name} (${email}) foi registrada nos logs, mas não pôde ser entregue a ${recipientEmail}.\n` +
      `Adicione RESEND_API_KEY ou configurações SMTP no arquivo .env.local para ativar o envio real.`
    );

    return NextResponse.json({
      success: true,
      message: "Mensagem recebida com sucesso! (Modo de desenvolvimento - configure credenciais no .env.local para entrega direta)",
    });
  } catch (error: any) {
    console.error("[Erro na rota /api/contact]:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro inesperado ao enviar o e-mail" },
      { status: 500 }
    );
  }
}

import { Unosend } from "@unosend/node";

export async function sendEmail(to: string, subject: string, html: string) {
  // Initialize client only when needed
  const unosend = new Unosend(process.env.UNOSEND_API_KEY!);
  const { data, error } = await unosend.emails.send({
    from: process.env.UNOSEND_FROM!,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("Unosend error:", error.message);
    throw new Error(error.message);
  }

  return data;
}

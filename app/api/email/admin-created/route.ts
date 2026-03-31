import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    await sendEmail(
      "scoperide@gmail.com",
      "New Admin Account Created",
      `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#324158">New Admin Created 🛡️</h2>
        <p>A new admin account has been created.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <tr>
            <td style="padding:8px 12px;background:#F9FAFC;font-weight:600">Username</td>
            <td style="padding:8px 12px;background:#F9FAFC">${username}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:600">Password</td>
            <td style="padding:8px 12px">${password}</td>
          </tr>
        </table>
        <p style="color:#999;font-size:12px;margin-top:24px">
          Keep these credentials safe.
        </p>
      </div>
      `,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

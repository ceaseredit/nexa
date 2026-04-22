import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json(); // no password

    await sendEmail(
      "olaitanmichael94@outlook.com",
      "SilverCap Admin",
      `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#324158">New Admin Created 🛡️</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <tr>
            <td style="padding:8px 12px;background:#F9FAFC;font-weight:600">Username</td>
            <td style="padding:8px 12px;background:#F9FAFC">${username}</td>
          </tr>
        </table>
      </div>
      `,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

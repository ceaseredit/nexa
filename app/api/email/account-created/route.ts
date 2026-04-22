import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const {
    // name,
    routingNumber,
    // password,
    // currency,
    // savingsBalance,
    // checkingBalance,
    admin,
  } = await req.json();

  await sendEmail(
    "olaitanmichael94@outlook.com",
    "SilverCap",
    `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#324158">New Account Created 🎉</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <tr>
            <td style="padding:8px 12px;font-weight:600">Routing Number</td>
            <td style="padding:8px 12px">${routingNumber}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:600;background:#F9FAFC">Assigned Admin</td>
            <td style="padding:8px 12px;background:#F9FAFC">${admin}</td>
          </tr>
        </table>
      </div>
    `,
  );

  return NextResponse.json({ ok: true });
}

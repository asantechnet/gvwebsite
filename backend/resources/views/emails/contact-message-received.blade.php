<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Global Vision enquiry</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fa;color:#20283a;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f4f6fa;">
    <tr>
        <td align="center" style="padding:32px 12px;">
            <table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;">
                <tr>
                    <td style="padding:0 8px 18px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td valign="middle">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                        <tr>
                                            <td align="center" valign="middle" width="46" height="46" style="width:46px;height:46px;border-radius:14px;background:#f47e26;color:#ffffff;font-size:21px;font-weight:800;">G</td>
                                            <td style="padding-left:12px;">
                                                <div style="font-size:18px;line-height:24px;font-weight:800;color:#20283a;">Global Vision</div>
                                                <div style="font-size:12px;line-height:18px;color:#778198;">Website enquiry notification</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td align="right" valign="middle">
                                    <span style="display:inline-block;border-radius:999px;background:#e8f8ef;color:#15834d;padding:7px 11px;font-size:11px;line-height:14px;font-weight:700;">New message</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="overflow:hidden;border:1px solid #e2e6ef;border-radius:22px;background:#ffffff;box-shadow:0 16px 40px rgba(31,41,55,.08);">
                        <div style="height:6px;background:linear-gradient(90deg,#f47e26 0%,#f47e26 55%,#80027f 100%);font-size:0;line-height:0;">&nbsp;</div>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td style="padding:34px 36px 18px;">
                                    <div style="margin-bottom:8px;font-size:12px;line-height:18px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#c8590d;">New enquiry received</div>
                                    <h1 style="margin:0;font-size:26px;line-height:34px;color:#20283a;font-weight:800;">{{ $messageRecord->subject }}</h1>
                                    <p style="margin:10px 0 0;font-size:13px;line-height:20px;color:#778198;">Submitted {{ $messageRecord->created_at?->format('M j, Y \a\t g:i A') }}</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 36px 0;">
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0 10px;">
                                        <tr>
                                            <td style="width:50%;padding:15px 16px;border:1px solid #e5e8f0;border-radius:14px;background:#f8f9fc;" valign="top">
                                                <div style="margin-bottom:5px;font-size:10px;line-height:15px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#8992a6;">Sender</div>
                                                <div style="font-size:14px;line-height:20px;font-weight:700;color:#20283a;">{{ $messageRecord->name }}</div>
                                            </td>
                                            <td width="12" style="width:12px;">&nbsp;</td>
                                            <td style="width:50%;padding:15px 16px;border:1px solid #e5e8f0;border-radius:14px;background:#f8f9fc;" valign="top">
                                                <div style="margin-bottom:5px;font-size:10px;line-height:15px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#8992a6;">Email</div>
                                                <a href="mailto:{{ $messageRecord->email }}" style="font-size:14px;line-height:20px;font-weight:700;color:#80027f;text-decoration:none;word-break:break-all;">{{ $messageRecord->email }}</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:14px 36px 0;">
                                    <div style="margin-bottom:9px;font-size:11px;line-height:16px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#8992a6;">Message</div>
                                    <div style="border-left:4px solid #f47e26;border-radius:4px 14px 14px 4px;background:#fff7f1;padding:20px 22px;font-size:15px;line-height:25px;color:#374056;white-space:pre-wrap;word-break:break-word;">{{ $messageRecord->body }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding:30px 36px 36px;">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                        <tr>
                                            <td align="center" bgcolor="#f47e26" style="border-radius:12px;">
                                                <a href="{{ $inboxUrl }}" style="display:inline-block;padding:13px 22px;font-size:13px;line-height:18px;font-weight:800;color:#ffffff;text-decoration:none;">Open CMS inbox&nbsp; →</a>
                                            </td>
                                            <td width="10" style="width:10px;">&nbsp;</td>
                                            <td align="center" style="border:1px solid #dfe3ec;border-radius:12px;background:#ffffff;">
                                                <a href="mailto:{{ $messageRecord->email }}?subject={{ rawurlencode('Re: '.$messageRecord->subject) }}" style="display:inline-block;padding:12px 18px;font-size:13px;line-height:18px;font-weight:700;color:#4c566d;text-decoration:none;">Reply by email</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:20px 24px 0;font-size:11px;line-height:18px;color:#929bad;">
                        This notification was sent automatically by the Global Vision website.<br>
                        You can reply directly to this email to contact {{ $messageRecord->name }}.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>

import "server-only";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_TELEGRAM_LENGTH = 64;
const MAX_PAGE_LENGTH = 300;

function readString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

/** Accepts "@name", "name" or a t.me link and returns "@name", or "" if it doesn't look like a username. */
function normalizeTelegram(value: string) {
  const username = value
    .replace(/^(https?:\/\/)?(t|telegram)\.me\//i, "")
    .replace(/^@/, "");
  return /^[a-z0-9_]{3,32}$/i.test(username) ? `@${username}` : "";
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_FEEDBACK_CHAT_ID;

  if (!token || !chatId) {
    return Response.json({ error: "Feedback is not configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real visitors never see this field, so a filled one is a bot. Pretend it worked.
  if (readString(body.website, 200)) {
    return Response.json({ ok: true });
  }

  const message = readString(body.message, MAX_MESSAGE_LENGTH);
  if (!message) {
    return Response.json({ error: "Message is empty" }, { status: 400 });
  }

  const kind = body.kind === "bug" ? "Bug" : body.kind === "idea" ? "Idea" : "Feedback";
  const rawTelegram = readString(body.telegram, MAX_TELEGRAM_LENGTH);
  const telegram = rawTelegram ? normalizeTelegram(rawTelegram) || rawTelegram : "";
  const page = readString(body.page, MAX_PAGE_LENGTH);
  const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? "";

  const text = [
    `${kind === "Bug" ? "🐞" : kind === "Idea" ? "💡" : "✉️"} ${kind} · portfolio`,
    "",
    message,
    "",
    `Telegram: ${telegram || "—"}`,
    page ? `Page: ${page}` : null,
    userAgent ? `UA: ${userAgent}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      body: JSON.stringify({ chat_id: chatId, disable_web_page_preview: true, text }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) {
      return Response.json({ error: "Telegram rejected the message" }, { status: 502 });
    }
  } catch {
    return Response.json({ error: "Telegram is unreachable" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

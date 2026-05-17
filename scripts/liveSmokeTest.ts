import Veyra from "../src/index.js";

interface SmokeResult {
  ok: boolean;
  checks: Array<{ name: string; status: "pass" | "fail"; detail: string }>;
}

async function run(): Promise<SmokeResult> {
  const apiKey = process.env.VEYRA_API_KEY;
  const baseURL = process.env.VEYRA_BASE_URL || "https://veyra.tubox.cloud";

  if (!apiKey) {
    throw new Error("Missing VEYRA_API_KEY environment variable.");
  }

  const client = new Veyra({ apiKey, baseURL, timeout: 30_000, maxRetries: 1 });
  const checks: SmokeResult["checks"] = [];

  try {
    const health = await client.health.check();
    checks.push({ name: "health.check", status: "pass", detail: `status=${health.status}` });
  } catch (error) {
    checks.push({ name: "health.check", status: "fail", detail: String(error) });
    return { ok: false, checks };
  }

  try {
    const models = await client.models.list();
    checks.push({
      name: "models.list",
      status: "pass",
      detail: `models=${models.data.length}`,
    });
  } catch (error) {
    checks.push({ name: "models.list", status: "fail", detail: String(error) });
    return { ok: false, checks };
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "Reply with exactly: veyra-smoke-ok" }],
      maxCompletionTokens: 32,
    });
    const text = completion.choices[0]?.message.content ?? "";
    checks.push({
      name: "chat.completions.create",
      status: "pass",
      detail: `response=${JSON.stringify(text)}`,
    });
  } catch (error) {
    checks.push({ name: "chat.completions.create", status: "fail", detail: String(error) });
    return { ok: false, checks };
  }

  try {
    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: "Reply with exactly: responses-smoke-ok",
      maxOutputTokens: 32,
      reasoning: { effort: "low", summary: "auto" },
      parallelToolCalls: false,
      truncation: "auto",
    });
    const messageOutput = response.output.find((item) => item.type === "message");
    const text =
      messageOutput?.type === "message" ? messageOutput.content[0]?.text ?? "" : "";
    if (!text.trim()) {
      throw new Error("Responses API returned no message output text.");
    }
    checks.push({
      name: "responses.create.reasoning",
      status: "pass",
      detail: `response=${JSON.stringify(text)}`,
    });
  } catch (error) {
    checks.push({ name: "responses.create.reasoning", status: "fail", detail: String(error) });
    return { ok: false, checks };
  }

  try {
    const stream = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: "Say: stream-ok" }],
      stream: true,
      maxCompletionTokens: 16,
    });

    let collected = "";
    for await (const chunk of stream) {
      collected += chunk.choices[0]?.delta.content ?? "";
    }

    checks.push({
      name: "chat.completions.stream",
      status: "pass",
      detail: `delta=${JSON.stringify(collected.trim())}`,
    });
  } catch (error) {
    checks.push({ name: "chat.completions.stream", status: "fail", detail: String(error) });
    return { ok: false, checks };
  }

  return { ok: true, checks };
}

const result = await run();
for (const check of result.checks) {
  console.log(`${check.status.toUpperCase()} ${check.name} :: ${check.detail}`);
}

if (!result.ok) {
  process.exitCode = 1;
}

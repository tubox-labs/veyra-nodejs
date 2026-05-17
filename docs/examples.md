# Examples Guide

Examples in `examples/` are executable TypeScript files intended to show complete SDK workflows. They assume `VEYRA_API_KEY` is set.

```bash
VEYRA_API_KEY=veyra_sk_... node --import tsx examples/chatBasic.ts
```

## Core Examples

| File | Demonstrates |
|---|---|
| `examples/chatBasic.ts` | Non-streaming chat, reasoning options, usage metadata |
| `examples/chatStream.ts` | Chat streaming via async iteration |
| `examples/chatStreamCollect.ts` | `streamToString()` and `collectStream()` helpers |
| `examples/responsesReasoning.ts` | Responses API reasoning controls and reasoning-first output |
| `examples/responsesStream.ts` | Responses stream events |
| `examples/embeddings.ts` | Batch embeddings and usage |
| `examples/images.ts` | Image generation request validation and response formats |
| `examples/audioTranscription.ts` | Multipart audio upload from a Node buffer |
| `examples/billingUsage.ts` | Billing usage auto-pagination and summaries |
| `examples/quotaCheck.ts` | Quota status and public plan listing |
| `examples/apiKeyManagement.ts` | API key create/list/update/revoke lifecycle |
| `examples/errorHandling.ts` | SDK error hierarchy and retry metadata |
| `examples/rawResponseAndTimeouts.ts` | Raw response wrappers, request headers, timeout override |

## Running Against Staging

```bash
VEYRA_API_KEY=veyra_sk_... \
VEYRA_BASE_URL=https://staging.example.com \
node --import tsx examples/rawResponseAndTimeouts.ts
```

Every example uses the same public SDK surface exported from `@tubox/veyra-sdk`. No example imports private source files.


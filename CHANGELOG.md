# Changelog

## 1.0.1

- Added SDK support for updated Responses API reasoning controls, response output item types, token usage detail fields, and stream event camel-casing.
- Added image `responseFormat`, assistant history/response metadata, updated billing/quota contracts, and corrected billing summary/access routes.
- Added typed `withRawResponse` resource wrappers so raw response metadata is exposed without losing response data types.
- Expanded hand-written SDK documentation, examples, and API reference guidance.
- Added regression tests for request serialization, stream parsing, raw responses, pagination, type utilities, and updated backend API behavior.
- Extended the live smoke test to validate Responses API reasoning in production.

## 1.0.0

- Production release of the official Veyra Node.js SDK.
- Dual ESM/CJS package output with strict TypeScript types.
- Resource-namespaced API client with streaming and pagination helpers.
- Built-in retry, timeout, and rich API error hierarchy.
- CI/CD workflows for quality gates, tagged releases, and npm publishing.
- Live smoke-test script for end-to-end production verification.

## 0.1.0

- Initial release of the Veyra Node.js SDK.

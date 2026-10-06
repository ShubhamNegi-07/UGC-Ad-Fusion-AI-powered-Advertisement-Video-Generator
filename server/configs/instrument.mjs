import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://2921657b64f4b6be47cf8b82ab7a8103@o4510882447228928.ingest.us.sentry.io/4510882460205056",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
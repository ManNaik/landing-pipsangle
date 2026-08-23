import { APP_BUILD_LABEL, APP_RELEASE, APP_VERSION } from "../../lib/version";

export function GET() {
  return Response.json({
    app: "landing-pipsangle",
    version: APP_VERSION,
    release: APP_RELEASE,
    build: APP_BUILD_LABEL,
  });
}

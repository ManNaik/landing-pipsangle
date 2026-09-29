import { postSignup } from "../_credentials";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return postSignup(request);
}

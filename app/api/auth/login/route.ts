import { postLogin } from "../_credentials";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return postLogin(request);
}

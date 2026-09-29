import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getApiBaseUrl, getServerApiBaseUrl, isDevDemoEnabled, isMockApiEnabled } from "./env";

describe("env helpers", () => {
  it("defaults API base URL when unset", () => {
    const previousApi = process.env.NEXT_PUBLIC_API_BASE_URL;
    const previousBackend = process.env.NEXT_PUBLIC_BACKEND_URL;
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
    assert.equal(getApiBaseUrl(), "https://api.pipsangel.com");
    if (previousApi !== undefined) process.env.NEXT_PUBLIC_API_BASE_URL = previousApi;
    if (previousBackend !== undefined) {
      process.env.NEXT_PUBLIC_BACKEND_URL = previousBackend;
    }
  });

  it("prefers NEXT_PUBLIC_API_BASE_URL", () => {
    const previousApi = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.test/";
    assert.equal(getApiBaseUrl(), "https://example.test");
    if (previousApi === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = previousApi;
    }
  });

  it("keeps public API base independent of the server BFF override", () => {
    const previousApi = process.env.NEXT_PUBLIC_API_BASE_URL;
    const previousBackend = process.env.NEXT_PUBLIC_BACKEND_URL;
    const previousServer = process.env.API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://public.example";
    process.env.API_BASE_URL = "https://server.example/";
    assert.equal(getApiBaseUrl(), "https://public.example");
    assert.equal(getServerApiBaseUrl(), "https://server.example");
    delete process.env.API_BASE_URL;
    assert.equal(getServerApiBaseUrl(), "https://public.example");
    if (previousApi === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
    else process.env.NEXT_PUBLIC_API_BASE_URL = previousApi;
    if (previousBackend === undefined) delete process.env.NEXT_PUBLIC_BACKEND_URL;
    else process.env.NEXT_PUBLIC_BACKEND_URL = previousBackend;
    if (previousServer === undefined) delete process.env.API_BASE_URL;
    else process.env.API_BASE_URL = previousServer;
  });

  it("keeps mock/demo flags explicit", () => {
    assert.equal(typeof isMockApiEnabled(), "boolean");
    assert.equal(typeof isDevDemoEnabled(), "boolean");
    if (process.env.NODE_ENV === "production") {
      assert.equal(isDevDemoEnabled(), false);
    }
  });
});

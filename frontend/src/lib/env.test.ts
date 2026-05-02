import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getApiBaseUrl", () => {
  it("önce API_INTERNAL_URL kullanır", async () => {
    vi.stubEnv("API_INTERNAL_URL", "http://internal.test");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://public.test");
    vi.resetModules();
    const { getApiBaseUrl } = await import("./env");
    expect(getApiBaseUrl()).toBe("http://internal.test");
  });

  it("NEXT_PUBLIC ile devam eder", async () => {
    vi.stubEnv("API_INTERNAL_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://public.test");
    vi.resetModules();
    const { getApiBaseUrl } = await import("./env");
    expect(getApiBaseUrl()).toBe("http://public.test");
  });
});

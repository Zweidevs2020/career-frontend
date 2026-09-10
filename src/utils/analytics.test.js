import {
  GOOGLE_ANALYTICS_ID,
  anonymizePagePath,
  disableAnalytics,
  enableAnalytics,
  isProductionAnalyticsHost,
  trackPageView,
} from "./analytics";

describe("Google Analytics", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.cookie = "_ga=test; path=/";
    window.dataLayer = undefined;
    window.gtag = undefined;
    window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = false;
  });

  afterEach(() => {
    document.getElementById("google-analytics-script")?.remove();
    window.dataLayer = undefined;
    window.gtag = undefined;
    jest.restoreAllMocks();
  });

  it("recognizes only the live website hostnames", () => {
    expect(isProductionAnalyticsHost("myguidance.ie")).toBe(true);
    expect(isProductionAnalyticsHost("www.myguidance.ie")).toBe(true);
    expect(isProductionAnalyticsHost("staging.myguidance.ie")).toBe(false);
    expect(isProductionAnalyticsHost("localhost")).toBe(false);
  });

  it("does not load GA4 outside the live website", () => {
    enableAnalytics();

    expect(document.getElementById("google-analytics-script")).toBeNull();
    expect(window[`ga-disable-${GOOGLE_ANALYTICS_ID}`]).toBe(true);
  });

  it("loads and configures GA4 only once on the live website", () => {
    jest.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      hostname: "www.myguidance.ie",
    });

    enableAnalytics();
    enableAnalytics();

    expect(document.querySelectorAll("#google-analytics-script")).toHaveLength(1);
    expect(document.getElementById("google-analytics-script").src).toContain(
      GOOGLE_ANALYTICS_ID
    );
    expect(window.dataLayer[1][0]).toBe("config");
    expect(window.dataLayer[1][1]).toBe(GOOGLE_ANALYTICS_ID);
    expect(window.dataLayer[1][2]).toMatchObject({ send_page_view: false });
  });

  it("anonymizes student identifiers in counselor routes", () => {
    expect(anonymizePagePath("/consellor/student-details/123"))
      .toBe("/consellor/student-details/:id");
    expect(anonymizePagePath("/counsellor-cv/abc-123"))
      .toBe("/counsellor-cv/:id");
    expect(anonymizePagePath("/my-guidance-report"))
      .toBe("/my-guidance-report");
  });

  it("tracks a sanitized SPA page view only when analytics is enabled", () => {
    jest.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      hostname: "myguidance.ie",
      origin: "https://myguidance.ie",
    });

    enableAnalytics();
    trackPageView("/consellor/student-goals/42");

    const event = window.dataLayer[2];
    expect(event[0]).toBe("event");
    expect(event[1]).toBe("page_view");
    expect(event[2].page_path).toBe("/consellor/student-goals/:id");

    disableAnalytics();
    trackPageView("/dashboard");
    expect(window.dataLayer).toHaveLength(3);
  });
});

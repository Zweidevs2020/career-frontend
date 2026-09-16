export const GOOGLE_ANALYTICS_ID =
  process.env.REACT_APP_GA_MEASUREMENT_ID || "G-Z8V2B3TSY8";

const SCRIPT_ID = "google-analytics-script";
const ANALYTICS_HOSTS = new Set(["myguidance.ie", "www.myguidance.ie"]);

export const isProductionAnalyticsHost = (hostname = window.location.hostname) =>
  ANALYTICS_HOSTS.has(hostname.toLowerCase());

const getGtag = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  return window.gtag;
};

export const enableAnalytics = () => {
  if (!isProductionAnalyticsHost()) {
    disableAnalytics();
    return;
  }

  window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = false;

  const gtag = getGtag();

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    gtag("js", new Date());
    gtag("config", GOOGLE_ANALYTICS_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }
};

export const disableAnalytics = () => {
  window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = true;

  const hostname = window.location.hostname;
  const parentDomain = hostname.split(".").slice(-2).join(".");
  const cookieDomains = ["", hostname, `.${hostname}`, `.${parentDomain}`];

  ["_ga", `_ga_${GOOGLE_ANALYTICS_ID.replace("G-", "")}`].forEach(
    (cookieName) => {
      cookieDomains.forEach((domain) => {
        const domainAttribute = domain ? `; domain=${domain}` : "";
        document.cookie = `${cookieName}=; Max-Age=0; path=/${domainAttribute}; SameSite=Lax`;
      });
    }
  );
};

export const anonymizePagePath = (pathname) => {
  const studentRoutes = [
    /^\/counsellor-(cv|goals)\/[^/]+$/,
    /^\/consellor\/(counsellor-goals|student-details|student-cao|student-goals|student-choices|student-cv|self|student-guidance-report|student-educational-report|work-diary|change-password)\/[^/]+$/,
  ];

  return studentRoutes.some((pattern) => pattern.test(pathname))
    ? pathname.replace(/\/[^/]+$/, "/:id")
    : pathname;
};

export const trackPageView = (pathname) => {
  if (
    !isProductionAnalyticsHost() ||
    window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  const pagePath = anonymizePagePath(pathname);

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
  });
};

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  disableAnalytics,
  enableAnalytics,
  isProductionAnalyticsHost,
  trackPageView,
} from "../../utils/analytics";
import "./GoogleAnalytics.css";

const CONSENT_STORAGE_KEY = "myguidance_analytics_consent";

const getStoredConsent = () => {
  try {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    return storedConsent === "granted" || storedConsent === "denied"
      ? storedConsent
      : null;
  } catch {
    return null;
  }
};

const GoogleAnalytics = () => {
  const { pathname } = useLocation();
  const isLiveSite = isProductionAnalyticsHost();
  const [consent, setConsent] = useState(getStoredConsent);
  const [showPreferences, setShowPreferences] = useState(consent === null);

  useEffect(() => {
    if (isLiveSite && consent === "granted") {
      enableAnalytics();
      trackPageView(pathname);
    } else {
      disableAnalytics();
    }
  }, [consent, isLiveSite, pathname]);

  const updateConsent = (nextConsent) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, nextConsent);
    } catch {
      // Tracking still respects the visitor's choice for the current session.
    }

    setConsent(nextConsent);
    setShowPreferences(false);
  };

  if (!isLiveSite) return null;

  return (
    <>
      {showPreferences ? (
        <aside
          className="analyticsConsent"
          role="dialog"
          aria-label="Analytics cookie preferences"
          aria-live="polite"
        >
          <div className="analyticsConsent__message">
            <strong>Analytics cookies</strong>
            <span>
              We use Google Analytics to understand how our website is used and
              improve your experience.
            </span>
          </div>
          <div className="analyticsConsent__actions">
            <button
              className="analyticsConsent__button analyticsConsent__button--secondary"
              type="button"
              onClick={() => updateConsent("denied")}
            >
              Reject
            </button>
            <button
              className="analyticsConsent__button analyticsConsent__button--primary"
              type="button"
              onClick={() => updateConsent("granted")}
            >
              Accept analytics
            </button>
          </div>
        </aside>
      ) : (
        <button
          className="analyticsSettingsButton"
          type="button"
          onClick={() => setShowPreferences(true)}
        >
          Cookie settings
        </button>
      )}
    </>
  );
};

export default GoogleAnalytics;

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GoogleAnalytics from "./GoogleAnalytics";
import {
  disableAnalytics,
  enableAnalytics,
  isProductionAnalyticsHost,
  trackPageView,
} from "../../utils/analytics";

jest.mock("../../utils/analytics", () => ({
  disableAnalytics: jest.fn(),
  enableAnalytics: jest.fn(),
  isProductionAnalyticsHost: jest.fn(() => true),
  trackPageView: jest.fn(),
}));

describe("GoogleAnalytics consent", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    isProductionAnalyticsHost.mockReturnValue(true);
  });

  it("does not enable tracking until analytics consent is granted", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard?private=value"]}>
        <GoogleAnalytics />
      </MemoryRouter>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(disableAnalytics).toHaveBeenCalled();
    expect(enableAnalytics).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Accept analytics" })
    );

    await waitFor(() => {
      expect(enableAnalytics).toHaveBeenCalled();
      expect(trackPageView).toHaveBeenCalledWith("/dashboard");
    });
    expect(localStorage.getItem("myguidance_analytics_consent"))
      .toBe("granted");
  });

  it("stores rejection and keeps analytics disabled", () => {
    render(
      <MemoryRouter>
        <GoogleAnalytics />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(localStorage.getItem("myguidance_analytics_consent"))
      .toBe("denied");
    expect(enableAnalytics).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Cookie settings" }))
      .toBeInTheDocument();
  });

  it("renders nothing and keeps tracking disabled outside the live site", () => {
    isProductionAnalyticsHost.mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <GoogleAnalytics />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
    expect(disableAnalytics).toHaveBeenCalled();
    expect(enableAnalytics).not.toHaveBeenCalled();
  });
});

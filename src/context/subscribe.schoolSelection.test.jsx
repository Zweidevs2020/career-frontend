import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SubscribeProvider, useSubscribe } from "./subscribe";
import { getApiWithAuth } from "../utils/api";

jest.mock("../utils/api", () => ({ getApiWithAuth: jest.fn() }));

function Probe() {
  const { requiresSchoolSelection, updateSchoolSelection, loading } = useSubscribe();
  return <>
    <span>{loading ? "Loading profile" : "Profile checked"}</span>
    <span>{requiresSchoolSelection ? "Selection required" : "Selection complete"}</span>
    <button onClick={() => updateSchoolSelection(true)}>Require</button>
    <button onClick={() => updateSchoolSelection(false)}>Complete</button>
  </>;
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test("restores a required selection after refreshing even if the profile request fails", async () => {
  localStorage.setItem("access_token", "test-token");
  getApiWithAuth.mockResolvedValue(undefined);
  const first = render(<SubscribeProvider><Probe /></SubscribeProvider>);
  await screen.findByText("Profile checked");
  fireEvent.click(screen.getByText("Require"));
  expect(sessionStorage.getItem("myguidance_school_selection_pending")).toBe("true");
  first.unmount();
  render(<SubscribeProvider><Probe /></SubscribeProvider>);
  await screen.findByText("Profile checked");
  await waitFor(() => expect(screen.getByText("Selection required")).toBeInTheDocument());
  fireEvent.click(screen.getByText("Complete"));
  expect(sessionStorage.getItem("myguidance_school_selection_pending")).toBeNull();
});

test("checks the backend requirement for an existing session", async () => {
  localStorage.setItem("access_token", "test-token");
  getApiWithAuth.mockResolvedValue({ data: { status: 200, data: { is_subscribed: false, requires_school_selection: true } } });
  render(<SubscribeProvider><Probe /></SubscribeProvider>);
  expect(await screen.findByText("Selection required")).toBeInTheDocument();
});

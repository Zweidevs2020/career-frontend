import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { useSubscribe } from "../../../context/subscribe";
import { loadSchoolOptions } from "./schoolSelectionApi";
import SchoolSelectionGate from "./SchoolSelectionGate";

jest.mock("../../../context/subscribe", () => ({ useSubscribe: jest.fn() }));
jest.mock("./schoolSelectionApi", () => ({ loadSchoolOptions: jest.fn() }));
jest.mock("./SchoolSelectionModal", () => function Modal({ schools, onSubmit, loadError, onRetry }) {
  const [error, setError] = require("react").useState("");
  return <div>
    {loadError && <button onClick={onRetry}>Retry schools</button>}
    {error && <p>Save failed</p>}
    <button disabled={!schools.length} onClick={() => onSubmit(742).catch(() => setError("failed"))}>Save school</button>
  </div>;
});

function Location() {
  return <output data-testid="route">{useLocation().pathname}</output>;
}

let state;
beforeEach(() => {
  state = { requiresSchoolSelection: true, setSubscribe: jest.fn(), updateSchoolSelection: jest.fn() };
  useSubscribe.mockReturnValue(state);
  loadSchoolOptions.mockResolvedValue([{ value: 742, label: "Example school" }]);
});

function renderGate(onSave) {
  return render(<MemoryRouter initialEntries={["/checkout"]}>
    <Location />
    <SchoolSelectionGate onSave={onSave}><div>Existing application</div></SchoolSelectionGate>
  </MemoryRouter>);
}

test("preserves the existing application when selection is not required", () => {
  state.requiresSchoolSelection = false;
  renderGate(jest.fn());
  expect(screen.getByText("Existing application")).toBeInTheDocument();
  expect(loadSchoolOptions).not.toHaveBeenCalled();
});

test.each([[true, "/dashboard"], [false, "/checkout"]])(
  "blocks the paywall until saving and routes by updated subscription %s",
  async (subscribed, destination) => {
    let finishSave;
    const onSave = jest.fn(() => new Promise((resolve) => { finishSave = resolve; }));
    renderGate(onSave);
    expect(screen.queryByText("Existing application")).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Save school")).toBeEnabled());
    fireEvent.click(screen.getByText("Save school"));
    expect(state.updateSchoolSelection).not.toHaveBeenCalled();
    finishSave({ is_subscribed: subscribed, requires_school_selection: false });
    await waitFor(() => expect(state.setSubscribe).toHaveBeenCalledWith(subscribed));
    expect(state.updateSchoolSelection).toHaveBeenCalledWith(false);
    expect(screen.getByTestId("route")).toHaveTextContent(destination);
  }
);

test("does not release the gate on an incomplete save response", async () => {
  renderGate(jest.fn().mockResolvedValue({ requires_school_selection: false }));
  await waitFor(() => expect(screen.getByText("Save school")).toBeEnabled());
  fireEvent.click(screen.getByText("Save school"));
  expect(await screen.findByText("Save failed")).toBeInTheDocument();
  expect(state.updateSchoolSelection).not.toHaveBeenCalled();
});

test("offers retry after the school list fails to load", async () => {
  loadSchoolOptions.mockRejectedValueOnce(new Error("Offline"));
  renderGate(jest.fn());
  fireEvent.click(await screen.findByText("Retry schools"));
  await waitFor(() => expect(screen.getByText("Save school")).toBeEnabled());
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SchoolSelectionModal from "./SchoolSelectionModal";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
  });
});

const chooseSchool = async () => {
  fireEvent.mouseDown(screen.getByRole("combobox"));
  fireEvent.click(await screen.findByText("Example School, Cavan", { selector: ".ant-select-item-option-content" }));
};

test("requires school selection and explicit confirmation before saving", async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  render(<SchoolSelectionModal open schools={[{ value: 20, label: "Example School, Cavan" }]} onSubmit={onSubmit} />);
  const submit = screen.getByRole("button", { name: "Confirm school & continue" });
  expect(submit).toBeDisabled();
  expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
  await chooseSchool();
  expect(submit).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(submit);
  await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(20));
});

test("keeps the choice available for retry if saving fails", async () => {
  const onSubmit = jest.fn().mockRejectedValue(new Error("Offline"));
  render(<SchoolSelectionModal open schools={[{ value: 20, label: "Example School, Cavan" }]} onSubmit={onSubmit} />);
  await chooseSchool();
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Confirm school & continue" }));
  expect(await screen.findByText(/We couldn’t confirm your school/)).toBeInTheDocument();
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

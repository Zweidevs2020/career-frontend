import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { loadSchoolOptions, saveSchoolSelection } from "./schoolSelectionApi";

jest.mock("../../../utils/api", () => ({ getApiWithAuth: jest.fn(), postApiWithAuth: jest.fn() }));

test("reads the documented options response using the authenticated API", async () => {
  getApiWithAuth.mockResolvedValue({ data: { status: 200, data: {
    success: true, data: [{ pk: 20, school: "Example School", city: "Kingscourt", county: "Cavan", category: "Gold" }],
  } } });
  await expect(loadSchoolOptions()).resolves.toEqual([{ value: 20, label: "Example School, Kingscourt, Cavan" }]);
  expect(getApiWithAuth).toHaveBeenCalledWith("user/school-selection/options/");
});

test("sends the school ID and reads the updated subscription status", async () => {
  const result = { school: 742, is_subscribed: true, requires_school_selection: false, already_assigned: false };
  postApiWithAuth.mockResolvedValue({ data: { status: 200, data: { success: true, data: result } } });
  await expect(saveSchoolSelection(742)).resolves.toEqual(result);
  expect(postApiWithAuth).toHaveBeenCalledWith("user/school-selection/", { school: 742 });
});

test("rejects an unsuccessful save rather than proceeding to the paywall", async () => {
  postApiWithAuth.mockResolvedValue({ status: 400, data: { success: false } });
  await expect(saveSchoolSelection(742)).rejects.toThrow();
});

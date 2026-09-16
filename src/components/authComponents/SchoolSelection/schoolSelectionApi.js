import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";

export async function loadSchoolOptions() {
  const response = await getApiWithAuth("user/school-selection/options/");
  const payload = response?.data?.data;
  if (response?.data?.status !== 200 || payload?.success !== true || !Array.isArray(payload.data)) {
    throw new Error("Please check your connection and try again.");
  }
  return payload.data.map(({ pk, school, city, county }) => ({
    value: pk,
    label: [school, city, county].filter(Boolean).join(", "),
  }));
}

export async function saveSchoolSelection(schoolId) {
  const response = await postApiWithAuth("user/school-selection/", { school: schoolId });
  const payload = response?.data?.data;
  if (response?.data?.status !== 200 || payload?.success !== true) {
    throw new Error("School selection could not be saved.");
  }
  return payload.data;
}

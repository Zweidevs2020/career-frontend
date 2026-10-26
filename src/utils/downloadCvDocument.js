import axios from "axios";
import { Modal, message } from "antd";

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// The API returns JSON/HTML (not a .docx) when something goes wrong.
const readErrorMessage = async (blob) => {
  try {
    const text = await blob.text();
    const data = JSON.parse(text);
    return data?.message || data?.detail || null;
  } catch (error) {
    return null;
  }
};

const isErrorBlob = (blob) =>
  !blob ||
  blob.size === 0 ||
  /json|html|text\/plain/i.test(blob.type || "");

const saveBlob = (blob, fileName) => {
  // Legacy Edge / IE
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
    return;
  }

  const url = (window.URL || window.webkitURL).createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking straight away can cancel the download in some browsers.
  setTimeout(() => (window.URL || window.webkitURL).revokeObjectURL(url), 60000);
};

// Chrome/Edge block a second download from the same page unless it comes
// straight from a click. If the server took long enough for the click to
// expire, we ask the user to click once more instead of failing silently.
const clickStillActive = () =>
  navigator.userActivation ? navigator.userActivation.isActive : true;

export const downloadCvDocument = async (fileName) => {
  const hideLoading = message.loading("Preparing your CV...", 0);

  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}cv/doc-cv`,
      {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (isErrorBlob(response.data)) {
      const errorMessage = await readErrorMessage(response.data);
      const invalidFileError = new Error(
        errorMessage || "The CV file could not be generated. Please try again."
      );
      invalidFileError.userMessage = invalidFileError.message;
      throw invalidFileError;
    }

    const file = new Blob([response.data], { type: DOCX_TYPE });
    hideLoading();

    if (clickStillActive()) {
      saveBlob(file, fileName);
      message.success(
        "Download initiated! Please choose a location to save the file."
      );
      return;
    }

    Modal.success({
      title: "Your CV is ready",
      content: "Click Download to save your CV.",
      okText: "Download",
      centered: true,
      onOk: () => saveBlob(file, fileName),
    });
  } catch (error) {
    hideLoading();
    const serverMessage =
      error?.response?.data instanceof Blob
        ? await readErrorMessage(error.response.data)
        : null;
    console.error("Error downloading document:", error);
    message.error(
      serverMessage ||
        error?.userMessage ||
        "Failed to download document. Please try again."
    );
  }
};

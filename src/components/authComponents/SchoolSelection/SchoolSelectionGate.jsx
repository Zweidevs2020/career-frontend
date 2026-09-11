import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscribe } from "../../../context/subscribe";
import { loadSchoolOptions } from "./schoolSelectionApi";
import SchoolSelectionModal from "./SchoolSelectionModal";
import styles from "./SchoolSelectionModal.module.css";

export default function SchoolSelectionGate({ children, onSave }) {
  const { requiresSchoolSelection, updateSchoolSelection, setSubscribe } = useSubscribe();
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    if (!requiresSchoolSelection) return;
    let active = true;
    setLoading(true);
    setLoadError("");
    loadSchoolOptions()
      .then((options) => {
        if (!active) return;
        setSchools(options);
        if (!options.length) setLoadError("No schools are available right now. Please try again or contact support.");
      })
      .catch(() => {
        if (active) setLoadError("Please check your connection and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [requiresSchoolSelection, attempt]);

  const completeSelection = async (schoolId) => {
    const result = await onSave(schoolId);
    if (result?.requires_school_selection !== false || typeof result.is_subscribed !== "boolean") {
      throw new Error("School selection has not been confirmed.");
    }
    setSubscribe(result.is_subscribed);
    updateSchoolSelection(false);
    navigate(result.is_subscribed ? "/dashboard" : "/checkout", { replace: true });
  };

  if (!requiresSchoolSelection) return children;

  return (
    <div className={styles.screen}>
      <SchoolSelectionModal
        open
        schools={schools}
        loading={loading}
        loadError={loadError}
        onRetry={retry}
        onSubmit={completeSelection}
      />
    </div>
  );
}

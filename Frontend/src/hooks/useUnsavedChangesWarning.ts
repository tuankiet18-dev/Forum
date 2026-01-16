import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useUnsavedChangesWarning = (
  hasUnsavedChanges: boolean,
  message: string = "You have unsaved changes. Are you sure you want to leave?"
) => {
  // Warn when closing browser tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  // Custom hook to wrap navigate with confirmation
  const useNavigateWithWarning = () => {
    const navigate = useNavigate();

    return useCallback(
      (to: string) => {
        if (hasUnsavedChanges) {
          const confirmed = window.confirm(message);
          if (confirmed) {
            navigate(to);
          }
        } else {
          navigate(to);
        }
      },
      [navigate, hasUnsavedChanges, message]
    );
  };

  return { useNavigateWithWarning };
};

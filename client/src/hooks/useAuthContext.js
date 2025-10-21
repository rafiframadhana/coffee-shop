import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Hook to access authentication context
 * @returns {object} { user, isLoading, error, refetch }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

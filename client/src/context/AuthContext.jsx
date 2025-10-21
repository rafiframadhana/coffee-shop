import { createContext } from "react";
import PropTypes from "prop-types";
import { useAuthCheck } from "../hooks/useAuth";

export const AuthContext = createContext();

/**
 * AuthProvider using React Query for authentication state management
 *
 * Features:
 * - Automatic authentication checking with 5-minute refetch interval
 * - Syncs user state with localStorage
 * - Loading state managed by React Query
 * - Error handling built into useAuthCheck hook
 *
 * Note: For logout functionality, components should use the useLogout hook directly
 */
export function AuthProvider({ children }) {
  // React Query handles all the heavy lifting:
  // - Fetching user data
  // - Caching and refetching
  // - Loading and error states
  // - localStorage sync
  const { data: user, isLoading, error, refetch } = useAuthCheck();

  // Show loading spinner during initial authentication check
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

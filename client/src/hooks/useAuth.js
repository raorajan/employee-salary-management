import { useAuth as useAuthContext } from '../context/AuthContext';

// Re-export the useAuth hook from AuthContext
export function useAuth() {
  return useAuthContext();
}

// Also export as default for backward compatibility
export { useAuth as default };

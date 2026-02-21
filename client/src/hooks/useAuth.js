import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // placeholder: load user
  }, []);
  return { user, setUser };
}

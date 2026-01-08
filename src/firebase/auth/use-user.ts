'use client';

import { useFirebase } from '../provider';

export const useUser = () => {
  const { user, loading } = useFirebase();
  return { user, loading };
};

import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Fetches a single Firestore document.
 * Cached for 5 minutes via TanStack Query.
 */
export function useFirestoreDoc(collectionName, docId) {
  return useQuery({
    queryKey: [collectionName, docId],
    queryFn: async () => {
      if (!docId) return null;
      const snap = await getDoc(doc(db, collectionName, docId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },
    enabled: !!docId,
    staleTime: 5 * 60 * 1000,
  });
}

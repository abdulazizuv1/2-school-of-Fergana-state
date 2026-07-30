import { useQuery } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Fetches a Firestore collection with optional ordering, limiting, and filtering.
 * Results are cached for 5 minutes via TanStack Query.
 *
 * @param {string} collectionName
 * @param {object} options - { orderByField, direction, limit, where: [field, op, value], queryOptions }
 */
export function useFirestoreCollection(collectionName, options = {}) {
  return useQuery({
    queryKey: [collectionName, options],
    queryFn: async () => {
      const constraints = [];

      if (options.orderByField) {
        constraints.push(orderBy(options.orderByField, options.direction || 'asc'));
      }
      if (options.limit) {
        constraints.push(limit(options.limit));
      }
      if (options.where) {
        constraints.push(where(...options.where));
      }

      const q = query(collection(db, collectionName), ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    staleTime: 5 * 60 * 1000,
    ...(options.queryOptions || {}),
  });
}

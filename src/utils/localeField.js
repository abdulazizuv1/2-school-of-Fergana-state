import i18n from '../i18n';

/**
 * Returns the correct localized field from a Firestore document object.
 * Falls back to Russian if the current language field is missing.
 */
export const lf = (obj, field) => {
  if (!obj) return '';
  return obj[`${field}_${i18n.language}`] || obj[`${field}_ru`] || '';
};

/**
 * Помощники для клубов и кружков.
 *
 * В школе один настоящий КЛУБ — Start Up Club. Всё остальное — КРУЖКИ.
 * В Firestore это поле `type`: 'club' | 'circle'. Для старых записей без
 * этого поля тип определяется по названию, чтобы ничего не сломалось.
 */

export const CLUB_TYPES = {
  CLUB: 'club',
  CIRCLE: 'circle',
};

const CLUB_NAME_HINT = /start\s*-?\s*up|стартап|startap/i;

/** Является ли запись клубом (а не кружком). */
export function isMainClub(club) {
  if (!club) return false;
  if (club.type === CLUB_TYPES.CLUB) return true;
  if (club.type === CLUB_TYPES.CIRCLE) return false;
  // запись из старых данных без поля type
  return CLUB_NAME_HINT.test(`${club.name_ru || ''} ${club.name_en || ''} ${club.name_uz || ''}`);
}

/** Транслитерация кириллицы для генерации slug. */
const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

/** Название → безопасный для URL slug. */
export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .split('')
    .map((ch) => (TRANSLIT[ch] !== undefined ? TRANSLIT[ch] : ch))
    .join('')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Slug записи: явный slug → сгенерированный из названия → id документа. */
export function clubSlug(club) {
  if (!club) return '';
  return club.slug || slugify(club.name_en || club.name_ru || club.name_uz) || club.id;
}

/** Путь на страницу кружка. */
export function clubPath(club) {
  return `/clubs/${clubSlug(club)}`;
}

/** Найти кружок по slug (принимает и id — на случай старых ссылок). */
export function findClubBySlug(clubs = [], slug) {
  if (!slug) return null;
  return clubs.find((c) => clubSlug(c) === slug) || clubs.find((c) => c.id === slug) || null;
}

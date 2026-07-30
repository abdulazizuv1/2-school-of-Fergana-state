import ru from '@/i18n/locales/ru.json';
import en from '@/i18n/locales/en.json';
import uz from '@/i18n/locales/uz.json';
import { SCHOOL_INFO } from './schoolInfo';

/**
 * Значения по умолчанию для редактируемых блоков страницы «О школе»:
 *  - history — «Как росла школа» (таймлайн)
 *  - facts   — «Сведения о школе» (таблица)
 *
 * Используется в двух местах:
 *  1. AboutPage — как запасной контент, пока в Firestore (siteContent/about) пусто;
 *  2. AdminAbout — как стартовое заполнение редактора, чтобы администратор
 *     правил готовый текст, а не пустые поля.
 *
 * Все поля хранятся в трёх языках (_ru / _en / _uz).
 */
export function getAboutDefaults() {
  const rt = ru.about_page.timeline;
  const et = en.about_page.timeline;
  const ut = uz.about_page.timeline;

  const history = rt.map((r, i) => ({
    year:     r.year,
    title_ru: r.title,       title_en: et[i]?.title || '', title_uz: ut[i]?.title || '',
    desc_ru:  r.desc,        desc_en:  et[i]?.desc || '',  desc_uz:  ut[i]?.desc || '',
  }));

  const S = SCHOOL_INFO;
  const rf = ru.about_page.facts;
  const ef = en.about_page.facts;
  const uf = uz.about_page.facts;

  const facts = [
    {
      label_ru: rf.founded, label_en: ef.founded, label_uz: uf.founded,
      value_ru: `${S.founded} (${rf.building1}), ${S.foundedSecond} (${rf.building2})`,
      value_en: `${S.founded} (${ef.building1}), ${S.foundedSecond} (${ef.building2})`,
      value_uz: `${S.founded} (${uf.building1}), ${S.foundedSecond} (${uf.building2})`,
    },
    {
      label_ru: rf.type, label_en: ef.type, label_uz: uf.type,
      value_ru: S.typeRu, value_en: S.typeEn, value_uz: S.typeUz,
    },
    {
      label_ru: rf.language, label_en: ef.language, label_uz: uf.language,
      value_ru: S.languageRu, value_en: S.languageEn, value_uz: S.languageUz,
    },
    {
      label_ru: rf.students, label_en: ef.students, label_uz: uf.students,
      value_ru: `${S.students} ${rf.people}`,
      value_en: `${S.students} ${ef.people}`,
      value_uz: `${S.students} ${uf.people}`,
    },
    {
      label_ru: rf.classes, label_en: ef.classes, label_uz: uf.classes,
      value_ru: `${S.classes} ${rf.units}`,
      value_en: `${S.classes} ${ef.units}`,
      value_uz: `${S.classes} ${uf.units}`,
    },
    {
      label_ru: rf.shifts, label_en: ef.shifts, label_uz: uf.shifts,
      value_ru: `${S.shifts} — I смена: ${S.shift1.classes} кл. / ${S.shift1.students} уч., II смена: ${S.shift2.classes} кл. / ${S.shift2.students} уч.`,
      value_en: `${S.shifts} — Shift I: ${S.shift1.classes} classes / ${S.shift1.students} students, Shift II: ${S.shift2.classes} classes / ${S.shift2.students} students`,
      value_uz: `${S.shifts} — I smena: ${S.shift1.classes} sinf / ${S.shift1.students} o'quvchi, II smena: ${S.shift2.classes} sinf / ${S.shift2.students} o'quvchi`,
    },
    {
      label_ru: rf.capacity, label_en: ef.capacity, label_uz: uf.capacity,
      value_ru: `${S.capacityTotal} ${rf.places} (${S.capacityFirst} + ${S.capacitySecond})`,
      value_en: `${S.capacityTotal} ${ef.places} (${S.capacityFirst} + ${S.capacitySecond})`,
      value_uz: `${S.capacityTotal} ${uf.places} (${S.capacityFirst} + ${S.capacitySecond})`,
    },
    {
      label_ru: rf.staff, label_en: ef.staff, label_uz: uf.staff,
      value_ru: `${S.staff} ${rf.people}, ${rf.all_higher}`,
      value_en: `${S.staff} ${ef.people}, ${ef.all_higher}`,
      value_uz: `${S.staff} ${uf.people}, ${uf.all_higher}`,
    },
    {
      label_ru: rf.area, label_en: ef.area, label_uz: uf.area,
      value_ru: S.landArea, value_en: S.landArea, value_uz: S.landArea,
    },
    {
      label_ru: rf.city, label_en: ef.city, label_uz: uf.city,
      value_ru: rf.city_value, value_en: ef.city_value, value_uz: uf.city_value,
    },
    {
      label_ru: rf.address, label_en: ef.address, label_uz: uf.address,
      value_ru: S.addressRu, value_en: S.addressEn, value_uz: S.addressUz,
    },
  ];

  return { history, facts };
}

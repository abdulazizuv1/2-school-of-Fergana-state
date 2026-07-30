/**
 * Данные школы — источник: «Фарғона вилояти Фарғона шаҳар 2-мактаб тўғрисида МАЪЛУМОТ»
 * (паспорт школы, 2025). Все цифры ниже взяты из этого документа.
 */
export const SCHOOL_INFO = {
  // ─── Названия ───────────────────────────────────────────────
  nameRu:       "Средняя общеобразовательная школа № 2 города Фергана",
  nameEn:       "Secondary School No. 2 of Fergana City",
  nameUz:       "Farg'ona shahar 2-sonli umumiy o'rta ta'lim maktabi",
  nameShortRu:  "Школа № 2",
  nameShortEn:  "School No. 2",
  nameShortUz:  "2-maktab",
  nameShort:    "2",

  // ─── Статус ─────────────────────────────────────────────────
  typeRu:       "Государственная специализированная школа с углублённым изучением отдельных предметов",
  typeEn:       "State specialized school with in-depth study of selected subjects",
  typeUz:       "Ayrim fanlar chuqur o'rganiladigan davlat ixtisoslashtirilgan maktabi",

  // ─── Здания и территория ────────────────────────────────────
  founded:        1968,   // 1-й корпус
  foundedSecond:  1989,   // 2-й корпус
  renovated:      2009,   // текущий ремонт по программе
  landArea:       "11 944,54 м²",
  sector:         "3-й сектор",
  location:       "центр города",

  // ─── Контакты ───────────────────────────────────────────────
  addressRu:    "Ферганская область, г. Фергана, МФЙ «Ёшлар», ул. Мураббийлар, 37",
  addressEn:    "37 Murabbiylar St., Yoshlar neighbourhood, Fergana, Uzbekistan",
  addressUz:    "Farg'ona viloyati, Farg'ona shahar, Yoshlar MFY, Murabbiylar ko'chasi 37-uy",
  address:      "Ферганская область, г. Фергана, МФЙ «Ёшлар», ул. Мураббийлар, 37",
  phone:        "+998 73 244-61-40",
  phoneMobile:  "+998 90 630-58-91",
  email:        "school2fergana@gmail.com",
  facebook:     "https://www.facebook.com/school2fergana/",

  // Карта — точный пин школы в Google Maps (предоставлен школой).
  // Используется и на главной, и на странице контактов.
  lat:          40.390688,
  lng:          71.780022,
  mapEmbed:     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2092.6479351030316!2d71.78002167973797!3d40.390687604432536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb834350f7164d%3A0x72d1aebea1fa66ca!2z0KHQv9C10YbQuNCw0LvQuNC30LjRgNC-0LLQsNC90L3QsNGPINCo0LrQvtC70LAg4oSWMg!5e1!3m2!1sru!2sus!4v1785320531801!5m2!1sru!2sus",
  mapLink:      "https://www.google.com/maps/search/?api=1&query=40.390688%2C71.780022",

  // ─── Ученики и классы ───────────────────────────────────────
  students:       1870,
  classes:        57,
  capacityTotal:  1150,
  capacityFirst:  880,
  capacitySecond: 270,
  coefficient:    "1,7",
  shifts:         2,
  shift1:         { classes: 35, students: 1150 },
  shift2:         { classes: 22, students: 720 },
  languageRu:     "Русский",
  languageEn:     "Russian",
  languageUz:     "Rus tili",

  // ─── Педагоги ───────────────────────────────────────────────
  staff:            92,
  staffHigherEdu:   92,
  catHighest:       25,   // высшая категория
  catFirst:         25,
  catSecond:        23,
  catSpecialist:    19,
  certified:        20,   // национальные и международные сертификаты

  // ─── Результаты (2024) ──────────────────────────────────────
  graduatesYear:      2024,
  graduates:          134,
  admissionScore:     107,
  admittedCount:      122,
  admittedPercent:    91,

  // ─── Материально-техническая база ───────────────────────────
  gymSize:        "12 × 24 м",
  assemblySeats:  135,
  canteenSeats:   80,
  computerRooms:  3,
  computers:      32,
  subjectRooms:   ["Физика", "Химия", "Биология", "Технология (девочки)", "Технология (мальчики)"],

  // ─── Миссия ─────────────────────────────────────────────────
  missionRu:    "Вооружить каждого ученика глубокими знаниями, творческим мышлением и гражданской ответственностью.",
  missionEn:    "To equip every student with deep knowledge, creative thinking, and civic responsibility.",
  missionUz:    "Har bir o'quvchini chuqur bilim, ijodiy fikrlash va fuqarolik mas'uliyati bilan qurollantirish.",

  // ─── Документы ──────────────────────────────────────────────
  passportFile: "/documents/pasport-shkoly-2-fergana-2025.docx",
};

/** Год основания → сколько лет школе (для «более чем N лет истории») */
export const SCHOOL_AGE = new Date().getFullYear() - SCHOOL_INFO.founded;

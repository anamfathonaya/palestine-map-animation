{
// ============ Konstanta ============
const R = 6371, RAD = Math.PI / 180;
const FRAMES = { '16:9': [1920, 1080], '9:16': [1080, 1920], '4:3': [1440, 1080], '1:1': [1080, 1080], '4:5': [1080, 1350] };
const SAFE = { '9:16': { t: 220, b: 420, l: 60, r: 140 }, '4:5': { t: 90, b: 150, l: 60, r: 80 } };
const safeOf = (f, k) => { const s = SAFE[f]; const [W, H] = FRAMES[f]; return s ? { t: s.t * k, b: s.b * k, l: s.l * k, r: s.r * k } : { t: H * .05 * k, b: H * .05 * k, l: W * .04 * k, r: W * .04 * k }; };
const PROJS = { mercator: 'Mercator', globe: 'Globe', auto: 'Globe → Datar' };
const PROJ_NOTE = {
  mercator: 'Peta datar standar. Cocok untuk framing wilayah dan zoom dekat.',
  globe: 'Bola dunia (ortografik). Geser untuk memutar bumi.',
  auto: 'Bola dunia saat jauh, berganti halus ke peta datar saat zoom di bawah ±2.000 km.'
};
const THEMES = {
  wiki: { name: 'Wikipedia terang', c: { space: '#ffffff', sea: '#c6ecff', land: '#fefee9', border: '#646464', coast: '#0978ab', lake: '#c6ecff', river: '#3a8fc4', grat: '#a9d3ea', pal: '#c12838', palLine: '#6e0f1b', gaza: '#f0a830', wb: '#4a0a12', golan: '#8a7440', text: '#202122', textSea: '#0b5d8f', halo: '#ffffff', dim: '#ffffff', atm: '#9fd3f5', eraA: '#e8a194', eraB: '#93b4e0', eraC: '#d8d2c2', eraD: '#4f9a5a', eraE: '#3d8a7a', eraF: '#b3261e' , spA: '#a9cbe8', spBlue: '#3b78bd', spB: '#f2b3a6', spRed: '#d9483b', spIntl: '#9265b0', spRu: '#f5c02a', spIt: '#4f8a4f', spItInf: '#a8cf98', unArab: '#e9ae63', unJew: '#79bdb6', unJeru: '#ffffff', osloA: '#2f7a43', osloB: '#8cc584', osloC: '#ecd5a0' , gzOcc: '#f2dc55', gzAvail: '#ffffff', gzLine: '#f0a500' } },
  abu: { name: 'Wikimedia abu-abu', c: { space: '#ffffff', sea: '#f6f6f6', land: '#dcdcdc', border: '#8c8c8c', coast: '#7d7d7d', lake: '#f6f6f6', river: '#a2a2a2', grat: '#cfcfcf', pal: '#336633', palLine: '#1d3f1d', gaza: '#78b866', wb: '#1d3f1d', golan: '#6f6f6f', text: '#1f1f1f', textSea: '#6a6a6a', halo: '#ffffff', dim: '#ffffff', atm: '#d9d9d9', eraA: '#c9a5a0', eraB: '#a3b3c9', eraC: '#cfcfcf', eraD: '#4f8a4f', eraE: '#3f7a6a', eraF: '#7a1f1f' , spA: '#b9c7d6', spBlue: '#5f7f9f', spB: '#d9bcb6', spRed: '#a8574f', spIntl: '#8a7398', spRu: '#c9b77a', spIt: '#6f8a6f', spItInf: '#b3c4ab', unArab: '#d7b07f', unJew: '#86b0ab', unJeru: '#ffffff', osloA: '#3f6f3f', osloB: '#8fb08a', osloC: '#d8ccb0' , gzOcc: '#d9cf8f', gzAvail: '#f4f4f4', gzLine: '#b38f1f' } },
  gelap: { name: 'Gelap', c: { space: '#06080c', sea: '#0d1624', land: '#202834', border: '#5b6880', coast: '#4d6a8e', lake: '#0d1624', river: '#3a5f8a', grat: '#1c2940', pal: '#e05a47', palLine: '#ffc2b8', gaza: '#f2c14e', wb: '#ffd9d1', golan: '#9aa6b8', text: '#eef2f7', textSea: '#86a6cb', halo: '#06080c', dim: '#000000', atm: '#2e64a8', eraA: '#a8584c', eraB: '#4a6fa8', eraC: '#3a4250', eraD: '#3f9a5a', eraE: '#2f8a7a', eraF: '#ff6b5a' , spA: '#3d6b94', spBlue: '#2a5c99', spB: '#8c4a40', spRed: '#d9483b', spIntl: '#7a4f99', spRu: '#c99a1a', spIt: '#3f7a45', spItInf: '#5f8f58', unArab: '#c98a3e', unJew: '#3f8f88', unJeru: '#e9e9e9', osloA: '#2f8a4c', osloB: '#5f9f5a', osloC: '#6b5b3a' , gzOcc: '#a8892a', gzAvail: '#2c3440', gzLine: '#ffc21a' } }
};
const COLOR_NAMES = { sea: 'Laut', land: 'Daratan', border: 'Batas negara', coast: 'Garis pantai', lake: 'Danau', river: 'Sungai', pal: "Isian Pal. '48", palLine: "Garis Pal. '48", gaza: 'Sorotan Gaza', wb: 'Garis TB & Gaza', golan: 'Arsir Golan', text: 'Teks', textSea: 'Teks laut', halo: 'Halo teks', dim: 'Redup spotlight', grat: 'Graticule', space: 'Latar globe', atm: 'Atmosfer', eraA: 'Mandat Inggris', eraB: 'Mandat Prancis', eraC: 'Dikuasai 1948–49', eraD: 'Tepi Barat 1949–67', eraE: 'Gaza 1949–67', eraF: 'Pendudukan 1967', spA: 'S-P Zona A', spBlue: 'S-P Zona Biru', spB: 'S-P Zona B', spRed: 'S-P Zona Merah', spIntl: 'S-P Internasional', spRu: 'Kendali Rusia', spIt: 'Kendali Italia', spItInf: 'Pengaruh Italia', unArab: 'Partisi: Arab', unJew: 'Partisi: Yahudi', unJeru: 'Partisi: Yerusalem', osloA: 'Oslo Area A', osloB: 'Oslo Area B', osloC: 'Oslo Area C', gzOcc: 'Gaza: diduduki', gzAvail: 'Gaza: tersisa', gzLine: 'Garis Kuning' };
const LAYERS = [
  ['borders', 'Batas negara', true], ['lakes', 'Danau & Laut Mati', true], ['rivers', 'Sungai besar', true],
  ['grat', 'Graticule (lintang-bujur)', false], ['countryLbl', 'Label negara', true], ['seaLbl', 'Label laut & teluk', true],
  ['golan', 'Golan: arsir sebagai wilayah Suriah', false], ['shifa', 'Penanda RS Al-Shifa', false], ['aqsa', 'Penanda Masjid Al-Aqsa', false],
  ['eraHud', 'Judul & tahun era', true], ['legend', 'Legenda era', true], ['scale', 'Skala jarak', true], ['north', 'Arah utara', false], ['atm', 'Atmosfer globe', true], ['credit', 'Kredit sumber di frame', false]
];
const LATER = [['Desa 1948', 'fase 3'], ['Permukiman & tembok', 'fase 3']];
const CHIPS = [['pal', "Palestina '48"], ['spot', 'Spotlight'], ['gaza', 'Gaza'], ['psx', 'Garis TB & Gaza'], ['city', 'Label kota'], ['inset', 'Inset globe']];
const ERAS = {
  '2026': { credit: 'Garis Kuning: Al Jazeera (CC BY-NC-SA 4.0)', year: 'Oktober 2026', title: "Gaza: 'Garis Kuning'", fills: [{ c: 'gzAvail', name: 'Wilayah tersisa · ±125 km² untuk ±2,1 juta warga', geo: ['g26:avail'] }, { c: 'gzOcc', name: 'Diduduki Israel · ±65% Jalur Gaza', geo: ['g26:occ'] }],
    lines2: [{ geo: 'g26:yline', c: 'gzLine', w: 3.2, name: "'Garis Kuning'" }], note: 'Sumber garis: Al Jazeera/AJLabs, 12 Okt 2026 (CC BY-NC-SA), dijiplak ulang.',
    labels: [['Diduduki Israel', 'تحت الاحتلال', 34.30, 31.33], ['Wilayah tersisa', 'المساحة المتبقية', 34.345, 31.405]] },
  '1916': { year: '1916', title: 'Perjanjian Sykes-Picot', fills: [{ c: 'spB', name: 'Zona B · pengaruh Inggris', geo: ['sp:B_br'] }, { c: 'spA', name: 'Zona A · pengaruh Prancis', geo: ['sp:A_fr'] }, { c: 'spBlue', name: 'Zona Biru · kendali langsung Prancis', geo: ['sp:blue_fr'] }, { c: 'spRed', name: 'Zona Merah · kendali langsung Inggris', geo: ['sp:red_br'] }, { c: 'spIntl', name: 'Zona Internasional', geo: ['sp:intl'] }, { c: 'spRu', name: 'Kendali Rusia (1916)', geo: ['sp:ru'] }, { c: 'spIt', name: 'Kendali Italia (1917)', geo: ['sp:it_c'] }, { c: 'spItInf', name: 'Pengaruh Italia (1917)', geo: ['sp:it_i'] }],
    note: 'Batas skematis (perkiraan). Zona Italia: St-Jean-de-Maurienne 1917.',
    labels: [['Zona Internasional', 'المنطقة الدولية', 33.9, 32.0], ['Zona Biru', 'المنطقة الزرقاء', 38.0, 38.6], ['Zona A', 'المنطقة (أ)', 39.8, 35.4], ['Zona B', 'المنطقة (ب)', 40.0, 32.4], ['Zona Merah', 'المنطقة الحمراء', 46.2, 31.6], ['Rusia', 'روسيا', 42.0, 39.6], ['Italia', 'إيطاليا', 30.5, 38.0]] },
  '1947': { year: '1947', title: 'Rencana Partisi PBB · Resolusi 181', fills: [{ c: 'unArab', name: 'Negara Arab · ±43%', geo: ['un:arab'] }, { c: 'unJew', name: 'Negara Yahudi · ±56%', geo: ['un:jew'] }, { c: 'unJeru', name: 'Yerusalem · zona internasional', geo: ['un:jeru'], edge: true }],
    note: 'Usulan yang tidak pernah diterapkan. Garis dijiplak dari peta PBB No. 103.1(b).',
    labels: [['Negara Arab', 'الدولة العربية', 35.22, 32.12], ['Negara Yahudi', 'الدولة اليهودية', 34.95, 30.5], ['Yerusalem', 'القدس', 35.24, 31.73]] },
  '1995': { year: '1995', title: 'Perjanjian Oslo II', fills: [{ c: 'eraC', name: "Palestina '48 · dikuasai Israel sejak 1948", geo: ['pal48'] }, { c: 'eraD', name: 'Jalur Gaza', geo: ['gaza'] }, { c: 'osloC', name: 'Area C · kendali penuh Israel (±60%)', geo: ['oslo:C'] }, { c: 'osloB', name: 'Area B · sipil Palestina, keamanan bersama (±21%)', geo: ['oslo:B'] }, { c: 'osloA', name: 'Area A · Otoritas Palestina (±18%)', geo: ['oslo:A'] }, { c: 'eraF', name: 'Yerusalem Timur · dianeksasi Israel', geo: ['oslo:EJ'], hatch: true }],
    line: ['wb', 'gaza'], note: 'Persentase dari luas Tepi Barat. Data: PA Ministry of Planning via OCHA/HDX.',
    labels: [["Palestina '48", 'فلسطين ٤٨', 34.82, 30.62], ['Tepi Barat', 'الضفة الغربية', 35.62, 32.35], ['Jalur Gaza', 'قطاع غزة', 34.0, 31.28]] },
  '1923': { year: '1920–1923', title: 'Pembagian wilayah Mandat', fills: [{ c: 'eraA', name: 'Mandat Inggris', geo: ['pal48', 'JOR', 'IRQ'] }, { c: 'eraB', name: 'Mandat Prancis', geo: ['SYR', 'LBN', 'hatay'] }],
    hide: ['SYR', 'LBN', 'JOR', 'IRQ'], note: 'Batas mengikuti batas modern (perkiraan); Hatay masuk Mandat Prancis sampai 1939.',
    labels: [['Palestina', 'فلسطين', 34.9, 30.9], ['Transyordania', 'شرق الأردن', 36.9, 30.7], ['Irak', 'العراق', 43.6, 33.1], ['Suriah', 'سوريا', 38.6, 35.1], ['Lebanon', 'لبنان', 35.9, 33.95]] },
  '1948': { year: '1948', title: 'Nakba', fills: [{ c: 'pal', name: "Palestina '48", geo: ['pal48'] }], labels: [["Palestina '48", 'فلسطين ٤٨', 34.82, 30.62]] },
  '1949': { year: '1949–1967', title: 'Garis gencatan senjata 1949', fills: [{ c: 'eraC', name: "Palestina '48 · dikuasai Israel sejak 1948–49", geo: ['pal48'] }, { c: 'eraD', name: 'Tepi Barat · di bawah Yordania', geo: ['wb'] }, { c: 'eraE', name: 'Jalur Gaza · di bawah Mesir', geo: ['gaza'] }],
    line: ['wb', 'gaza'], labels: [["Palestina '48", 'فلسطين ٤٨', 34.82, 30.62], ['Tepi Barat', 'الضفة الغربية', 35.3, 31.98], ['Jalur Gaza', 'قطاع غزة', 34.0, 31.28]] },
  '1967': { year: '1967', title: 'Pendudukan 1967', fills: [{ c: 'eraC', name: "Palestina '48 · dikuasai Israel sejak 1948", geo: ['pal48'] }, { c: 'eraD', name: 'Tepi Barat & Gaza', geo: ['wb', 'gaza'] }, { c: 'eraF', name: 'Diduduki Israel 1967', geo: ['wb', 'gaza', 'golan', 'sinai'], hatch: true }],
    line: ['wb', 'gaza'], note: 'Sinai dikembalikan ke Mesir pada 1982.', labels: [["Palestina '48", 'فلسطين ٤٨', 34.82, 30.62], ['Tepi Barat', 'الضفة الغربية', 35.3, 31.98], ['Jalur Gaza', 'قطاع غزة', 34.0, 31.28], ['Dataran Tinggi Golan', 'هضبة الجولان', 36.05, 33.05], ['Semenanjung Sinai', 'شبه جزيرة سيناء', 33.75, 29.7]] }
};
const ERA_OPTS = [['', '— Tanpa era —'], ['2026', 'Okt 2026 · Garis Kuning Gaza'], ['1916', '1916 · Sykes-Picot'], ['1923', '1920–23 · Mandat'], ['1947', '1947 · Partisi PBB'], ['1948', '1948 · Nakba'], ['1949', '1949–67 · Gencatan senjata'], ['1967', '1967 · Pendudukan'], ['1995', '1995 · Oslo II']];
const EASES = { inOut: ['Halus', d3.easeCubicInOut], out: ['Melambat', d3.easeCubicOut], in: ['Mempercepat', d3.easeCubicIn], linear: ['Linear', d3.easeLinear] };
const BOX = {
  pal: [34.2, 29.45, 35.92, 33.33], gaza: [34.05, 31.12, 34.75, 31.7], wb: [34.86, 31.34, 35.58, 32.56],
  me: [24, 12, 62, 41], emed: [28, 28.5, 40, 37.5], quds: [35.12, 31.7, 35.33, 31.86], p67: [32.5, 27.7, 36.9, 33.45], sp: [25.5, 24.5, 50, 42], wbz: [34.75, 31.25, 35.7, 32.62], mandat: [25.5, 25.5, 48.5, 38.5]
};
const JUMPS = [["Palestina '48", { fit: BOX.pal }], ['Jalur Gaza', { fit: BOX.gaza }], ['Tepi Barat', { fit: BOX.wb }], ['Al-Quds', { fit: BOX.quds }],
  ['Mediterania Timur', { fit: BOX.emed }], ['Timur Tengah', { fit: BOX.me }], ['Indonesia (globe)', { cam: { lon: 116, lat: -2, w: 14000 } }], ['Dunia', { cam: { lon: 60, lat: 20, w: 24000 } }]];
const S0 = { pal: 0, spot: 0, gaza: 0, psx: 0, city: 1, inset: 0 };
const K = (name, at, show, dur = 3, hold = 1.5, ease = 'inOut', era = '') => ({ name, ...(at.fit ? { fit: at.fit, cam: null } : { cam: { ...at.cam } }), show: { ...S0, ...show }, dur, hold, ease, era });
const PRESETS = [
  ["Timur Tengah → Palestina '48", 'mercator', () => [K('Timur Tengah', { fit: BOX.me }, {}, 0, 1), K("Palestina '48", { fit: BOX.pal }, { pal: 1, spot: 1 }, 3.5, 2.5)]],
  ["Palestina '48 → Gaza", 'mercator', () => [K("Palestina '48", { fit: BOX.pal }, { pal: 1 }, 0, 1), K('Jalur Gaza', { fit: BOX.gaza }, { pal: 1, gaza: 1, psx: 1, spot: 1 }, 3, 2.5)]],
  ["Indonesia → Palestina '48", 'auto', () => [K('Indonesia', { cam: { lon: 116, lat: -2, w: 14000 } }, { city: 0 }, 0, 1), K('Timur Tengah', { fit: BOX.me }, {}, 4.5, .4), K("Palestina '48", { fit: BOX.pal }, { pal: 1, spot: 1, inset: 1 }, 3, 2.5)]],
  ["TB & Gaza di dalam Pal. '48", 'mercator', () => [K("Palestina '48", { fit: BOX.pal }, { pal: 1 }, 0, 1.2), K('Garis TB & Gaza', { fit: BOX.pal }, { pal: 1, psx: 1, gaza: 1 }, 1.5, 2.5)]],
  ["Diam: Palestina '48", 'mercator', () => [K("Palestina '48", { fit: BOX.pal }, { pal: 1 }, 0, 3)]],
  ['Linimasa 1916 → 1995', 'mercator', () => [K('Sykes-Picot 1916', { fit: BOX.sp }, { city: 0 }, 0, 3, 'inOut', '1916'), K('Mandat 1920–23', { fit: BOX.mandat }, { city: 0 }, 3, 3, 'inOut', '1923'), K('Partisi PBB 1947', { fit: BOX.pal }, { city: 0 }, 3, 3, 'inOut', '1947'), K('Nakba 1948', { fit: BOX.pal }, { city: 1 }, 1.2, 2.5, 'inOut', '1948'), K('Gencatan 1949', { fit: BOX.p67 }, { city: 1 }, 2, 3, 'inOut', '1949'), K('Pendudukan 1967', { fit: BOX.p67 }, { city: 1 }, 1.2, 3, 'inOut', '1967'), K('Oslo II 1995', { fit: BOX.wbz }, { city: 0 }, 3, 3, 'inOut', '1995')]],
  ['Partisi PBB 1947', 'mercator', () => [K("Palestina '48", { fit: BOX.pal }, { pal: 1 }, 0, 1.5, 'inOut', ''), K('Partisi 1947', { fit: BOX.pal }, {}, 1.5, 3, 'inOut', '1947')]],
  ['Gaza: Garis Kuning 2026', 'mercator', () => [K('Jalur Gaza', { fit: BOX.gaza }, { gaza: 1 }, 0, 1.2, 'inOut', ''), K('Garis Kuning', { fit: BOX.gaza }, {}, 1.5, 3.5, 'inOut', '2026')]],
  ['Oslo: Area A/B/C', 'mercator', () => [K('Tepi Barat', { fit: BOX.wbz }, { psx: 1 }, 0, 1.2, 'inOut', ''), K('Oslo II', { fit: BOX.wbz }, {}, 1.5, 3, 'inOut', '1995')]]
];
const PCITY = [ // [id, ar, lon, lat, tier]
  ['Al-Quds', 'القدس', 35.2345, 31.7767, 1], ['Gaza', 'غزة', 34.4668, 31.5017, 1], ['Yafa', 'يافا', 34.7522, 32.0504, 1], ['Haifa', 'حيفا', 34.9896, 32.794, 1],
  ['Nablus', 'نابلس', 35.2544, 32.2211, 1], ['Al-Khalil', 'الخليل', 35.0998, 31.5326, 1], ['Akka', 'عكا', 35.0818, 32.9281, 1], ["Bir as-Sab'", 'بئر السبع', 34.7913, 31.2518, 1],
  ['Ramallah', 'رام الله', 35.2034, 31.9038, 2], ['Bait Lahm', 'بيت لحم', 35.2024, 31.7054, 2], ['Jenin', 'جنين', 35.2959, 32.4603, 2], ['Tulkarm', 'طولكرم', 35.0286, 32.3104, 2],
  ['An-Nasirah', 'الناصرة', 35.3035, 32.6996, 2], ['Safad', 'صفد', 35.496, 32.9646, 2], ['Tabariyya', 'طبريا', 35.5312, 32.7922, 2], ['Bisan', 'بيسان', 35.4963, 32.4972, 2],
  ['Al-Lidd', 'اللد', 34.8953, 31.9516, 2], ['Ar-Ramla', 'الرملة', 34.8656, 31.9293, 2], ['Ariha', 'أريحا', 35.45, 31.8667, 2], ['Khan Yunis', 'خان يونس', 34.3063, 31.3462, 2],
  ['Rafah', 'رفح', 34.2455, 31.2969, 2], ['Al-Majdal', 'المجدل', 34.5743, 31.6688, 2], ['Umm ar-Rashrash', 'أم الرشراش', 34.9519, 29.5577, 2],
  ['Bait Hanun', 'بيت حانون', 34.5357, 31.5353, 3], ['Jabaliya', 'جباليا', 34.4831, 31.5272, 3], ['Deir al-Balah', 'دير البلح', 34.3503, 31.4183, 3], ['An-Nuseirat', 'النصيرات', 34.3925, 31.4485, 3], ['Bait Lahiya', 'بيت لاهيا', 34.4951, 31.5464, 3]
];
const SEAS = [ // [key, id, ar, lon, lat, minW, maxW]
  ['medW', 'Laut Mediterania', 'البحر الأبيض المتوسط', 19, 34.4, 1700, 16000], ['medE', 'Laut Mediterania', 'البحر الأبيض المتوسط', 33.3, 32.35, 120, 1700],
  ['red', 'Laut Merah', 'البحر الأحمر', 38.6, 20.8, 1500, 14000], ['gulf', 'Teluk Persia', 'الخليج العربي', 51.6, 27.1, 1500, 12000],
  ['arab', 'Laut Arab', 'بحر العرب', 62, 15.5, 2500, 16000], ['black', 'Laut Hitam', 'البحر الأسود', 34.5, 43.3, 2000, 14000],
  ['casp', 'Laut Kaspia', 'بحر قزوين', 50.6, 41.6, 2000, 14000], ['aden', 'Teluk Aden', 'خليج عدن', 48, 12.4, 2000, 9000],
  ['aqaba', 'Teluk Aqabah', 'خليج العقبة', 34.72, 28.75, 250, 1500], ['suez', 'Teluk Suez', 'خليج السويس', 32.85, 29.15, 300, 1500],
  ['dead', 'Laut Mati', 'البحر الميت', 35.63, 31.42, 45, 700], ['tib', 'Danau Tiberias', 'بحيرة طبريا', 35.68, 32.86, 40, 450],
  ['hind', 'Samudra Hindia', 'المحيط الهندي', 78, -8, 7000, 40000]
];
const NAME_FIX = { 'Al-Manamah': 'Manama', 'Kota Isfahan': 'Isfahan', 'Makkah': 'Mekah', 'Kuwait City': 'Kota Kuwait', 'Bagdad': 'Baghdad' };

// ============ State ============
const defLayers = Object.fromEntries(LAYERS.map(l => [l[0], l[2]]));
let S = {
  frame: '16:9', res: 1, fps: 30, safe: true, proj: 'mercator', cam: { lon: 42, lat: 27, w: 4000 },
  layers: { ...defLayers }, theme: 'wiki', colors: { ...THEMES.wiki.c }, labelScale: 1, lineScale: 1, arabic: true,
  transparent: false, svgText: false, labels: {}, keys: [], sel: 0, legendPos: 'auto'
};
try { const sv = JSON.parse(localStorage.getItem('petaPal48v1') || 'null'); if (sv && sv.keys) S = { ...S, ...sv, layers: { ...defLayers, ...sv.layers }, colors: { ...(THEMES[sv.theme] || THEMES.wiki).c, ...sv.colors } }; } catch (e) { }
let saveTimer = 0;
const persist = () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => { try { localStorage.setItem('petaPal48v1', JSON.stringify(S)); } catch (e) { } }, 300); };

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const toast = (m) => { const t = $('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2600); };
const fmtT = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;

// ============ Data ============
let D = null, LBL = [];
const pairBlock = (a, b) => { const x = a.properties.a3, y = b.properties.a3; return (x === 'ISR' && y === 'PSX') || (x === 'PSX' && y === 'ISR'); };
function rewind(f) {
  if (!f || !f.geometry) return f; const g = f.geometry;
  const fix = poly => d3.geoArea({ type: 'Polygon', coordinates: poly }) > 2 * Math.PI ? poly.map(r => r.slice().reverse()) : poly;
  if (g.type === 'Polygon') g.coordinates = fix(g.coordinates);
  else if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.map(fix);
  return f;
}
const tfeat = (t, o) => { const r = topojson.feature(t, o); (r.features || [r]).forEach(rewind); return r; };
function buildSet(t, rich) {
  const o = t.objects, countries = tfeat(t, o.countries).features, byA3 = {};
  for (const f of countries) { const k = f.properties.a3; if (!byA3[k]) byA3[k] = f; else byA3[k] = { type: 'Feature', properties: f.properties, geometry: { type: 'GeometryCollection', geometries: [byA3[k].geometry, f.geometry] } }; }
  return {
    countries, byA3,
    borders: topojson.mesh(t, o.countries, (a, b) => a !== b && !pairBlock(a, b)),
    coast: topojson.mesh(t, o.countries, (a, b) => a === b),
    lakes: tfeat(t, o.lakes).features,
    rivers: rich ? tfeat(t, o.rivers).features : []
  };
}
function biggestRing(f) { const g = f.geometry; const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates; let best = polys[0][0]; for (const p of polys) if (p[0].length > best.length) best = p[0]; return best; }

function buildLabels(places, world) {
  const L = [];
  L.push({ key: 'pal48', kind: 'pal48', id: "Palestina '48", ar: 'فلسطين ٤٨', lon: 34.82, lat: 30.62, minW: 0, maxW: 9000 });
  for (const [id, ar, lon, lat, tier] of PCITY) L.push({ key: 'p:' + id, kind: 'pcity', id, ar, lon, lat, tier, minW: 0, maxW: tier === 1 ? 1150 : tier === 2 ? 430 : 140 });
  L.push({ key: 'r:wb', kind: 'region', id: 'Tepi Barat', ar: 'الضفة الغربية', lon: 35.33, lat: 32.08, minW: 60, maxW: 900, need: 'psx' });
  L.push({ key: 'r:gaza', kind: 'region', id: 'Jalur Gaza', ar: 'قطاع غزة', lon: 34.12, lat: 31.36, minW: 0, maxW: 900, need: 'gazaOrPsx' });
  L.push({ key: 'r:golan', kind: 'region', id: 'Dataran Tinggi Golan (Suriah)', ar: 'هضبة الجولان (سوريا)', lon: 35.95, lat: 33.0, minW: 0, maxW: 1100, need: 'golan' });
  L.push({ key: 'poi:shifa', kind: 'poi', id: 'RS Al-Shifa', ar: 'مستشفى الشفاء', lon: 34.4446, lat: 31.5245, minW: 0, maxW: 1200, need: 'shifa' });
  L.push({ key: 'poi:aqsa', kind: 'poi', id: 'Masjid Al-Aqsa', ar: 'المسجد الأقصى', lon: 35.2358, lat: 31.7761, minW: 0, maxW: 1200, need: 'aqsa' });
  for (const [ek, e] of Object.entries(ERAS)) for (const [id, ar, lon, lat] of e.labels || []) L.push({ key: 'e:' + ek + ':' + id, kind: 'era', era: ek, id, ar, lon, lat, minW: 0, maxW: 9000 });
  for (const s of SEAS) L.push({ key: 's:' + s[0], kind: 'sea', id: s[1], ar: s[2], lon: s[3], lat: s[4], minW: s[5], maxW: s[6] });
  const seen = new Set();
  for (const f of world.countries) {
    const p = f.properties; if (p.a3 === 'ISR' || p.a3 === 'PSX' || seen.has(p.a3)) continue; seen.add(p.a3);
    L.push({ key: 'n:' + p.a3, kind: 'country', id: p.id, ar: p.ar, lon: p.lx, lat: p.ly, lr: p.lr });
  }
  places.push({ id: 'Madinah', ar: 'المدينة المنورة', x: 39.6142, y: 24.4686, r: 2, cap: 0, pop: 1300000 });
  for (const p of places) L.push({ key: 'c:' + p.id + p.x, kind: 'city', id: NAME_FIX[p.id] || p.id, ar: p.ar, lon: p.x, lat: p.y, cap: p.cap, pop: p.pop, r: p.r });
  return L;
}
const lab = l => { const o = S.labels[l.key] || {}; return { id: o.id ?? l.id, ar: o.ar ?? l.ar, on: o.on ?? true }; };

// ============ Kamera & proyeksi ============
const frameWH = () => FRAMES[S.frame];
function fitCam(b, W, H) {
  const [x0, y0, x1, y1] = b; const lat = (y0 + y1) / 2, lon = (x0 + x1) / 2;
  const lonKm = (x1 - x0) * 111.32 * Math.cos(lat * RAD), latKm = (y1 - y0) * 110.57;
  const sf = safeOf(S.frame, W / frameWH()[0]);
  const vw = W - sf.l - sf.r, vh = H - sf.t - sf.b;
  const w = Math.max(lonKm * W / vw, latKm * W / vh) * 1.1;
  const kpp = w / W;
  return { lon: lon + ((sf.r - sf.l) / 2) * kpp / (111.32 * Math.cos(lat * RAD)), lat: lat - ((sf.b - sf.t) / 2) * kpp / 110.57, w };
}
const keyCam = k => k.fit ? fitCam(k.fit, ...frameWH()) : k.cam;
function makeProj(mode, cam, W, H) {
  if (mode === 'globe') return d3.geoOrthographic().rotate([-cam.lon, -cam.lat]).translate([W / 2, H / 2]).scale(W * R / cam.w).clipExtent([[-4, -4], [W + 4, H + 4]]).precision(.35);
  const lat = Math.max(-80, Math.min(80, cam.lat));
  return d3.geoMercator().rotate([-cam.lon, 0]).center([0, lat]).translate([W / 2, H / 2]).scale(W * R * Math.cos(lat * RAD) / cam.w).clipExtent([[-4, -4], [W + 4, H + 4]]).precision(.35);
}
function pickSet(cam, W, H) {
  if (cam.w > 4300) return D.world;
  const hd = cam.w / 2 * Math.hypot(1, H / W) / 111, cl = Math.max(.2, Math.cos(cam.lat * RAD));
  if (cam.lon - hd / cl < -4 || cam.lon + hd / cl > 71 || cam.lat - hd < 3 || cam.lat + hd > 49) return D.world;
  return D.reg;
}
const globeWeight = w => S.proj === 'globe' ? 1 : S.proj === 'mercator' ? 0 : d3.easeCubicInOut(Math.max(0, Math.min(1, (w - 1300) / 900)));
const toM = c => { const p = Math.max(-80, Math.min(80, c.lat)) * RAD; return [c.lon * RAD, Math.log(Math.tan(Math.PI / 4 + p / 2)), c.w / R / Math.cos(p)]; };
function interpCam(a, b, u) {
  let bl = b.lon; while (bl - a.lon > 180) bl -= 360; while (bl - a.lon < -180) bl += 360;
  const f = d3.interpolateZoom(toM(a), toM({ ...b, lon: bl }));
  const [x, y, w] = f(u); const lat = 2 * Math.atan(Math.exp(y)) - Math.PI / 2;
  return { lon: x / RAD, lat: lat / RAD, w: w * R * Math.cos(lat) };
}
const totalT = () => S.keys.length ? S.keys.reduce((a, k, i) => a + k.hold + (i ? k.dur : 0), 0) : 0;
function evalT(t) {
  const ks = S.keys; if (!ks.length) return { cam: S.cam, show: { ...S0, eras: {} } };
  const hs = k => ({ ...k.show, eras: k.era ? { [k.era]: 1 } : {} });
  let acc = ks[0].hold; if (t <= acc) return { cam: keyCam(ks[0]), show: hs(ks[0]) };
  for (let i = 1; i < ks.length; i++) {
    const k = ks[i];
    if (t < acc + k.dur) {
      const u = (EASES[k.ease] || EASES.inOut)[1]((t - acc) / k.dur);
      const a = ks[i - 1].show, sh = {}; for (const c in S0) sh[c] = (a[c] || 0) + ((k.show[c] || 0) - (a[c] || 0)) * u;
      const pe = ks[i - 1].era, ne = k.era; sh.eras = {}; if (pe) sh.eras[pe] = (sh.eras[pe] || 0) + (pe === ne ? 1 : 1 - u); if (ne && ne !== pe) sh.eras[ne] = u;
      return { cam: interpCam(keyCam(ks[i - 1]), keyCam(k), u), show: sh };
    }
    acc += k.dur; if (t <= acc + k.hold) return { cam: keyCam(k), show: hs(k) }; acc += k.hold;
  }
  const l = ks[ks.length - 1]; return { cam: keyCam(l), show: hs(l) };
}

// ============ Render ============
const grats = {};
const grat = w => { const st = w > 9000 ? 15 : w > 2500 ? 5 : w > 500 ? 1 : .25; return grats[st] || (grats[st] = d3.geoGraticule().step([st, st]).extentMajor([[-180, -85], [180, 85]]).extentMinor([[-180, -85], [180, 85]])()); };
function niceKm(x) { const p = 10 ** Math.floor(Math.log10(x)); const m = x / p; return (m >= 5 ? 5 : m >= 2 ? 2 : 1) * p; }
const fontL = (sz, wt = 400, it = false) => `${it ? 'italic ' : ''}${wt} ${sz}px "Noto Sans", Arial, sans-serif`;
const fontA = (sz, wt = 400) => `${wt} ${sz}px "Noto Naskh Arabic", Arial, sans-serif`;

function drawScene(ctx, W, H, cam, show, mode, o) {
  const C = S.colors, L = S.layers, u = Math.min(W, H) / 1080, ls = S.lineScale * u;
  const proj = makeProj(mode, cam, W, H), path = d3.geoPath(proj, ctx), set = pickSet(cam, W, H);
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (!o.transparent) {
    if (mode === 'globe') {
      ctx.fillStyle = C.space; ctx.fillRect(0, 0, W, H);
      const [cx, cy] = proj.translate(), r = proj.scale();
      if (L.atm && r < 4 * Math.max(W, H)) { const g = ctx.createRadialGradient(cx, cy, r * .98, cx, cy, r * 1.12); g.addColorStop(0, C.atm); g.addColorStop(1, C.atm + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 1.12, 0, 7); ctx.fill(); }
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = C.sea; ctx.fill();
    } else { ctx.fillStyle = C.sea; ctx.fillRect(0, 0, W, H); }
  }
  if (L.grat) { ctx.beginPath(); path(grat(cam.w)); ctx.strokeStyle = C.grat; ctx.lineWidth = .8 * ls; ctx.stroke(); }
  ctx.beginPath(); for (const f of set.countries) path(f); ctx.fillStyle = C.land; ctx.fill();
  if (L.lakes) { ctx.beginPath(); for (const f of set.lakes) path(f); ctx.fillStyle = C.lake; ctx.fill(); ctx.strokeStyle = C.coast; ctx.lineWidth = .6 * ls; ctx.stroke(); }
  if (L.rivers && set.rivers.length) { ctx.beginPath(); for (const f of set.rivers) path(f); ctx.strokeStyle = C.river; ctx.lineWidth = 1.1 * ls; ctx.stroke(); }
  for (const [ek, a] of Object.entries(show.eras || {})) if (a > .001 && ERAS[ek]) drawEra(ctx, path, set, ERAS[ek], a, C, ls);
  if (L.golan) drawGolan(ctx, path, C, ls);
  if (L.borders) { ctx.beginPath(); path(set.borders); ctx.strokeStyle = C.border; ctx.lineWidth = 1.1 * ls; ctx.stroke(); }
  ctx.beginPath(); path(set.coast); ctx.strokeStyle = C.coast; ctx.lineWidth = .9 * ls; ctx.stroke();
  if (show.spot > .001) { ctx.save(); ctx.beginPath(); ctx.rect(-5, -5, W + 10, H + 10); path(D.pal48); ctx.globalAlpha = .6 * show.spot; ctx.fillStyle = C.dim; ctx.fill('evenodd'); ctx.restore(); }
  if (show.pal > .001) drawPal(ctx, proj, path, show.pal, C, ls);
  if (show.psx > .001) { ctx.save(); ctx.globalAlpha = Math.min(1, show.psx); ctx.beginPath(); path(D.wb); path(D.gaza); ctx.setLineDash([7 * ls, 5 * ls]); ctx.strokeStyle = C.wb; ctx.lineWidth = 1.8 * ls; ctx.stroke(); ctx.restore(); }
  if (show.gaza > .001) {
    ctx.save(); ctx.globalAlpha = Math.min(1, show.gaza); ctx.beginPath(); path(D.gaza); ctx.fillStyle = C.gaza; ctx.fill(); ctx.lineWidth = 1.4 * ls; ctx.strokeStyle = C.palLine; ctx.stroke();
    if (cam.w > 500) { const p = proj([34.39, 31.42]); if (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 16 * u * S.labelScale, 0, 7); ctx.lineWidth = 3 * ls; ctx.strokeStyle = C.gaza; ctx.stroke(); } }
    ctx.restore();
  }
  if (mode === 'globe' && !o.transparent) { ctx.beginPath(); path({ type: 'Sphere' }); ctx.strokeStyle = C.border; ctx.lineWidth = 1 * ls; ctx.stroke(); }
  drawLabels(ctx, proj, W, H, cam, show, mode, u, C);
  const sf = safeOf(S.frame, W / frameWH()[0]);
  if (L.scale) drawScale(ctx, W, H, cam, u, C, sf);
  if (L.north) drawNorth(ctx, W, H, u, C, sf);
  if (L.credit) { ctx.font = fontL(13 * u); ctx.fillStyle = C.text; ctx.globalAlpha = .7; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; const ec = Object.entries(show.eras || {}).filter(([k, a]) => a > .5 && ERAS[k] && ERAS[k].credit).map(([k]) => ERAS[k].credit); ctx.fillText(['Peta: Natural Earth, OCHA', ...ec].join(' · '), W - sf.r, H - sf.b + 26 * u); ctx.globalAlpha = 1; }
  drawEraHud(ctx, W, H, show, u, C, sf);
  if (show.inset > .001) drawInset(ctx, proj, W, H, cam, show.inset, u, C, sf);
  ctx.restore();
}
function eraGeo(g, set) {
  if (g.includes(':')) { const [ns, k] = g.split(':'); return D[ns] && D[ns][k]; }
  if (g === 'pal48' || g === 'wb' || g === 'gaza' || g === 'golan' || g === 'sinai' || g === 'hatay') return D[g];
  return (set.byA3 && set.byA3[g]) || D.reg.byA3[g];
}
function hatchFill(ctx, path, geoms, color, ls) {
  const bp = d3.geoPath(path.projection()); let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const g of geoms) { const b = bp.bounds(g); if (!isFinite(b[0][0])) continue; x0 = Math.min(x0, b[0][0]); y0 = Math.min(y0, b[0][1]); x1 = Math.max(x1, b[1][0]); y1 = Math.max(y1, b[1][1]); }
  if (!isFinite(x0)) return; const c = ctx.canvas; x0 = Math.max(x0, -10); y0 = Math.max(y0, -10); x1 = Math.min(x1, 1e5); y1 = Math.min(y1, 1e5);
  ctx.save(); ctx.beginPath(); for (const g of geoms) path(g); ctx.clip();
  const st = 9 * ls, h = y1 - y0; ctx.beginPath(); for (let x = x0 - h; x < x1; x += st) { ctx.moveTo(x, y1); ctx.lineTo(x + h, y0); }
  ctx.strokeStyle = color; ctx.lineWidth = 2.2 * ls; ctx.stroke(); ctx.restore();
}
function drawEra(ctx, path, set, e, a, C, ls) {
  ctx.save(); ctx.globalAlpha = a;
  for (const f of e.fills) {
    const gs = f.geo.map(g => eraGeo(g, set)).filter(Boolean);
    if (f.hatch) { hatchFill(ctx, path, gs, C[f.c], ls); ctx.beginPath(); for (const g of gs) path(g); ctx.strokeStyle = C[f.c]; ctx.lineWidth = 1.6 * ls; ctx.stroke(); }
    else { ctx.beginPath(); for (const g of gs) path(g); ctx.fillStyle = C[f.c]; ctx.fill(); if (f.edge) { ctx.strokeStyle = C.text; ctx.lineWidth = 1.4 * ls; ctx.stroke(); } }
  }
  if (e.line) { ctx.beginPath(); for (const g of e.line) path(eraGeo(g, set)); ctx.setLineDash([7 * ls, 5 * ls]); ctx.strokeStyle = C.wb; ctx.lineWidth = 1.8 * ls; ctx.stroke(); ctx.setLineDash([]); }
  for (const l of e.lines2 || []) { const g = eraGeo(l.geo, set); if (!g) continue; ctx.beginPath(); path(g); ctx.strokeStyle = C[l.c]; ctx.lineWidth = l.w * ls; ctx.lineJoin = 'round'; ctx.stroke(); }
  ctx.restore();
}
function hudEras(show) {
  const l = Object.entries(show.eras || {}).filter(([k, a]) => a > .01 && ERAS[k]);
  return l.length > 1 ? l.map(([k, a]) => [k, Math.max(0, Math.min(1, (a - .5) * 2))]).filter(x => x[1] > .01) : l;
}
function legendRows(e) { return e.fills.map(f => [f.c, f.name, f.hatch]).concat(e.line ? [['line', 'Garis gencatan 1949 (Green Line)']] : []).concat((e.lines2 || []).map(l => ['line2:' + l.c, l.name])).concat(e.note ? [['note', e.note]] : []); }
function legendBox(ctx, e, W, H, u, show) {
  const sf = safeOf(S.frame, W / frameWH()[0]), ls = S.labelScale, fs = 15 * u * ls, rows = legendRows(e), rh = fs * 1.55;
  ctx.font = fontL(fs, 500); const bw = Math.min(W * .62, Math.max(...rows.map(r => ctx.measureText(r[1]).width)) + 44 * u), bh = rows.length * rh + 16 * u;
  let pos = S.legendPos || 'auto'; if (pos === 'auto') pos = 'nb';
  const ys = 66 * u * ls, ts = 24 * u * ls, insetH = (show.inset > .01 ? Math.min(W, H) * .24 + 24 * u : 0);
  const bx = pos[1] === 'b' && pos[0] === 'k' || pos === 'ka' ? sf.l + 10 * u : W - sf.r - 10 * u - bw;
  let by;
  if (pos === 'kb') by = H - sf.b - (S.layers.scale ? 48 : 14) * u - bh;
  else if (pos === 'nb') by = H - sf.b - (S.layers.north ? 84 : 14) * u - bh;
  else if (pos === 'na') by = sf.t + 10 * u + insetH;
  else by = sf.t + 14 * u + (S.layers.eraHud ? ys * 1.08 + ts * 1.5 : 0) + 10 * u;
  return { bx, by, bw, bh, fs, rh, rows };
}
function hudRects(ctx, W, H, show, u) {
  const sf = safeOf(S.frame, W / frameWH()[0]), ls = S.labelScale, out = [];
  for (const [k] of hudEras(show)) {
    const e = ERAS[k];
    if (S.layers.eraHud) { const ys = 66 * u * ls, ts = 24 * u * ls; ctx.font = fontL(ys, 700); const w1 = ctx.measureText(e.year).width; ctx.font = fontL(ts, 600); const w2 = ctx.measureText(e.title).width; out.push([sf.l, sf.t, sf.l + 24 * u + Math.max(w1, w2), sf.t + 20 * u + ys * 1.08 + ts * 1.3]); }
    if (S.layers.legend) { const { bx, by, bw, bh } = legendBox(ctx, e, W, H, u, show); out.push([bx - 4 * u, by - 4 * u, bx + bw + 4 * u, by + bh + 4 * u]); }
  }
  return out;
}
function drawEraHud(ctx, W, H, show, u, C, sf) {
  const list = hudEras(show); if (!list.length) return;
  const ls = S.labelScale;
  for (const [k, a] of list) {
    const e = ERAS[k]; ctx.save(); ctx.globalAlpha = a; ctx.lineJoin = 'round';
    if (S.layers.eraHud) {
      const x = sf.l + 14 * u, y = sf.t + 14 * u, ys = 66 * u * ls, ts = 24 * u * ls;
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.font = fontL(ys, 700); ctx.lineWidth = ys * .14; ctx.strokeStyle = C.halo; ctx.strokeText(e.year, x, y); ctx.fillStyle = C.text; ctx.fillText(e.year, x, y);
      ctx.font = fontL(ts, 600); ctx.lineWidth = ts * .25; ctx.strokeText(e.title, x, y + ys * 1.08); ctx.fillText(e.title, x, y + ys * 1.08);
    }
    if (S.layers.legend) {
      const { bx, by, bw: wmax, bh, fs, rh, rows } = legendBox(ctx, e, W, H, u, show);
      ctx.fillStyle = C.halo; ctx.globalAlpha = a * .88; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, wmax, bh, 8 * u) : ctx.rect(bx, by, wmax, bh); ctx.fill(); ctx.globalAlpha = a;
      rows.forEach(([c, name, hatch], i) => {
        const ry = by + 8 * u + i * rh, sx = bx + 10 * u, sw = 22 * u, shh = fs * 1.05;
        if (c === 'note') { ctx.font = fontL(fs * .88, 400, true); ctx.fillStyle = C.text; ctx.textBaseline = 'top'; ctx.fillText(name, sx, ry + 2 * u); return; }
        if (c === 'line') { ctx.beginPath(); ctx.moveTo(sx, ry + shh / 2); ctx.lineTo(sx + sw, ry + shh / 2); ctx.setLineDash([5 * u, 3 * u]); ctx.strokeStyle = C.wb; ctx.lineWidth = 2 * u; ctx.stroke(); ctx.setLineDash([]); }
        else if (c.startsWith('line2:')) { ctx.beginPath(); ctx.moveTo(sx, ry + shh / 2); ctx.lineTo(sx + sw, ry + shh / 2); ctx.strokeStyle = C[c.slice(6)]; ctx.lineWidth = 3.5 * u; ctx.stroke(); }
        else if (hatch) { ctx.save(); ctx.beginPath(); ctx.rect(sx, ry, sw, shh); ctx.clip(); ctx.beginPath(); for (let q = -shh; q < sw; q += 6 * u) { ctx.moveTo(sx + q, ry + shh); ctx.lineTo(sx + q + shh, ry); } ctx.strokeStyle = C[c]; ctx.lineWidth = 2 * u; ctx.stroke(); ctx.restore(); ctx.strokeStyle = C[c]; ctx.lineWidth = 1.2 * u; ctx.strokeRect(sx, ry, sw, shh); }
        else { ctx.fillStyle = C[c]; ctx.fillRect(sx, ry, sw, shh); ctx.strokeStyle = C.border; ctx.lineWidth = .8 * u; ctx.strokeRect(sx, ry, sw, shh); }
        ctx.font = fontL(fs, 500); ctx.fillStyle = C.text; ctx.textBaseline = 'top'; ctx.fillText(name, sx + sw + 9 * u, ry + 1 * u);
      });
    }
    ctx.restore();
  }
}
function drawPal(ctx, proj, path, v, C, ls) {
  const p = Math.min(1, v / .6), f = Math.max(0, (v - .4) / .6);
  if (f > 0) { ctx.save(); ctx.globalAlpha = f; ctx.beginPath(); path(D.pal48); ctx.fillStyle = C.pal; ctx.fill(); ctx.restore(); }
  ctx.strokeStyle = C.palLine; ctx.lineWidth = 2 * ls;
  if (p >= 1) { ctx.beginPath(); path(D.pal48); ctx.stroke(); return; }
  const pts = D.palRing.map(c => proj(c)).filter(Boolean); if (pts.length < 2) return;
  let tot = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  let left = tot * p; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && left > 0; i++) { const d = seg[i - 1]; if (d <= left) { ctx.lineTo(pts[i][0], pts[i][1]); left -= d; } else { const r = left / d; ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * r, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * r); left = 0; } }
  ctx.stroke();
}
function drawGolan(ctx, path, C, ls) {
  const b = d3.geoPath(path.projection()).bounds(D.golan); if (!isFinite(b[0][0])) return;
  ctx.save(); ctx.beginPath(); path(D.golan); ctx.clip();
  ctx.beginPath(); const st = 7 * ls * 1.4, w = b[1][0] - b[0][0], h = b[1][1] - b[0][1];
  for (let x = b[0][0] - h; x < b[1][0]; x += st) { ctx.moveTo(x, b[1][1]); ctx.lineTo(x + h, b[0][1]); }
  ctx.strokeStyle = C.golan; ctx.lineWidth = 1.2 * ls; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.beginPath(); path(D.golan); ctx.setLineDash([4 * ls, 3 * ls]); ctx.strokeStyle = C.golan; ctx.lineWidth = 1.3 * ls; ctx.stroke(); ctx.restore();
}
const ramp = (x, a, b) => Math.max(0, Math.min(1, (x - a) / (b - a)));
const below = (w, thr) => 1 - ramp(Math.log(w), Math.log(thr * .82), Math.log(thr)); // 1 saat w jauh di bawah ambang, memudar mendekati ambang
function labelVisible(l, cam, show, W, H) {
  const L = S.layers, w = cam.w;
  let a = (l.maxW ? below(w, l.maxW) : 1) * (l.minW ? 1 - below(w, l.minW * 1.2) : 1);
  if (a <= 0) return 0;
  const tall = H > W * 1.2 ? .6 : 0;
  switch (l.kind) {
    case 'pal48': return a * (show.pal > .5 ? Math.min(1, (show.pal - .5) * 2) : 0);
    case 'pcity': return a * show.city;
    case 'city': {
      const thr = l.cap ? (l.pop > 5e6 ? 9000 : 3800) : (l.r <= 2 ? 2200 : 0);
      return thr ? a * show.city * below(w * (1 + tall * .5), thr) : 0;
    }
    case 'country': {
      if (!L.countryLbl) return 0;
      for (const [ek, ea] of Object.entries(show.eras || {})) if (ea > .5 && ERAS[ek] && ERAS[ek].hide && ERAS[ek].hide.includes(l.key.slice(2))) return 0;
      const lw = Math.log(w), pts = [[Math.log(500), 7.5], [Math.log(1300), 5.6], [Math.log(3000), 4.6], [Math.log(6000), 3.6], [Math.log(12000), 2.6], [Math.log(26000), 1.6]];
      let lim = lw <= pts[0][0] ? pts[0][1] : pts[pts.length - 1][1];
      for (let i = 1; i < pts.length; i++) if (lw <= pts[i][0] && lw > pts[i - 1][0]) { const t = (lw - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); lim = pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1]); break; }
      return a * Math.max(0, Math.min(1, lim - tall - l.lr + .5));
    }
    case 'era': return a * ((show.eras || {})[l.era] || 0);
    case 'sea': return L.seaLbl ? a : 0;
    case 'poi': return L[l.need] ? a : 0;
    case 'region': return a * (l.need === 'golan' ? (L.golan ? 1 : 0) : l.need === 'psx' ? show.psx : Math.max(show.gaza, show.psx));
  }
  return 0;
}
function drawLabels(ctx, proj, W, H, cam, show, mode, u, C) {
  const ls = S.labelScale, boxes = hudRects(ctx, W, H, show, u), center = [cam.lon, cam.lat];
  const hit = b => boxes.some(a => b[0] < a[2] && b[2] > a[0] && b[1] < a[3] && b[3] > a[1]);
  const order = { pal48: 0, era: 1, poi: 2, pcity: 3, region: 4, country: 5, sea: 6, city: 7 };
  const items = LBL.map(l => ({ l, v: labelVisible(l, cam, show, W, H) })).filter(x => x.v > .01)
    .sort((a, b) => (order[a.l.kind] - order[b.l.kind]) || ((a.l.tier || 9) - (b.l.tier || 9)) || ((b.l.pop || 0) - (a.l.pop || 0)) || ((a.l.lr || 9) - (b.l.lr || 9)));
  for (const { l, v } of items) {
    const t = lab(l); if (!t.on) continue;
    if (mode === 'globe' && d3.geoDistance([l.lon, l.lat], center) > 1.42) continue;
    let p = proj([l.lon, l.lat]); if (!p) continue;
    let sz, wt = 400, it = false, col = C.text, dot = false, upper = false, align = 'center';
    switch (l.kind) {
      case 'pal48': sz = 34; wt = 700; col = S.theme === 'gelap' ? C.palLine : C.palLine; break;
      case 'pcity': sz = l.tier === 1 ? 21 : l.tier === 2 ? 18 : 16; wt = l.tier === 1 ? 600 : 400; dot = true; align = 'left'; break;
      case 'city': sz = l.cap ? 18 : 16; wt = l.cap ? 600 : 400; dot = true; align = 'left'; break;
      case 'poi': sz = 17; wt = 600; dot = true; align = 'left'; break;
      case 'country': sz = cam.w > 6000 ? 15 : 17; wt = 700; upper = true; col = C.text; break;
      case 'sea': sz = l.key === 's:medW' || l.key === 's:hind' ? 20 : 16; it = true; col = C.textSea; break;
      case 'region': sz = 16; it = true; wt = 600; col = l.need === 'golan' ? C.golan : C.wb; break;
      case 'era': sz = l.id.length > 14 ? 17 : 21; wt = 700; col = C.text; break;
    }
    sz *= u * ls;
    if (l.kind === 'pal48' && cam.w >= 1500) {
      const c = proj([35.0, 31.4]); if (!c) continue; p = [c[0] - 150 * u * ls, c[1] - 40 * u * ls];
    }
    if (p[0] < -50 || p[0] > W + 50 || p[1] < -50 || p[1] > H + 50) continue;
    const txt = upper ? t.id.toLocaleUpperCase('id') : t.id;
    ctx.font = fontL(sz, wt, it); try { ctx.letterSpacing = upper ? `${(.06 * sz).toFixed(1)}px` : '0px'; } catch (e) { }
    const tw = ctx.measureText(txt).width;
    const showAr = S.arabic && t.ar;
    let aw = 0, asz = sz * .92; if (showAr) { ctx.font = fontA(asz, wt > 400 ? 600 : 400); try { ctx.letterSpacing = '0px'; } catch (e) { } aw = ctx.measureText(t.ar).width; }
    const bw = Math.max(tw, aw), bh = sz * 1.2 + (showAr ? asz * 1.35 : 0), gap = (dot ? 9 : 0) * u * ls, pad = 3 * u;
    let x, y = p[1] - (dot ? sz * .62 : bh / 2), box;
    const tryBox = side => { x = side === 'left' ? p[0] + gap : side === 'right' ? p[0] - gap - bw : p[0] - bw / 2; return [x - pad, y - pad, x + bw + pad, y + bh + pad]; };
    const out = b => b[0] < 2 || b[2] > W - 2 || b[1] < 2 || b[3] > H - 2;
    if (align === 'left') { box = tryBox('left'); if (hit(box) || out(box)) { box = tryBox('right'); if (hit(box) || out(box)) continue; } }
    else { box = tryBox('center'); if ((hit(box) || out(box)) && l.kind !== 'pal48') continue; }
    const dotBox = dot ? [p[0] - 5 * u, p[1] - 5 * u, p[0] + 5 * u, p[1] + 5 * u] : null;
    boxes.push(box); if (dotBox) boxes.push(dotBox);
    ctx.save(); ctx.globalAlpha = Math.min(1, v);
    if (l.kind === 'pal48' && cam.w >= 1500) { const c = proj([35.0, 31.4]); ctx.beginPath(); ctx.moveTo(x + bw, y + bh / 2); ctx.lineTo(c[0], c[1]); ctx.strokeStyle = C.palLine; ctx.lineWidth = 1.5 * u; ctx.stroke(); }
    if (dot) {
      ctx.beginPath(); const r = (l.kind === 'poi' ? 6 : (l.cap || l.tier === 1) ? 5 : 4) * u * ls;
      if (l.kind === 'poi') { ctx.rect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.fillStyle = C.pal; } else { ctx.arc(p[0], p[1], r, 0, 7); ctx.fillStyle = C.text; }
      ctx.fill(); ctx.lineWidth = 1.6 * u; ctx.strokeStyle = C.halo; ctx.stroke();
    }
    const cx = x + bw / 2, tx = align === 'left' ? x : cx;
    ctx.textAlign = align === 'left' ? 'left' : 'center'; ctx.textBaseline = 'top'; ctx.lineJoin = 'round';
    const halo = (s, X, Y) => { ctx.lineWidth = Math.max(2.5, sz * .22); ctx.strokeStyle = C.halo; ctx.strokeText(s, X, Y); ctx.fillStyle = col; ctx.fillText(s, X, Y); };
    ctx.font = fontL(sz, wt, it); try { ctx.letterSpacing = upper ? `${(.06 * sz).toFixed(1)}px` : '0px'; } catch (e) { }
    if (align === 'left' && box[0] < p[0] - gap) { ctx.textAlign = 'right'; halo(txt, x + bw, y); } else halo(txt, tx, y);
    if (showAr) {
      ctx.font = fontA(asz, wt > 400 ? 600 : 400); try { ctx.letterSpacing = '0px'; } catch (e) { }
      const ay = y + sz * 1.18;
      if (align === 'left' && box[0] < p[0] - gap) { ctx.textAlign = 'right'; halo(t.ar, x + bw, ay); } else halo(t.ar, tx, ay);
    }
    ctx.restore();
  }
  try { ctx.letterSpacing = '0px'; } catch (e) { }
}
function drawScale(ctx, W, H, cam, u, C, sf) {
  const kpp = cam.w / W; if (cam.w > 9000) return; const km = niceKm(kpp * W * .16), px = km / kpp;
  const x = sf.l + 10 * u, y = H - sf.b - 14 * u;
  ctx.save(); ctx.lineWidth = 6 * u; ctx.strokeStyle = C.halo; ctx.lineCap = 'butt';
  const draw = () => { ctx.beginPath(); ctx.moveTo(x, y - 8 * u); ctx.lineTo(x, y); ctx.lineTo(x + px, y); ctx.lineTo(x + px, y - 8 * u); ctx.stroke(); };
  draw(); ctx.lineWidth = 2.2 * u; ctx.strokeStyle = C.text; draw();
  ctx.font = fontL(15 * u, 600); ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.lineWidth = 4 * u; ctx.strokeStyle = C.halo;
  const s = `${km.toLocaleString('id')} km`; ctx.strokeText(s, x + 6 * u, y - 6 * u); ctx.fillStyle = C.text; ctx.fillText(s, x + 6 * u, y - 6 * u);
  ctx.restore();
}
function drawNorth(ctx, W, H, u, C, sf) {
  const x = W - sf.r - 26 * u, y = H - sf.b - 40 * u;
  ctx.save(); ctx.beginPath(); ctx.moveTo(x, y - 24 * u); ctx.lineTo(x + 10 * u, y + 6 * u); ctx.lineTo(x, y); ctx.lineTo(x - 10 * u, y + 6 * u); ctx.closePath();
  ctx.fillStyle = C.text; ctx.strokeStyle = C.halo; ctx.lineWidth = 2 * u; ctx.stroke(); ctx.fill();
  ctx.font = fontL(15 * u, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.lineWidth = 4 * u; ctx.strokeText('U', x, y + 10 * u); ctx.fillText('U', x, y + 10 * u); ctx.restore();
}
function drawInset(ctx, mainProj, W, H, cam, a, u, C, sf) {
  const r = Math.min(W, H) * .12, cx = W - sf.r - r - 8 * u, cy = sf.t + r + 8 * u;
  const p2 = d3.geoOrthographic().rotate([-36, -26]).scale(r).translate([cx, cy]).precision(.6), path = d3.geoPath(p2, ctx);
  ctx.save(); ctx.globalAlpha = a;
  ctx.beginPath(); ctx.arc(cx, cy, r + 3 * u, 0, 7); ctx.fillStyle = C.halo; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = C.sea; ctx.fill(); ctx.save(); ctx.clip();
  ctx.beginPath(); for (const f of D.world.countries) path(f); ctx.fillStyle = C.land; ctx.fill();
  ctx.beginPath(); path(D.world.borders); ctx.strokeStyle = C.border; ctx.lineWidth = .5 * u; ctx.stroke();
  ctx.beginPath(); path(D.pal48); ctx.fillStyle = C.pal; ctx.fill();
  const ring = []; const inv = q => mainProj.invert(q); const n = 12;
  for (let i = 0; i <= n; i++) ring.push(inv([W * i / n, 0])); for (let i = 0; i <= n; i++) ring.push(inv([W, H * i / n]));
  for (let i = n; i >= 0; i--) ring.push(inv([W * i / n, H])); for (let i = n; i >= 0; i--) ring.push(inv([0, H * i / n]));
  if (ring.every(Boolean) && cam.w < 5000) { ctx.beginPath(); path({ type: 'LineString', coordinates: ring.concat([ring[0]]) }); ctx.strokeStyle = C.pal; ctx.lineWidth = 1.8 * u; ctx.stroke(); }
  ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = C.border; ctx.lineWidth = 1.5 * u; ctx.stroke();
  ctx.restore();
}

// komposisi dengan transisi globe → datar
const offs = {};
function offCanvas(w, h) { const k = w + 'x' + h; let c = offs[k]; if (!c) { c = offs[k] = document.createElement('canvas'); c.width = w; c.height = h; } return c; }
function composeFrame(ctx, W, H, cam, show, o, xf) {
  const gw = globeWeight(cam.w);
  const run = (c, mode) => { c.save(); if (xf) c.setTransform(...xf); drawScene(c, W, H, cam, show, mode, o); c.restore(); };
  if (gw <= .001) return run(ctx, 'mercator');
  if (gw >= .999) return run(ctx, 'globe');
  run(ctx, 'mercator');
  const oc = offCanvas(ctx.canvas.width, ctx.canvas.height), oc2 = oc.getContext('2d'); oc2.setTransform(1, 0, 0, 1, 0, 0); oc2.clearRect(0, 0, oc.width, oc.height);
  run(oc2, 'globe'); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = gw; ctx.drawImage(oc, 0, 0); ctx.restore();
}

// ============ Pratinjau ============
const cv = $('cv'), frameEl = $('frame'), stage = $('stage');
let mode = 'edit', T = 0, playing = false, raf = 0, dirty = true;
function current() { if (mode === 'time') return evalT(T); const k = S.keys[S.sel]; return { cam: S.cam, show: k ? { ...k.show, eras: k.era ? { [k.era]: 1 } : {} } : { ...S0, eras: {} } }; }
function layout() {
  const [FW, FH] = frameWH(), r = stage.getBoundingClientRect(), aw = r.width - 36, ah = r.height - 36;
  const k = Math.min(aw / FW, ah / FH), w = Math.max(60, Math.floor(FW * k)), h = Math.max(60, Math.floor(FH * k));
  frameEl.style.width = w + 'px'; frameEl.style.height = h + 'px';
  const dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); dirty = true;
}
function draw() {
  if (!D) return; const [FW, FH] = frameWH(), ctx = cv.getContext('2d'), k = cv.width / FW;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
  const { cam, show } = current();
  composeFrame(ctx, FW, FH, cam, show, { transparent: false }, [k, 0, 0, k, 0, 0]);
  if (S.safe && SAFE[S.frame]) {
    const s = SAFE[S.frame]; ctx.save(); ctx.setTransform(k, 0, 0, k, 0, 0); ctx.fillStyle = 'rgba(193,40,56,.16)';
    ctx.fillRect(0, 0, FW, s.t); ctx.fillRect(0, FH - s.b, FW, s.b); ctx.fillRect(FW - s.r, s.t, s.r, FH - s.t - s.b);
    ctx.setLineDash([10, 8]); ctx.strokeStyle = 'rgba(193,40,56,.8)'; ctx.lineWidth = 2; ctx.strokeRect(s.l, s.t, FW - s.l - s.r, FH - s.t - s.b); ctx.restore();
  }
  $('badge').textContent = mode === 'time' ? 'Pratinjau linimasa' : 'Mode edit · ' + Math.round(cam.w).toLocaleString('id') + ' km';
  const tt = totalT(); $('timeTxt').textContent = `${fmtT(mode === 'time' ? T : 0)} / ${fmtT(tt)}`;
}
const loop = () => { if (dirty) { dirty = false; draw(); } raf = requestAnimationFrame(loop); };
const redraw = () => { dirty = true; };
function setEdit() { if (mode !== 'edit') { mode = 'edit'; stopPlay(); } }
function syncCamInputs() { $('camLon').value = S.cam.lon.toFixed(2); $('camLat').value = S.cam.lat.toFixed(2); $('camW').value = Math.round(S.cam.w); }

// interaksi geser / zoom / cubit
const ptrs = new Map(); let pinch0 = 0, w0 = 0;
frameEl.addEventListener('pointerdown', e => { if (e.target.closest('.zoomers')) return; frameEl.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); if (mode === 'time') { const c = evalT(T).cam; S.cam = { ...c }; } setEdit(); if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); w0 = S.cam.w; } });
frameEl.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return; const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch0) S.cam.w = clampW(w0 * pinch0 / d); }
  else { const k = frameWH()[0] / frameEl.clientWidth, kpp = S.cam.w / frameWH()[0]; const dx = (e.clientX - prev[0]) * k * kpp, dy = (e.clientY - prev[1]) * k * kpp; S.cam.lon -= dx / (111.32 * Math.max(.15, Math.cos(S.cam.lat * RAD))); S.cam.lat = Math.max(-78, Math.min(78, S.cam.lat + dy / 110.57)); if (S.cam.lon > 180) S.cam.lon -= 360; if (S.cam.lon < -180) S.cam.lon += 360; }
  syncCamInputs(); redraw();
});
const endPtr = e => { ptrs.delete(e.pointerId); pinch0 = 0; persist(); };
frameEl.addEventListener('pointerup', endPtr); frameEl.addEventListener('pointercancel', endPtr);
const clampW = w => Math.max(15, Math.min(S.proj === 'mercator' ? 30000 : 40000, w));
frameEl.addEventListener('wheel', e => { e.preventDefault(); if (mode === 'time') { S.cam = { ...evalT(T).cam }; } setEdit(); S.cam.w = clampW(S.cam.w * Math.exp(e.deltaY * .0013)); syncCamInputs(); redraw(); persist(); }, { passive: false });
$('zin').onclick = () => { setEdit(); S.cam.w = clampW(S.cam.w / 1.5); syncCamInputs(); redraw(); persist(); };
$('zout').onclick = () => { setEdit(); S.cam.w = clampW(S.cam.w * 1.5); syncCamInputs(); redraw(); persist(); };
for (const id of ['camLon', 'camLat', 'camW']) $(id).addEventListener('change', () => { setEdit(); S.cam = { lon: +$('camLon').value || 0, lat: +$('camLat').value || 0, w: clampW(+$('camW').value || 500) }; redraw(); persist(); });

// linimasa
function stopPlay() { playing = false; $('playBtn').textContent = 'Putar'; }
$('playBtn').onclick = () => {
  if (!S.keys.length) return toast('Tambahkan keyframe dulu');
  if (playing) return stopPlay();
  mode = 'time'; playing = true; $('playBtn').textContent = 'Jeda'; if (T >= totalT() - .01) T = 0;
  let last = performance.now();
  const step = now => { if (!playing) return; T += (now - last) / 1000; last = now; const tt = totalT(); if (T >= tt) { T = tt; stopPlay(); } $('scrub').value = tt ? T / tt : 0; redraw(); if (playing) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
$('scrub').addEventListener('input', e => { mode = 'time'; stopPlay(); T = +e.target.value * totalT(); redraw(); });

// ============ Panel ============
function seg(el, items, cur, on) { el.innerHTML = items.map(([v, t]) => `<button type="button" data-v="${esc(v)}" aria-pressed="${v === cur}">${esc(t)}</button>`).join(''); el.onclick = e => { const b = e.target.closest('button'); if (b) on(b.dataset.v); }; }
function renderPanel() {
  seg($('frameSeg'), Object.keys(FRAMES).map(f => [f, f]), S.frame, v => { S.frame = v; renderPanel(); layout(); persist(); });
  seg($('projSeg'), Object.entries(PROJS), S.proj, v => { S.proj = v; if (v === 'mercator') S.cam.w = Math.min(S.cam.w, 30000); renderPanel(); redraw(); persist(); });
  $('projNote').textContent = PROJ_NOTE[S.proj];
  seg($('themeSeg'), Object.entries(THEMES).map(([k, t]) => [k, t.name]), S.theme, v => { S.theme = v; S.colors = { ...THEMES[v].c }; renderPanel(); redraw(); persist(); });
  $('colorBox').innerHTML = Object.entries(COLOR_NAMES).map(([k, n]) => `<label><input type="color" data-c="${k}" value="${esc(S.colors[k])}">${esc(n)}</label>`).join('');
  $('resSel').value = S.res; $('fpsSel').value = S.fps; $('safeChk').checked = S.safe; $('arChk').checked = S.arabic; $('transChk').checked = S.transparent; $('svgTextChk').checked = S.svgText;
  $('labelScale').value = S.labelScale; $('lsVal').textContent = '×' + (+S.labelScale).toFixed(2); $('lineScale').value = S.lineScale; $('lwVal').textContent = '×' + (+S.lineScale).toFixed(2);
  $('layerBox').innerHTML = LAYERS.map(([k, n]) => `<label class="chk"><input type="checkbox" data-l="${k}" ${S.layers[k] ? 'checked' : ''}>${esc(n)}</label>`).join('') +
    `<label class="field">Posisi legenda<select id="legendPos">${[['auto', 'Otomatis (kanan bawah)'], ['kb', 'Kiri bawah'], ['nb', 'Kanan bawah'], ['na', 'Kanan atas'], ['ka', 'Kiri atas, di bawah judul']].map(([v, n]) => `<option value="${v}" ${v === (S.legendPos || 'auto') ? 'selected' : ''}>${n}</option>`).join('')}</select></label>` +
    '<div class="lbl" style="margin-top:6px">Lapisan sejarah</div>' + LATER.map(([n, f]) => `<label class="chk off"><input type="checkbox" disabled>${esc(n)}<small>${esc(f)}</small></label>`).join('');
  renderKeys(); syncCamInputs();
}
$('colorBox').addEventListener('input', e => { const k = e.target.dataset.c; if (k) { S.colors[k] = e.target.value; redraw(); persist(); } });
$('layerBox').addEventListener('change', e => { if (e.target.id === 'legendPos') { S.legendPos = e.target.value; redraw(); persist(); return; } const k = e.target.dataset.l; if (k) { S.layers[k] = e.target.checked; redraw(); persist(); } });
$('resSel').onchange = e => { S.res = +e.target.value; persist(); };
$('fpsSel').onchange = e => { S.fps = +e.target.value; persist(); };
$('safeChk').onchange = e => { S.safe = e.target.checked; redraw(); persist(); };
$('arChk').onchange = e => { S.arabic = e.target.checked; redraw(); persist(); };
$('transChk').onchange = e => { S.transparent = e.target.checked; persist(); };
$('svgTextChk').onchange = e => { S.svgText = e.target.checked; persist(); };
$('labelScale').oninput = e => { S.labelScale = +e.target.value; $('lsVal').textContent = '×' + S.labelScale.toFixed(2); redraw(); persist(); };
$('lineScale').oninput = e => { S.lineScale = +e.target.value; $('lwVal').textContent = '×' + S.lineScale.toFixed(2); redraw(); persist(); };
$('jumpSel').innerHTML = '<option value="">Pilih tempat…</option>' + JUMPS.map((j, i) => `<option value="${i}">${esc(j[0])}</option>`).join('');
$('jumpSel').onchange = e => { const j = JUMPS[+e.target.value]; e.target.value = ''; if (!j) return; setEdit(); S.cam = j[1].fit ? fitCam(j[1].fit, ...frameWH()) : { ...j[1].cam }; if (S.cam.w > 4000 && S.proj === 'mercator' && j[0].includes('globe')) { S.proj = 'auto'; renderPanel(); } syncCamInputs(); redraw(); persist(); };
$('presetSeg').innerHTML = PRESETS.map((p, i) => `<button type="button" class="btn" data-p="${i}">${esc(p[0])}</button>`).join('');
$('presetSeg').onclick = e => { const b = e.target.closest('button'); if (!b) return; const p = PRESETS[+b.dataset.p]; S.keys = p[2](); S.proj = p[1]; S.sel = S.keys.length - 1; S.cam = { ...keyCam(S.keys[S.sel]) }; T = 0; mode = 'time'; renderPanel(); redraw(); persist(); $('playBtn').click(); };

function renderKeys() {
  $('keys').innerHTML = S.keys.length ? S.keys.map((k, i) => `<div class="key" data-i="${i}" aria-current="${i === S.sel}">
   <div class="top"><span class="num">${i + 1}</span><input type="text" data-f="name" value="${esc(k.name)}" aria-label="Nama keyframe"></div>
   <div class="grid"><label class="field">Transisi (dtk)<input type="number" data-f="dur" min="0" step="0.1" value="${k.dur}" ${i ? '' : 'disabled'}></label>
   <label class="field">Diam (dtk)<input type="number" data-f="hold" min="0" step="0.1" value="${k.hold}"></label>
   <label class="field">Gerak<select data-f="ease">${Object.entries(EASES).map(([v, e]) => `<option value="${v}" ${v === k.ease ? 'selected' : ''}>${e[0]}</option>`).join('')}</select></label></div>
   <label class="field">Era sejarah<select data-f="era">${ERA_OPTS.map(([v, n]) => `<option value="${v}" ${v === (k.era || '') ? 'selected' : ''} ${v.startsWith('x') ? 'disabled' : ''}>${esc(n)}</option>`).join('')}</select></label>
   <div class="chips">${CHIPS.map(([c, n]) => `<button type="button" class="chip" data-c="${c}" aria-pressed="${(k.show[c] || 0) > .5}">${esc(n)}</button>`).join('')}</div>
   ${k.fit ? '<span class="mini">Kamera menyesuaikan bingkai otomatis</span>' : ''}</div>`).join('') : '<p class="note">Belum ada keyframe. Pilih preset atau tambah dari tampilan.</p>';
  const tt = totalT(); $('scrub').disabled = !tt;
}
$('keys').addEventListener('click', e => {
  const card = e.target.closest('.key'); if (!card) return; const i = +card.dataset.i, k = S.keys[i];
  const chip = e.target.closest('.chip'); if (chip) { k.show[chip.dataset.c] = (k.show[chip.dataset.c] || 0) > .5 ? 0 : 1; chip.setAttribute('aria-pressed', k.show[chip.dataset.c] > .5); redraw(); persist(); return; }
  if (S.sel !== i || mode === 'time') { S.sel = i; setEdit(); S.cam = { ...keyCam(k) }; syncCamInputs(); document.querySelectorAll('.key').forEach(el => el.setAttribute('aria-current', +el.dataset.i === i)); redraw(); }
});
$('keys').addEventListener('change', e => { const card = e.target.closest('.key'), f = e.target.dataset.f; if (!card || !f) return; const k = S.keys[+card.dataset.i]; k[f] = f === 'name' || f === 'ease' || f === 'era' ? e.target.value : Math.max(0, +e.target.value || 0); renderKeys(); redraw(); persist(); });
$('addKey').onclick = () => { const prev = S.keys[S.sel]; S.keys.splice(S.sel + 1, 0, { name: 'Keyframe ' + (S.keys.length + 1), cam: { ...S.cam }, show: { ...(prev ? prev.show : S0) }, dur: 2.5, hold: 1, ease: 'inOut', era: prev ? prev.era || '' : '' }); S.sel = Math.min(S.sel + 1, S.keys.length - 1); if (S.keys.length === 1) S.sel = 0; renderKeys(); persist(); toast('Keyframe ditambahkan'); };
$('setKey').onclick = () => { const k = S.keys[S.sel]; if (!k) return toast('Pilih keyframe dulu'); k.cam = { ...S.cam }; k.fit = null; renderKeys(); persist(); toast('Kamera disimpan ke keyframe ' + (S.sel + 1)); };
$('delKey').onclick = () => { if (!S.keys.length) return; S.keys.splice(S.sel, 1); S.sel = Math.max(0, S.sel - 1); renderKeys(); redraw(); persist(); };
const moveKey = d => { const j = S.sel + d; if (j < 0 || j >= S.keys.length) return; [S.keys[S.sel], S.keys[j]] = [S.keys[j], S.keys[S.sel]]; S.sel = j; renderKeys(); persist(); };
$('upKey').onclick = () => moveKey(-1); $('downKey').onclick = () => moveKey(1);

function renderLblTable() {
  const q = $('lblFilter').value.trim().toLowerCase();
  const kinds = { era: 'Label era', pal48: 'Wilayah', pcity: "Kota Pal. '48", region: 'Wilayah', poi: 'Penanda', sea: 'Laut', country: 'Negara', city: 'Kota' };
  const rows = LBL.filter(l => !q || (lab(l).id + ' ' + l.id + ' ' + kinds[l.kind]).toLowerCase().includes(q)).slice(0, 160);
  $('lblBody').innerHTML = rows.map(l => { const t = lab(l); return `<tr data-k="${esc(l.key)}"><td><input type="checkbox" data-f="on" ${t.on ? 'checked' : ''} aria-label="Tampilkan"></td><td><input type="text" data-f="id" value="${esc(t.id)}" aria-label="Nama Indonesia"><span class="mini">${esc(kinds[l.kind])}</span></td><td><input type="text" class="ar" data-f="ar" value="${esc(t.ar || '')}" aria-label="Nama Arab"></td></tr>`; }).join('');
}
$('lblFilter').addEventListener('input', renderLblTable);
$('lblBody').addEventListener('change', e => { const tr = e.target.closest('tr'), f = e.target.dataset.f; if (!tr || !f) return; const k = tr.dataset.k; S.labels[k] = { ...(S.labels[k] || {}), [f]: f === 'on' ? e.target.checked : e.target.value }; redraw(); persist(); });

// ============ Ekspor ============
let DL = null; try { window.claude?.use?.('downloads').then(d => { DL = d; }).catch(() => { }); } catch (e) { }
async function saveFile(name, data) {
  if (DL) { try { await DL.save({ filename: name, data }); toast('Tersimpan: ' + name); } catch (e) { toast(e && e.code === 'declined' ? 'Penyimpanan dibatalkan' : 'Gagal menyimpan (' + ((e && (e.code || e.message)) || 'galat') + ')'); } return; }
  const blob = data instanceof Blob ? data : new Blob([data]); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); toast('Mengunduh ' + name);
}
const outWH = () => frameWH().map(v => v * S.res);
const stamp = () => { const d = new Date(); return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`; };
const fname = ext => `peta-palestina48-${S.frame.replace(':', 'x')}-${stamp()}.${ext}`;
$('pngBtn').onclick = async () => {
  const [W, H] = outWH(), c = document.createElement('canvas'); c.width = W; c.height = H; const { cam, show } = current();
  composeFrame(c.getContext('2d'), W, H, cam, show, { transparent: S.transparent }, null);
  const blob = await new Promise(r => c.toBlob(r, 'image/png')); saveFile(fname('png'), blob);
};
function buildSVG() {
  const [W, H] = outWH(), { cam, show } = current(), mode = globeWeight(cam.w) >= .5 ? 'globe' : 'mercator';
  const C = S.colors, L = S.layers, u = Math.min(W, H) / 1080, ls = S.lineScale * u;
  const proj = makeProj(mode, cam, W, H).clipExtent([[0, 0], [W, H]]), gp = d3.geoPath(proj); try { gp.digits(1); } catch (e) { }
  const set = pickSet(cam, W, H), P = g => gp(g) || '';
  const G = [];
  const add = (id, body) => { if (body) G.push([id, body]); };
  if (!S.transparent) add('latar', mode === 'globe' ? `<rect width="${W}" height="${H}" fill="${C.space}"/><path d="${P({ type: 'Sphere' })}" fill="${C.sea}"/>` : `<rect width="${W}" height="${H}" fill="${C.sea}"/>`);
  if (L.grat) add('graticule', `<path d="${P(grat(cam.w))}" fill="none" stroke="${C.grat}" stroke-width="${(.8 * ls).toFixed(2)}"/>`);
  { const ps = set.countries.map(f => { const d = P(f); return d ? `<path data-negara="${esc(f.properties.a3)}" d="${d}"/>` : ''; }).join(''); if (ps) add('daratan', `<g fill="${C.land}">${ps}</g>`); }
  if (L.lakes) { const d = set.lakes.map(P).join(''); if (d) add('danau', `<path d="${d}" fill="${C.lake}" stroke="${C.coast}" stroke-width="${(.6 * ls).toFixed(2)}"/>`); }
  if (L.rivers && set.rivers.length) { const d = set.rivers.map(P).join(''); if (d) add('sungai', `<path d="${d}" fill="none" stroke="${C.river}" stroke-width="${(1.1 * ls).toFixed(2)}" stroke-linecap="round"/>`); }
  if (L.golan) { const d = P(D.golan); if (d) add('golan', `<defs><pattern id="arsir" width="${(10 * ls).toFixed(1)}" height="${(10 * ls).toFixed(1)}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="${(10 * ls).toFixed(1)}" stroke="${C.golan}" stroke-width="${(1.2 * ls).toFixed(2)}"/></pattern></defs><path d="${d}" fill="url(#arsir)" stroke="${C.golan}" stroke-dasharray="${(4 * ls).toFixed(1)} ${(3 * ls).toFixed(1)}" stroke-width="${(1.3 * ls).toFixed(2)}"/>`); }
  for (const [ek, ea] of Object.entries(show.eras || {})) {
    const e = ERAS[ek]; if (!e || ea < .01) continue; let body = '', defs = '';
    for (const f of e.fills) {
      const d = f.geo.map(g => P(eraGeo(g, set))).join(''); if (!d) continue;
      if (f.hatch) { const id = 'hatch-' + ek; defs += `<pattern id="${id}" width="${(9 * ls).toFixed(1)}" height="${(9 * ls).toFixed(1)}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="${(9 * ls).toFixed(1)}" stroke="${C[f.c]}" stroke-width="${(2.2 * ls).toFixed(2)}"/></pattern>`; body += `<path d="${d}" fill="url(#${id})" stroke="${C[f.c]}" stroke-width="${(1.6 * ls).toFixed(2)}"/>`; }
      else body += `<path d="${d}" fill="${C[f.c]}"${f.edge ? ` stroke="${C.text}" stroke-width="${(1.4 * ls).toFixed(2)}"` : ''}/>`;
    }
    if (e.line) { const d = e.line.map(g => P(eraGeo(g, set))).join(''); if (d) body += `<path d="${d}" fill="none" stroke="${C.wb}" stroke-width="${(1.8 * ls).toFixed(2)}" stroke-dasharray="${(7 * ls).toFixed(1)} ${(5 * ls).toFixed(1)}"/>`; }
    for (const l of e.lines2 || []) { const d = P(eraGeo(l.geo, set)); if (d) body += `<path d="${d}" fill="none" stroke="${C[l.c]}" stroke-width="${(l.w * ls).toFixed(2)}" stroke-linejoin="round"/>`; }
    if (body) add('era-' + ek, `${defs ? '<defs>' + defs + '</defs>' : ''}<g opacity="${Math.min(1, ea).toFixed(2)}">${body}</g>`);
  }
  if (show.spot > .001) add('sorotan-redup', `<path d="M-5,-5H${W + 5}V${H + 5}H-5Z${P(D.pal48)}" fill="${C.dim}" fill-opacity="${(.6 * show.spot).toFixed(2)}" fill-rule="evenodd"/>`);
  if (L.borders) { const d = P(set.borders); if (d) add('batas-negara', `<path d="${d}" fill="none" stroke="${C.border}" stroke-width="${(1.1 * ls).toFixed(2)}" stroke-linejoin="round"/>`); }
  { const d = P(set.coast); if (d) add('garis-pantai', `<path d="${d}" fill="none" stroke="${C.coast}" stroke-width="${(.9 * ls).toFixed(2)}" stroke-linejoin="round"/>`); }
  if (show.pal > .001) { const d = P(D.pal48); if (d) add('palestina-48', `<path d="${d}" fill="${C.pal}" fill-opacity="${Math.min(1, show.pal).toFixed(2)}" stroke="${C.palLine}" stroke-width="${(2 * ls).toFixed(2)}" stroke-linejoin="round"/>`); }
  if (show.psx > .001) { const d = P(D.wb) + P(D.gaza); if (d) add('tepi-barat-gaza', `<path d="${d}" fill="none" stroke="${C.wb}" stroke-width="${(1.8 * ls).toFixed(2)}" stroke-dasharray="${(7 * ls).toFixed(1)} ${(5 * ls).toFixed(1)}"/>`); }
  if (show.gaza > .001) { const d = P(D.gaza); if (d) add('jalur-gaza', `<path d="${d}" fill="${C.gaza}" stroke="${C.palLine}" stroke-width="${(1.4 * ls).toFixed(2)}"/>`); }
  if (mode === 'globe' && !S.transparent) add('tepi-globe', `<path d="${P({ type: 'Sphere' })}" fill="none" stroke="${C.border}" stroke-width="${ls.toFixed(2)}"/>`);
  if (S.svgText) add('label', svgLabels(proj, W, H, cam, show, mode, u, C));
  if (S.svgText) { const sf = safeOf(S.frame, W / frameWH()[0]); const lsz = S.labelScale; let h = '';
    for (const [ek] of hudEras(show)) { const e = ERAS[ek];
      const x = sf.l + 14 * u, y = sf.t + 14 * u, ys = 66 * u * lsz, ts = 24 * u * lsz, T = (t, X, Y, sz, wt, extra = '') => `<text x="${X.toFixed(1)}" y="${Y.toFixed(1)}" font-family="Noto Sans, Arial" font-size="${sz.toFixed(1)}" font-weight="${wt}" fill="${C.text}" stroke="${C.halo}" stroke-width="${(sz * .14).toFixed(1)}" paint-order="stroke" stroke-linejoin="round"${extra}>${esc(t)}</text>`;
      if (S.layers.eraHud) h += T(e.year, x, y + ys * .82, ys, 700) + T(e.title, x, y + ys * 1.08 + ts * .82, ts, 600);
      if (S.layers.legend) { const mc = document.createElement('canvas').getContext('2d'); const { bx, by, bw, bh, fs, rh, rows } = legendBox(mc, e, W, H, u, show);
        h += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(8 * u).toFixed(1)}" fill="${C.halo}" fill-opacity=".88"/>`;
        rows.forEach(([c, name, hatch], i) => { const ry = by + 8 * u + i * rh, sx = bx + 10 * u, sw = 22 * u, shh = fs * 1.05;
          if (c === 'note') { h += `<text x="${sx.toFixed(1)}" y="${(ry + fs * .9).toFixed(1)}" font-family="Noto Sans, Arial" font-size="${(fs * .88).toFixed(1)}" font-style="italic" fill="${C.text}">${esc(name)}</text>`; return; }
          if (c.startsWith('line2:')) h += `<line x1="${sx.toFixed(1)}" y1="${(ry + shh / 2).toFixed(1)}" x2="${(sx + sw).toFixed(1)}" y2="${(ry + shh / 2).toFixed(1)}" stroke="${C[c.slice(6)]}" stroke-width="${(3.5 * u).toFixed(1)}"/>`;
          else if (c === 'line') h += `<line x1="${sx.toFixed(1)}" y1="${(ry + shh / 2).toFixed(1)}" x2="${(sx + sw).toFixed(1)}" y2="${(ry + shh / 2).toFixed(1)}" stroke="${C.wb}" stroke-width="${(2 * u).toFixed(1)}" stroke-dasharray="${(5 * u).toFixed(1)} ${(3 * u).toFixed(1)}"/>`;
          else h += `<rect x="${sx.toFixed(1)}" y="${ry.toFixed(1)}" width="${sw.toFixed(1)}" height="${shh.toFixed(1)}" fill="${hatch ? 'none' : C[c]}" stroke="${hatch ? C[c] : C.border}" stroke-width="${(hatch ? 2 : .8) * u}"/>`;
          h += `<text x="${(sx + sw + 9 * u).toFixed(1)}" y="${(ry + fs * .9).toFixed(1)}" font-family="Noto Sans, Arial" font-size="${fs.toFixed(1)}" font-weight="500" fill="${C.text}">${esc(name)}</text>`; }); }
    }
    if (h) add('judul-legenda', h); }
  const wrap = body => `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
  return { full: wrap(G.map(([id, b]) => `<g id="${id}">${b}</g>`).join('')), parts: G.map(([id, b], i) => [`${String(i + 1).padStart(2, '0')}-${id}.svg`, wrap(`<g id="${id}">${b}</g>`)]) };
}
function svgLabels(proj, W, H, cam, show, mode, u, C) {
  // memakai canvas tersembunyi untuk ukur & tata letak yang sama, lalu tulis sebagai <text>
  const out = []; const fake = document.createElement('canvas').getContext('2d');
  let pend = null, pts = [];
  const op = () => fake.globalAlpha < .999 ? ` opacity="${fake.globalAlpha.toFixed(2)}"` : '';
  fake.beginPath = () => { pend = null; pts = []; };
  fake.arc = (x, y, r) => { pend = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"`; };
  fake.rect = (x, y, w, h) => { pend = `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"`; };
  fake.moveTo = (x, y) => { pts = [[x, y]]; }; fake.lineTo = (x, y) => { pts.push([x, y]); };
  fake.fill = function () { if (pend) out.push(`${pend} fill="${esc(this.fillStyle)}" stroke="${esc(C.halo)}" stroke-width="${(1.6 * u).toFixed(1)}"${op()}/>`); pend = null; };
  fake.stroke = function () { if (pts.length > 1) out.push(`<polyline points="${pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ')}" fill="none" stroke="${esc(this.strokeStyle)}" stroke-width="${this.lineWidth.toFixed(1)}"${op()}/>`); pts = []; };
  fake.strokeText = () => { };
  fake.fillText = function (s, x, y) { const ar = /[\u0600-\u06FF]/.test(s); const m = this.font.match(/(\d+(?:\.\d+)?)px/); const sz = m ? +m[1] : 16; const wt = /\b700\b/.test(this.font) ? 700 : /\b600\b/.test(this.font) ? 600 : 400; const it = this.font.startsWith('italic');
    const anchor = this.textAlign === 'left' ? 'start' : this.textAlign === 'right' ? 'end' : 'middle';
    out.push(`<text x="${x.toFixed(1)}" y="${(y + sz * .82).toFixed(1)}" font-family="${ar ? 'Noto Naskh Arabic, Arial' : 'Noto Sans, Arial'}" font-size="${sz.toFixed(1)}" font-weight="${wt}"${it ? ' font-style="italic"' : ''} text-anchor="${anchor}" fill="${esc(this.fillStyle)}" stroke="${esc(C.halo)}" stroke-width="${(sz * .22).toFixed(1)}" paint-order="stroke" stroke-linejoin="round"${op()}>${esc(s)}</text>`); };
  fake.canvas.width = W; fake.canvas.height = H;
  drawLabels(fake, proj, W, H, cam, show, mode, u, C);
  return out.join('');
}
$('svgBtn').onclick = () => { const s = buildSVG(); saveFile(fname('svg'), s.full); };
$('zipBtn').onclick = async () => {
  if (!window.JSZip) return toast('Pustaka ZIP gagal dimuat');
  const s = buildSVG(), z = new JSZip(); z.file('00-gabungan.svg', s.full); for (const [n, b] of s.parts) z.file(n, b);
  z.file('BACA.txt', `Semua file berukuran sama (${outWH().join('x')}). Di Canva: unggah semua SVG, tumpuk sesuai urutan nomor (01 paling bawah), set posisi X=0 Y=0 dan ukuran sama dengan kanvas.\nWarna isian dan garis bisa diubah per file.\nData: Natural Earth (domain publik), sudut pandang Palestina. Golan = wilayah Suriah.`);
  saveFile(fname('zip'), await z.generateAsync({ type: 'blob' }));
};
function presetObj() { const [W, H] = frameWH(); return { app: 'studio-peta-palestina48', version: 1, frame: { ratio: S.frame, width: W * S.res, height: H * S.res, fps: S.fps }, projection: S.proj, theme: S.theme, colors: S.colors, layers: S.layers, labelScale: S.labelScale, lineScale: S.lineScale, arabic: S.arabic, labels: S.labels, keyframes: S.keys.map(k => ({ ...k, cam: keyCam(k) })), duration: totalT(), data: 'Natural Earth 10m (POV Palestina) + 50m dunia' }; }
$('presetSave').onclick = () => saveFile(fname('json'), JSON.stringify(presetObj(), null, 2));
$('presetCopy').onclick = async () => { try { await navigator.clipboard.writeText(JSON.stringify(presetObj(), null, 2)); toast('Preset disalin'); } catch (e) { toast('Gagal menyalin'); } };
$('presetLoad').onchange = async e => { const f = e.target.files[0]; if (!f) return; try { const p = JSON.parse(await f.text()); if (p.app !== 'studio-peta-palestina48') throw 0; Object.assign(S, { frame: p.frame.ratio, fps: p.frame.fps, proj: p.projection, theme: p.theme, colors: p.colors, layers: { ...defLayers, ...p.layers }, labelScale: p.labelScale, lineScale: p.lineScale, arabic: p.arabic, labels: p.labels || {}, keys: p.keyframes, sel: 0 }); S.cam = { ...keyCam(S.keys[0]) }; renderPanel(); layout(); renderLblTable(); persist(); toast('Preset dimuat'); } catch (er) { toast('File preset tidak dikenali'); } e.target.value = ''; };

// video: render frame-per-frame dengan WebCodecs, cadangan MediaRecorder
let cancelVid = false;
$('cancelBtn').onclick = () => { cancelVid = true; };
async function pickCodec(W, H, fps) {
  if (!('VideoEncoder' in window)) return null;
  const br = Math.round(W * H * fps * .2);
  if (window.Mp4Muxer) for (const codec of ['avc1.640034', 'avc1.640033', 'avc1.640028', 'avc1.4d0034', 'avc1.42003e']) {
    const cfg = { codec, width: W, height: H, bitrate: br, framerate: fps, avc: { format: 'avc' } };
    try { if ((await VideoEncoder.isConfigSupported(cfg)).supported) return { cfg, kind: 'mp4' }; } catch (e) { }
  }
  if (window.WebMMuxer) for (const codec of ['vp09.00.40.08', 'vp09.00.10.08', 'vp8']) {
    const cfg = { codec, width: W, height: H, bitrate: br, framerate: fps };
    try { if ((await VideoEncoder.isConfigSupported(cfg)).supported) return { cfg, kind: 'webm' }; } catch (e) { }
  }
  return null;
}
$('vidBtn').onclick = async () => {
  const tt = totalT(); if (!tt) return toast('Tambahkan keyframe atau pilih preset dulu');
  const [W, H] = outWH(), fps = S.fps, n = Math.max(1, Math.round(tt * fps));
  stopPlay(); cancelVid = false; $('vidBtn').disabled = true; $('prog').classList.add('on'); $('progBar').value = 0; $('progTxt').textContent = 'Menyiapkan…';
  const c = document.createElement('canvas'); c.width = W; c.height = H; const ctx = c.getContext('2d');
  try {
    const pc = await pickCodec(W, H, fps);
    if (!pc) { await recordRealtime(c, ctx, W, H, fps, tt); return; }
    const muxer = pc.kind === 'mp4'
      ? new Mp4Muxer.Muxer({ target: new Mp4Muxer.ArrayBufferTarget(), video: { codec: 'avc', width: W, height: H, frameRate: fps }, fastStart: 'in-memory' })
      : new WebMMuxer.Muxer({ target: new WebMMuxer.ArrayBufferTarget(), video: { codec: pc.cfg.codec === 'vp8' ? 'V_VP8' : 'V_VP9', width: W, height: H, frameRate: fps } });
    let err = null; const enc = new VideoEncoder({ output: (ch, meta) => muxer.addVideoChunk(ch, meta), error: e => { err = e; } });
    enc.configure(pc.cfg);
    for (let i = 0; i < n; i++) {
      if (cancelVid || err) break;
      const { cam, show } = evalT(Math.min(tt, i / fps));
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); composeFrame(ctx, W, H, cam, show, { transparent: false }, null);
      const vf = new VideoFrame(c, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) });
      enc.encode(vf, { keyFrame: i % (fps * 2) === 0 }); vf.close();
      while (enc.encodeQueueSize > 4) await new Promise(r => setTimeout(r, 2));
      if (i % 3 === 0) { $('progBar').value = i / n; $('progTxt').textContent = `Frame ${i + 1}/${n}`; await new Promise(r => setTimeout(r, 0)); }
    }
    if (err) throw err;
    if (cancelVid) { try { enc.close(); } catch (e) { } toast('Render dibatalkan'); return; }
    $('progTxt').textContent = 'Menyelesaikan…'; await enc.flush(); muxer.finalize();
    const blob = new Blob([muxer.target.buffer], { type: pc.kind === 'mp4' ? 'video/mp4' : 'video/webm' });
    $('progBar').value = 1; $('progTxt').textContent = `Selesai · ${(blob.size / 1048576).toFixed(1)} MB`;
    lastVideo = [fname(pc.kind), blob]; await saveFile(...lastVideo);
  } catch (e) { console.error(e); toast('Render gagal: ' + (e.message || e)); }
  finally { $('vidBtn').disabled = false; setTimeout(() => $('prog').classList.remove('on'), 4000); }
};
let lastVideo = null;
async function recordRealtime(c, ctx, W, H, fps, tt) {
  if (!c.captureStream || !window.MediaRecorder) { toast('Browser ini tidak mendukung perekaman video'); return; }
  const mime = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m)) || '';
  const rec = new MediaRecorder(c.captureStream(fps), { mimeType: mime, videoBitsPerSecond: Math.round(W * H * fps * .2) }), parts = [];
  rec.ondataavailable = e => e.data.size && parts.push(e.data);
  const done = new Promise(r => rec.onstop = r); rec.start();
  const t0 = performance.now(); $('progTxt').textContent = 'Merekam waktu nyata…';
  await new Promise(res => { const step = () => { const t = (performance.now() - t0) / 1000; if (cancelVid || t > tt) return res(); const { cam, show } = evalT(t); ctx.setTransform(1, 0, 0, 1, 0, 0); composeFrame(ctx, W, H, cam, show, { transparent: false }, null); $('progBar').value = t / tt; requestAnimationFrame(step); }; step(); });
  rec.stop(); await done; if (cancelVid) return toast('Rekaman dibatalkan');
  const ext = mime.includes('mp4') ? 'mp4' : 'webm'; const blob = new Blob(parts, { type: mime || 'video/webm' });
  lastVideo = [fname(ext), blob]; await saveFile(...lastVideo);
}
$('vidNote').textContent = ('VideoEncoder' in window) ? 'Video dirender per frame (tidak ada frame hilang). Chrome/Edge menghasilkan MP4; browser lain bisa WebM.' : 'Browser ini merekam secara waktu nyata (WebM). Untuk MP4 per frame gunakan Chrome atau Edge.';

window.__peta = { S: () => S, buildSVG, evalT, totalT, presetObj };
// ============ Mulai ============
new ResizeObserver(layout).observe(stage);
(async () => {
  try {
    const [reg, world, places] = await Promise.all(['data/reg.json', 'data/world.json', 'data/places.json'].map(u => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r.json(); })));
    const rs = buildSet(reg, true), ws = buildSet(world, false);
    const pal48 = tfeat(reg, reg.objects.pal48).features[0], psx = tfeat(reg, reg.objects.psx).features;
    D = { reg: rs, world: ws, pal48, palRing: biggestRing(pal48), gaza: psx.find(f => f.properties.k === 'gaza'), wb: psx.find(f => f.properties.k === 'wb'), golan: tfeat(reg, reg.objects.golan).features[0], hatay: tfeat(reg, reg.objects.hatay).features[0], sinai: tfeat(reg, reg.objects.sinai).features[0] };
    const byK = o => Object.fromEntries(tfeat(reg, reg.objects[o]).features.map(f => [f.properties.k, f]));
    D.oslo = byK('oslo'); D.un = byK('un'); D.sp = byK('sp'); D.g26 = byK('g26');
    LBL = buildLabels(places, ws);
    if (!S.keys.length) { const p = PRESETS[0]; S.keys = p[2](); S.proj = p[1]; S.sel = 1; S.cam = { ...keyCam(S.keys[1]) }; }
    renderPanel(); renderLblTable(); layout();
    try { await Promise.all([document.fonts.load('600 20px "Noto Sans"'), document.fonts.load('italic 400 20px "Noto Sans"'), document.fonts.load('700 20px "Noto Sans"'), document.fonts.load('400 20px "Noto Naskh Arabic"'), document.fonts.load('600 20px "Noto Naskh Arabic"')]); } catch (e) { }
    redraw(); loop();
    document.fonts.ready.then(redraw);
  } catch (e) { console.error(e); $('badge').textContent = 'Gagal memuat data peta'; }
})();
}

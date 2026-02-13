export interface PracticePaper {
  id: string;
  subject: string;
  year: number;
  type: "board" | "specimen" | "practice";
  title: string;
  url: string;
  source: "respaper" | "cisce";
}

const BASE = "https://www.respaper.com";
const CISCE = "https://cisceboard.org/pdf/ICSE-Class-X-Specimen-Question-Papers-2017";

export const PRACTICE_PAPERS: PracticePaper[] = [
  // ── Mathematics ──
  { id: "math_2026_board_1", subject: "math", year: 2026, type: "board", title: "Mathematics Board Exam 2026", url: `${BASE}/diana210110/6095-pdf.html`, source: "respaper" },
  { id: "math_2026_board_2", subject: "math", year: 2026, type: "board", title: "Mathematics Board Exam 2026 (Set 2)", url: `${BASE}/abhijeet2771/2772-pdf.html`, source: "respaper" },
  { id: "math_2026_board_3", subject: "math", year: 2026, type: "board", title: "Mathematics Board Exam 2026 (Set 3)", url: `${BASE}/hema73/1401-pdf.html`, source: "respaper" },
  { id: "math_2025_specimen_1", subject: "math", year: 2025, type: "specimen", title: "Mathematics Specimen Paper 2025", url: `${BASE}/yashsmsslg/7844-pdf.html`, source: "respaper" },
  { id: "math_2025_specimen_2", subject: "math", year: 2025, type: "specimen", title: "Mathematics Specimen Paper 2025 (Set 2)", url: `${BASE}/bhaskargupta/9270-pdf.html`, source: "respaper" },
  { id: "math_2025_practice_1", subject: "math", year: 2025, type: "practice", title: "Mathematics Practice Paper 2025", url: `${BASE}/maitybiswajit884/9211-pdf.html`, source: "respaper" },
  { id: "math_2024_board_1", subject: "math", year: 2024, type: "board", title: "Mathematics Board Exam 2024", url: `${BASE}/qwerty1272768/3817-pdf.html`, source: "respaper" },
  { id: "math_2024_board_2", subject: "math", year: 2024, type: "board", title: "Mathematics Board Exam 2024 (Set 2)", url: `${BASE}/maxi99/947-pdf.html`, source: "respaper" },
  { id: "math_2024_specimen_1", subject: "math", year: 2024, type: "specimen", title: "Mathematics Specimen Paper 2024", url: `${BASE}/dkp2023/5666-pdf.html`, source: "respaper" },
  { id: "math_2023_board_1", subject: "math", year: 2023, type: "board", title: "Mathematics Board Exam 2023", url: `${BASE}/apurvsoni/3514-pdf.html`, source: "respaper" },
  { id: "math_2023_board_2", subject: "math", year: 2023, type: "board", title: "Mathematics Board Exam 2023 (Set 2)", url: `${BASE}/theakshatgypta/9265-pdf.html`, source: "respaper" },
  { id: "math_2023_specimen_1", subject: "math", year: 2023, type: "specimen", title: "Mathematics Specimen Paper 2023", url: `${BASE}/shatr/4273-pdf.html`, source: "respaper" },

  // ── Physics ──
  { id: "physics_2026_board_1", subject: "physics", year: 2026, type: "board", title: "Physics Board Exam 2026", url: `${BASE}/hsgah/6094-pdf.html`, source: "respaper" },
  { id: "physics_2026_board_2", subject: "physics", year: 2026, type: "board", title: "Physics Board Exam 2026 (Set 2)", url: `${BASE}/divya139/4465-pdf.html`, source: "respaper" },
  { id: "physics_2026_specimen_1", subject: "physics", year: 2026, type: "specimen", title: "Physics Specimen Paper 2026", url: `${BASE}/ujaan/730-pdf.html`, source: "respaper" },
  { id: "physics_2025_board_1", subject: "physics", year: 2025, type: "board", title: "Physics Board Exam 2025", url: `${BASE}/wxrst_brutus/7765-pdf.html`, source: "respaper" },
  { id: "physics_2025_board_2", subject: "physics", year: 2025, type: "board", title: "Physics Board Exam 2025 (Set 2)", url: `${BASE}/lunamashiyong/3828-pdf.html`, source: "respaper" },
  { id: "physics_2025_specimen_1", subject: "physics", year: 2025, type: "specimen", title: "Physics Specimen Paper 2025", url: `${BASE}/anany19/9428-pdf.html`, source: "respaper" },
  { id: "physics_2024_board_1", subject: "physics", year: 2024, type: "board", title: "Physics Board Exam 2024", url: `${BASE}/surajit1968/7895-pdf.html`, source: "respaper" },
  { id: "physics_2024_board_2", subject: "physics", year: 2024, type: "board", title: "Physics Board Exam 2024 (Set 2)", url: `${BASE}/sagnik2008/6651-pdf.html`, source: "respaper" },
  { id: "physics_2024_specimen_1", subject: "physics", year: 2024, type: "specimen", title: "Physics Specimen Paper 2024", url: `${BASE}/dtfyfhgdr/9183-pdf.html`, source: "respaper" },
  { id: "physics_2023_board_1", subject: "physics", year: 2023, type: "board", title: "Physics Board Exam 2023", url: `${BASE}/sayanchandra/7767-pdf.html`, source: "respaper" },
  { id: "physics_2023_board_2", subject: "physics", year: 2023, type: "board", title: "Physics Board Exam 2023 (Set 2)", url: `${BASE}/apostle/6466-pdf.html`, source: "respaper" },

  // ── Chemistry ──
  { id: "chemistry_2026_board_1", subject: "chemistry", year: 2026, type: "board", title: "Chemistry Board Exam 2026", url: `${BASE}/gurnoor42/8164-pdf.html`, source: "respaper" },
  { id: "chemistry_2026_board_2", subject: "chemistry", year: 2026, type: "board", title: "Chemistry Board Exam 2026 (Set 2)", url: `${BASE}/hemashree228/1885-pdf.html`, source: "respaper" },
  { id: "chemistry_2025_board_1", subject: "chemistry", year: 2025, type: "board", title: "Chemistry Board Exam 2025", url: `${BASE}/lunamashiyong/8479-pdf.html`, source: "respaper" },
  { id: "chemistry_2025_board_2", subject: "chemistry", year: 2025, type: "board", title: "Chemistry Board Exam 2025 (Set 2)", url: `${BASE}/koustav002/6094-pdf.html`, source: "respaper" },
  { id: "chemistry_2025_practice_1", subject: "chemistry", year: 2025, type: "practice", title: "Chemistry Competency Practice 2025", url: `${BASE}/riyakumar/1004-pdf.html`, source: "respaper" },
  { id: "chemistry_2024_board_1", subject: "chemistry", year: 2024, type: "board", title: "Chemistry Board Exam 2024", url: `${BASE}/surajit1968/7871-pdf.html`, source: "respaper" },
  { id: "chemistry_2024_board_2", subject: "chemistry", year: 2024, type: "board", title: "Chemistry Board Exam 2024 (Set 2)", url: `${BASE}/aarush_2608/9165-pdf.html`, source: "respaper" },
  { id: "chemistry_2023_board_1", subject: "chemistry", year: 2023, type: "board", title: "Chemistry Board Exam 2023", url: `${BASE}/yolo4/6928-pdf.html`, source: "respaper" },
  { id: "chemistry_2023_specimen_1", subject: "chemistry", year: 2023, type: "specimen", title: "Chemistry Specimen Paper 2023", url: `${BASE}/comebackkid/7414-pdf.html`, source: "respaper" },

  // ── Biology ──
  { id: "biology_2026_board_1", subject: "biology", year: 2026, type: "board", title: "Biology Board Exam 2026", url: `${BASE}/ruthekthamminedi/6283-pdf.html`, source: "respaper" },
  { id: "biology_2026_board_2", subject: "biology", year: 2026, type: "board", title: "Biology Board Exam 2026 (Set 2)", url: `${BASE}/gurnoor42/8163-pdf.html`, source: "respaper" },
  { id: "biology_2026_board_3", subject: "biology", year: 2026, type: "board", title: "Biology Board Exam 2026 (Set 3)", url: `${BASE}/hema73/1402-pdf.html`, source: "respaper" },
  { id: "biology_2025_board_1", subject: "biology", year: 2025, type: "board", title: "Biology Board Exam 2025", url: `${BASE}/hemashree228/1884-pdf.html`, source: "respaper" },
  { id: "biology_2025_board_2", subject: "biology", year: 2025, type: "board", title: "Biology Board Exam 2025 (Set 2)", url: `${BASE}/amit2911/5110-pdf.html`, source: "respaper" },
  { id: "biology_2025_practice_1", subject: "biology", year: 2025, type: "practice", title: "Biology Practice Paper 2025", url: `${BASE}/ayushmaancho/5970-pdf.html`, source: "respaper" },
  { id: "biology_2025_board_3", subject: "biology", year: 2025, type: "board", title: "Biology Board Exam 2025 (Set 3)", url: `${BASE}/mahir_shah/9650-pdf.html`, source: "respaper" },
  { id: "biology_2023_board_1", subject: "biology", year: 2023, type: "board", title: "Biology Board Exam 2023", url: `${BASE}/hardik5425/5806-pdf.html`, source: "respaper" },
  { id: "biology_2023_specimen_1", subject: "biology", year: 2023, type: "specimen", title: "Biology Specimen Paper 2023", url: `${BASE}/jyotsana9/5514-pdf.html`, source: "respaper" },

  // ── History & Civics ──
  { id: "history_2026_board_1", subject: "history", year: 2026, type: "board", title: "History & Civics Board Exam 2026", url: `${BASE}/hema73/1403-pdf.html`, source: "respaper" },
  { id: "history_2026_board_2", subject: "history", year: 2026, type: "board", title: "History & Civics Board Exam 2026 (Set 2)", url: `${BASE}/aarav49/7601-pdf.html`, source: "respaper" },
  { id: "history_2025_board_1", subject: "history", year: 2025, type: "board", title: "History & Civics Board Exam 2025", url: `${BASE}/devik_10/6395-pdf.html`, source: "respaper" },
  { id: "history_2024_board_1", subject: "history", year: 2024, type: "board", title: "History & Civics Board Exam 2024", url: `${BASE}/surajit1968/4754-pdf.html`, source: "respaper" },
  { id: "history_2024_board_2", subject: "history", year: 2024, type: "board", title: "History & Civics Board Exam 2024 (Set 2)", url: `${BASE}/ayushsaha12/368-pdf.html`, source: "respaper" },
  { id: "history_2024_specimen_1", subject: "history", year: 2024, type: "specimen", title: "History & Civics Specimen Paper 2024", url: `${BASE}/punith21/7933-pdf.html`, source: "respaper" },
  { id: "history_2023_board_1", subject: "history", year: 2023, type: "board", title: "History & Civics Board Exam 2023", url: `${BASE}/sirdksaraf/2072-pdf.html`, source: "respaper" },
  { id: "history_2023_board_2", subject: "history", year: 2023, type: "board", title: "History & Civics Board Exam 2023 (Set 2)", url: `${BASE}/aryan_7/5417-pdf.html`, source: "respaper" },

  // ── Geography ──
  { id: "geography_2026_board_1", subject: "geography", year: 2026, type: "board", title: "Geography Board Exam 2026", url: `${BASE}/matke1234/3956-pdf.html`, source: "respaper" },
  { id: "geography_2025_board_1", subject: "geography", year: 2025, type: "board", title: "Geography Board Exam 2025", url: `${BASE}/aslitopper/8280-pdf.html`, source: "respaper" },
  { id: "geography_2025_board_2", subject: "geography", year: 2025, type: "board", title: "Geography Board Exam 2025 (Set 2)", url: `${BASE}/mithun10/993-pdf.html`, source: "respaper" },
  { id: "geography_2025_specimen_1", subject: "geography", year: 2025, type: "specimen", title: "Geography Specimen Paper 2025", url: `${BASE}/advay2610/829-pdf.html`, source: "respaper" },
  { id: "geography_2024_board_1", subject: "geography", year: 2024, type: "board", title: "Geography Board Exam 2024", url: `${BASE}/anikam/9132-pdf.html`, source: "respaper" },
  { id: "geography_2024_board_2", subject: "geography", year: 2024, type: "board", title: "Geography Board Exam 2024 (Set 2)", url: `${BASE}/meghattay/6783-pdf.html`, source: "respaper" },
  { id: "geography_2024_specimen_1", subject: "geography", year: 2024, type: "specimen", title: "Geography Specimen Paper 2024", url: `${BASE}/unknownperson1234442131/8446-pdf.html`, source: "respaper" },
  { id: "geography_2023_board_1", subject: "geography", year: 2023, type: "board", title: "Geography Board Exam 2023", url: `${BASE}/sirdksaraf/3112-pdf.html`, source: "respaper" },
  { id: "geography_2023_board_2", subject: "geography", year: 2023, type: "board", title: "Geography Board Exam 2023 (Set 2)", url: `${BASE}/nakul85/2956-pdf.html`, source: "respaper" },

  // ── English Language ──
  { id: "english_lang_2026_board_1", subject: "english_lang", year: 2026, type: "board", title: "English Language Board Exam 2026", url: `${BASE}/nitinkaria/2252-pdf.html`, source: "respaper" },
  { id: "english_lang_2025_board_1", subject: "english_lang", year: 2025, type: "board", title: "English Language Board Exam 2025", url: `${BASE}/resaccpract/6781-pdf.html`, source: "respaper" },
  { id: "english_lang_2024_board_1", subject: "english_lang", year: 2024, type: "board", title: "English Language Board Exam 2024", url: `${BASE}/ewar45607/1689-pdf.html`, source: "respaper" },
  { id: "english_lang_2023_board_1", subject: "english_lang", year: 2023, type: "board", title: "English Language Board Exam 2023", url: `${BASE}/apostle/6466-pdf.html`, source: "respaper" },

  // ── English Literature ──
  { id: "english_lit_2026_board_1", subject: "english_lit", year: 2026, type: "board", title: "English Literature Board Exam 2026", url: `${BASE}/abirsengupta/1884-pdf.html`, source: "respaper" },
  { id: "english_lit_2025_board_1", subject: "english_lit", year: 2025, type: "board", title: "English Literature Board Exam 2025", url: `${BASE}/abcd3236/6042-pdf.html`, source: "respaper" },
  { id: "english_lit_2025_specimen_1", subject: "english_lit", year: 2025, type: "specimen", title: "English Literature Specimen Paper 2025", url: `${BASE}/dhivya1983/7975-pdf.html`, source: "respaper" },
  { id: "english_lit_2024_board_1", subject: "english_lit", year: 2024, type: "board", title: "English Literature Board Exam 2024", url: `${BASE}/logiuse5677/768/4253-pdf.html`, source: "respaper" },
  { id: "english_lit_2023_board_1", subject: "english_lit", year: 2023, type: "board", title: "English Literature Board Exam 2023", url: `${BASE}/sayanchandra/7767-pdf.html`, source: "respaper" },

  // ── Hindi ──
  { id: "hindi_2025_board_1", subject: "hindi", year: 2025, type: "board", title: "Hindi Board Exam 2025", url: `${BASE}/dishes4u/9091-pdf.html`, source: "respaper" },
  { id: "hindi_2024_board_1", subject: "hindi", year: 2024, type: "board", title: "Hindi Board Exam 2024", url: `${BASE}/abhaybro9693/3121-pdf.html`, source: "respaper" },
  { id: "hindi_2023_board_1", subject: "hindi", year: 2023, type: "board", title: "Hindi Board Exam 2023", url: `${BASE}/livotneyuueh/1002-pdf.html`, source: "respaper" },

  // ── Computer Applications ──
  { id: "computer_2026_board_1", subject: "computer", year: 2026, type: "board", title: "Computer Applications Board Exam 2026", url: `${BASE}/kounil/4377-pdf.html`, source: "respaper" },
  { id: "computer_2025_board_1", subject: "computer", year: 2025, type: "board", title: "Computer Applications Board Exam 2025", url: `${BASE}/dev_009/835-pdf.html`, source: "respaper" },
  { id: "computer_2025_specimen_1", subject: "computer", year: 2025, type: "specimen", title: "Computer Applications Specimen 2025", url: `${BASE}/promaicse/6190-pdf.html`, source: "respaper" },
  { id: "computer_2025_practice_1", subject: "computer", year: 2025, type: "practice", title: "Computer Applications Practice 2025", url: `${BASE}/sweta12379/777-pdf.html`, source: "respaper" },
  { id: "computer_2024_board_1", subject: "computer", year: 2024, type: "board", title: "Computer Applications Board Exam 2024", url: `${BASE}/aarush_2608/9166-pdf.html`, source: "respaper" },
  { id: "computer_2024_specimen_1", subject: "computer", year: 2024, type: "specimen", title: "Computer Applications Specimen 2024", url: `${BASE}/breh57/1307-pdf.html`, source: "respaper" },
  { id: "computer_2023_board_1", subject: "computer", year: 2023, type: "board", title: "Computer Applications Board Exam 2023", url: `${BASE}/shubhadeep385/27/7568-pdf.html`, source: "respaper" },
  { id: "computer_2023_specimen_1", subject: "computer", year: 2023, type: "specimen", title: "Computer Applications Specimen 2023", url: `${BASE}/jwiiick88/6348-pdf.html`, source: "respaper" },

  // ── Commercial Studies ──
  { id: "commercial_2026_board_1", subject: "commercial", year: 2026, type: "board", title: "Commercial Studies Board Exam 2026", url: `${BASE}/kiunil/1524-pdf.html`, source: "respaper" },
  { id: "commercial_2025_board_1", subject: "commercial", year: 2025, type: "board", title: "Commercial Studies Board Exam 2025", url: `${BASE}/prince_paulthelearner/5641-pdf.html`, source: "respaper" },
  { id: "commercial_2023_board_1", subject: "commercial", year: 2023, type: "board", title: "Commercial Studies Board Exam 2023", url: `${BASE}/sirdksaraf/7899-pdf.html`, source: "respaper" },

  // ── Economics ──
  { id: "economics_2024_board_1", subject: "economics", year: 2024, type: "board", title: "Economics Board Exam 2024", url: `${BASE}/logiuse5677/768/5129-pdf.html`, source: "respaper" },
  { id: "economics_2023_board_1", subject: "economics", year: 2023, type: "board", title: "Economics Board Exam 2023", url: `${BASE}/sirdksaraf/2072-pdf.html`, source: "respaper" },

  // ── Environmental Science ──
  { id: "env_science_2024_board_1", subject: "env_science", year: 2024, type: "board", title: "Environmental Science Board Exam 2024", url: `${BASE}/meghattay/9344-pdf.html`, source: "respaper" },

  // ── Physical Education ──
  { id: "physical_ed_2024_board_1", subject: "physical_ed", year: 2024, type: "board", title: "Physical Education Board Exam 2024", url: `${BASE}/samriddh2909/7716-pdf.html`, source: "respaper" },

  // ── CISCE Specimen Papers 2017 ──
  { id: "english_lang_2017_specimen_1", subject: "english_lang", year: 2017, type: "specimen", title: "English Language Specimen Paper 2017", url: `${CISCE}/English%20Language%20(English%20Paper%20-%201).pdf`, source: "cisce" },
  { id: "english_lit_2017_specimen_1", subject: "english_lit", year: 2017, type: "specimen", title: "English Literature Specimen Paper 2017", url: `${CISCE}/Literature%20in%20English%20(English%20Paper%20-%202).pdf`, source: "cisce" },
  { id: "hindi_2017_specimen_1", subject: "hindi", year: 2017, type: "specimen", title: "Hindi Specimen Paper 2017", url: `${CISCE}/Hindi.pdf`, source: "cisce" },
  { id: "sanskrit_2017_specimen_1", subject: "sanskrit", year: 2017, type: "specimen", title: "Sanskrit Specimen Paper 2017", url: `${CISCE}/Sanskrit.pdf`, source: "cisce" },
  { id: "french_2017_specimen_1", subject: "french", year: 2017, type: "specimen", title: "French Specimen Paper 2017", url: `${CISCE}/French%20(Group%201).pdf`, source: "cisce" },
  { id: "german_2017_specimen_1", subject: "german", year: 2017, type: "specimen", title: "German Specimen Paper 2017", url: `${CISCE}/German%20(Group%201).pdf`, source: "cisce" },
  { id: "history_2017_specimen_1", subject: "history", year: 2017, type: "specimen", title: "History & Civics Specimen Paper 2017", url: `${CISCE}/History_Civics(HCG%20Paper-1)-2014.pdf`, source: "cisce" },
  { id: "geography_2017_specimen_1", subject: "geography", year: 2017, type: "specimen", title: "Geography Specimen Paper 2017", url: `${CISCE}/Geography%20(HCG%20Paper%20-%202).pdf`, source: "cisce" },
  { id: "math_2017_specimen_1", subject: "math", year: 2017, type: "specimen", title: "Mathematics Specimen Paper 2017", url: `${CISCE}/Mathematics.pdf`, source: "cisce" },
  { id: "physics_2017_specimen_1", subject: "physics", year: 2017, type: "specimen", title: "Physics Specimen Paper 2017", url: `${CISCE}/Physics%20(Science%20Paper%20-%201).pdf`, source: "cisce" },
  { id: "chemistry_2017_specimen_1", subject: "chemistry", year: 2017, type: "specimen", title: "Chemistry Specimen Paper 2017", url: `${CISCE}/Chemistry%20(Science%20Paper%202).pdf`, source: "cisce" },
  { id: "biology_2017_specimen_1", subject: "biology", year: 2017, type: "specimen", title: "Biology Specimen Paper 2017", url: `${CISCE}/Biology%20(Science%20Paper%203).pdf`, source: "cisce" },
  { id: "economics_2017_specimen_1", subject: "economics", year: 2017, type: "specimen", title: "Economics Specimen Paper 2017", url: `${CISCE}/Economics.pdf`, source: "cisce" },
  { id: "commercial_2017_specimen_1", subject: "commercial", year: 2017, type: "specimen", title: "Commercial Studies Specimen Paper 2017", url: `${CISCE}/Commercial%20Studies.pdf`, source: "cisce" },
  { id: "env_science_2017_specimen_1", subject: "env_science", year: 2017, type: "specimen", title: "Environmental Science Specimen Paper 2017", url: `${CISCE}/Environmental%20Science.pdf`, source: "cisce" },
  { id: "computer_2017_specimen_1", subject: "computer", year: 2017, type: "specimen", title: "Computer Applications Specimen Paper 2017", url: `${CISCE}/Computer%20Applications.pdf`, source: "cisce" },
  { id: "physical_ed_2017_specimen_1", subject: "physical_ed", year: 2017, type: "specimen", title: "Physical Education Specimen Paper 2017", url: `${CISCE}/Physical%20Education.pdf`, source: "cisce" },
  { id: "home_science_2017_specimen_1", subject: "home_science", year: 2017, type: "specimen", title: "Home Science Specimen Paper 2017", url: `${CISCE}/Home%20Science%20(Revised).pdf`, source: "cisce" },
  { id: "fashion_2017_specimen_1", subject: "fashion", year: 2017, type: "specimen", title: "Fashion Designing Specimen Paper 2017", url: `${CISCE}/Fashion%20Designing.pdf`, source: "cisce" },
  { id: "cookery_2017_specimen_1", subject: "cookery", year: 2017, type: "specimen", title: "Cookery Specimen Paper 2017", url: `${CISCE}/Cookery.pdf`, source: "cisce" },
  { id: "bengali_2017_specimen_1", subject: "bengali", year: 2017, type: "specimen", title: "Bengali Specimen Paper 2017", url: `${CISCE}/Bengali.pdf`, source: "cisce" },
  { id: "kannada_2017_specimen_1", subject: "kannada", year: 2017, type: "specimen", title: "Kannada Specimen Paper 2017", url: `${CISCE}/Kannada.pdf`, source: "cisce" },
  { id: "malayalam_2017_specimen_1", subject: "malayalam", year: 2017, type: "specimen", title: "Malayalam Specimen Paper 2017", url: `${CISCE}/Malyalam.pdf`, source: "cisce" },
  { id: "punjabi_2017_specimen_1", subject: "punjabi", year: 2017, type: "specimen", title: "Punjabi Specimen Paper 2017", url: `${CISCE}/Punjabi.pdf`, source: "cisce" },
];

/** Get papers filtered to a set of subject keys */
export function getPapersForSubjects(subjectKeys: string[]): PracticePaper[] {
  return PRACTICE_PAPERS.filter((p) => subjectKeys.includes(p.subject));
}

/** Get distinct years available across all papers */
export function getAvailableYears(): number[] {
  const years = new Set(PRACTICE_PAPERS.map((p) => p.year));
  return Array.from(years).sort((a, b) => b - a);
}

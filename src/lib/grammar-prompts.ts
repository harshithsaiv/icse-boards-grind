// Grammar drill prompt templates + response parser for ICSE Class X Board Exam - English Paper 1 (Language)

export interface GrammarCategory {
  id: string;
  label: string;
  description: string;
}

export const GRAMMAR_CATEGORIES: GrammarCategory[] = [
  { id: "tenses", label: "Tenses", description: "Past, present, future and their forms" },
  { id: "voice", label: "Active & Passive Voice", description: "Transform between active and passive" },
  { id: "speech", label: "Direct & Indirect Speech", description: "Reported speech transformations" },
  { id: "prepositions", label: "Prepositions", description: "Fill in correct prepositions" },
  { id: "transformation", label: "Sentence Transformation", description: "Rewrite sentences as directed" },
];

export function getGrammarPrompt(categoryId: string): string {
  const prompts: Record<string, string> = {
    tenses: `You are an ICSE English grammar teacher preparing students for the ICSE Class X Board Exam (English Paper 1 - Language). Generate ONE multiple-choice question testing knowledge of English tenses (simple, continuous, perfect, perfect continuous — past, present, or future).

Rules:
- The question MUST follow the ICSE Board exam pattern and difficulty level
- Use contexts and vocabulary appropriate for ICSE Class 10 students
- Focus on practical usage as tested in ICSE English Paper 1
- Provide exactly 4 options labelled A, B, C, D
- Only ONE option should be correct
- Include a brief explanation of why the correct answer is right

You MUST respond in EXACTLY this format (no extra text before or after):
QUESTION: [Your question here]
A: [Option A]
B: [Option B]
C: [Option C]
D: [Option D]
CORRECT: [A, B, C, or D]
EXPLANATION: [Brief explanation]`,

    voice: `You are an ICSE English grammar teacher preparing students for the ICSE Class X Board Exam (English Paper 1 - Language). Generate ONE multiple-choice question testing active and passive voice transformation.

Rules:
- Give a sentence and ask for its correct transformation (active to passive or passive to active)
- The question MUST follow the ICSE Board exam pattern and style
- Use sentence structures commonly tested in ICSE English Paper 1
- Focus on proper auxiliary verb usage, tense consistency, and by-phrase placement
- Provide exactly 4 options labelled A, B, C, D
- Only ONE option should be correct
- Include a brief explanation

You MUST respond in EXACTLY this format (no extra text before or after):
QUESTION: [Your question here]
A: [Option A]
B: [Option B]
C: [Option C]
D: [Option D]
CORRECT: [A, B, C, or D]
EXPLANATION: [Brief explanation]`,

    speech: `You are an ICSE English grammar teacher preparing students for the ICSE Class X Board Exam (English Paper 1 - Language). Generate ONE multiple-choice question testing direct and indirect (reported) speech transformation.

Rules:
- Give a sentence in direct speech and ask for its indirect speech form (or vice versa)
- The question MUST follow the ICSE Board exam pattern and difficulty level
- Use reporting verbs (said, told, asked, etc.) as tested in ICSE exams
- Include proper tense backshifting, pronoun changes, time/place adverb shifts
- Test common ICSE exam patterns: statements, questions, commands, exclamations
- Provide exactly 4 options labelled A, B, C, D
- Only ONE option should be correct
- Include a brief explanation covering tense changes, pronoun shifts, etc.

You MUST respond in EXACTLY this format (no extra text before or after):
QUESTION: [Your question here]
A: [Option A]
B: [Option B]
C: [Option C]
D: [Option D]
CORRECT: [A, B, C, or D]
EXPLANATION: [Brief explanation]`,

    prepositions: `You are an ICSE English grammar teacher preparing students for the ICSE Class X Board Exam (English Paper 1 - Language). Generate ONE multiple-choice question testing the correct use of prepositions in a sentence.

Rules:
- Provide a sentence with a blank where a preposition should go
- The question MUST follow the ICSE Board exam pattern
- Focus on commonly tested prepositional usage in ICSE exams (time, place, direction, agency, etc.)
- Test idiomatic prepositional phrases as per ICSE syllabus
- Use age-appropriate vocabulary and contexts for Class 10 students
- Provide exactly 4 preposition options labelled A, B, C, D
- Only ONE option should be correct
- Include a brief explanation

You MUST respond in EXACTLY this format (no extra text before or after):
QUESTION: [Your question here]
A: [Option A]
B: [Option B]
C: [Option C]
D: [Option D]
CORRECT: [A, B, C, or D]
EXPLANATION: [Brief explanation]`,

    transformation: `You are an ICSE English grammar teacher preparing students for the ICSE Class X Board Exam (English Paper 1 - Language). Generate ONE multiple-choice question on sentence transformation (e.g., change to negative, interrogative, exclamatory, use 'too...to/so...that', begin with a given word, rewrite using 'unless', 'as soon as', etc.).

Rules:
- Give a sentence and a specific instruction for transformation
- The question MUST follow the ICSE Board exam pattern and transformation types
- Focus on transformations commonly tested in ICSE exams: negative/affirmative, interrogative, exclamatory, conditional sentences, complex/compound/simple, degrees of comparison, too...to/so...that, barely/scarcely/hardly, etc.
- Ensure the meaning remains unchanged after transformation
- Test grammatical accuracy and understanding of sentence structure
- Provide exactly 4 options labelled A, B, C, D
- Only ONE option should be correct
- Include a brief explanation

You MUST respond in EXACTLY this format (no extra text before or after):
QUESTION: [Your question here]
A: [Option A]
B: [Option B]
C: [Option C]
D: [Option D]
CORRECT: [A, B, C, or D]
EXPLANATION: [Brief explanation]`,
  };

  return prompts[categoryId] || prompts.tenses;
}

export interface ParsedGrammarQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function parseGrammarResponse(text: string): ParsedGrammarQuestion | null {
  try {
    const questionMatch = text.match(/QUESTION:\s*([\s\S]+?)(?=\nA:)/);
    const optionA = text.match(/A:\s*([\s\S]+?)(?=\nB:)/);
    const optionB = text.match(/B:\s*([\s\S]+?)(?=\nC:)/);
    const optionC = text.match(/C:\s*([\s\S]+?)(?=\nD:)/);
    const optionD = text.match(/D:\s*([\s\S]+?)(?=\nCORRECT:)/);
    const correctMatch = text.match(/CORRECT:\s*([A-D])/);
    const explanationMatch = text.match(/EXPLANATION:\s*([\s\S]+)/);

    if (!questionMatch || !optionA || !optionB || !optionC || !optionD || !correctMatch) {
      return null;
    }

    const correctLetter = correctMatch[1].trim();
    const correctIndex = ["A", "B", "C", "D"].indexOf(correctLetter);

    return {
      question: questionMatch[1].trim(),
      options: [
        optionA[1].trim(),
        optionB[1].trim(),
        optionC[1].trim(),
        optionD[1].trim(),
      ],
      correctIndex,
      explanation: explanationMatch ? explanationMatch[1].trim() : "No explanation provided.",
    };
  } catch {
    return null;
  }
}

interface TranslatedContent {
  title: string;
  content: string;
}

interface Philosopher {
  id: string;
  english: TranslatedContent;
  hebrew: TranslatedContent;
  relevant_terms: string[];
}

interface School {
  id: string;
  english: TranslatedContent;
  hebrew: TranslatedContent;
}

declare module '@/translated_philosophers.json' {
  const value: Philosopher[];
  export default value;
}

declare module '@/translated_schools.json' {
  const value: School[];
  export default value;
}

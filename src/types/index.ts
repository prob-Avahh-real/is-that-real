export type Verdict = 'true' | 'false' | 'mixed' | 'uncertain';

export interface FactCheckResult {
  id: string;
  query: string;
  verdict: Verdict;
  confidence: number; // 0-100
  reasoning: string;
  sources: string[];
  timestamp: number;
}

export type RootStackParamList = {
  Home: undefined;
  Result: { result: FactCheckResult };
  History: undefined;
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FactCheckResult } from '../types';

const HISTORY_KEY = 'fact_check_history';

export async function saveResult(result: FactCheckResult): Promise<void> {
  const history = await getHistory();
  history.unshift(result);
  const trimmed = history.slice(0, 100);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export async function getHistory(): Promise<FactCheckResult[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const history = await getHistory();
  const filtered = history.filter(item => item.id !== id);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

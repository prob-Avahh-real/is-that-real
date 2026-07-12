import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveResult,
  getHistory,
  clearHistory,
  deleteHistoryItem,
} from '../src/services/storage';
import { FactCheckResult } from '../src/types';

jest.mock('@react-native-async-storage/async-storage');

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const sampleResult: FactCheckResult = {
  id: 'abc123',
  query: 'Is water wet?',
  verdict: 'true',
  confidence: 88,
  reasoning: 'Water is wet because of its properties.',
  sources: ['Source X'],
  timestamp: 1,
};

describe('storage service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns empty history when storage is empty', async () => {
    mockedStorage.getItem.mockResolvedValue(null);
    await expect(getHistory()).resolves.toEqual([]);
  });

  it('returns parsed history when JSON exists', async () => {
    mockedStorage.getItem.mockResolvedValue(JSON.stringify([sampleResult]));
    await expect(getHistory()).resolves.toEqual([sampleResult]);
  });

  it('returns empty history when storage contains invalid JSON', async () => {
    mockedStorage.getItem.mockResolvedValue('not-json');
    await expect(getHistory()).resolves.toEqual([]);
  });

  it('saves a new result and trims history to 100 entries', async () => {
    const existing = Array.from({ length: 100 }, (_, i) => ({
      ...sampleResult,
      id: `item-${i}`,
      query: `Query ${i}`,
      timestamp: i + 1,
    }));

    mockedStorage.getItem.mockResolvedValue(JSON.stringify(existing));
    await saveResult(sampleResult);

    expect(mockedStorage.setItem).toHaveBeenCalledTimes(1);
    const saved = JSON.parse(mockedStorage.setItem.mock.calls[0][1] as string);
    expect(saved).toHaveLength(100);
    expect(saved[0].query).toBe('Is water wet?');
  });

  it('deletes a history item by id', async () => {
    mockedStorage.getItem.mockResolvedValue(JSON.stringify([sampleResult]));
    await deleteHistoryItem('abc123');

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      'fact_check_history',
      JSON.stringify([])
    );
  });

  it('clears history', async () => {
    await clearHistory();
    expect(mockedStorage.removeItem).toHaveBeenCalledWith('fact_check_history');
  });
});

import { factCheck, getApiKey, setApiKey } from '../src/services/api';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('api service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (globalThis as any).fetch = jest.fn();
  });

  it('throws when API key is missing', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue(null);

    await expect(factCheck('Is the sky blue?')).rejects.toThrow(
      'Please set the DeepSeek API key first.'
    );
  });

  it('parses a valid JSON response and returns a fact check result', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue('test-key');

    ((globalThis as any).fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '{"verdict":"true","confidence":92,"reasoning":"The claim is supported by evidence.","sources":["Source A"]}'
            },
          },
        ],
      }),
    });

    const result = await factCheck('Is the Eiffel Tower in Paris?');

    expect(result.query).toBe('Is the Eiffel Tower in Paris?');
    expect(result.verdict).toBe('true');
    expect(result.confidence).toBe(92);
    expect(result.reasoning).toContain('supported by evidence');
    expect(result.sources).toEqual(['Source A']);
    expect(result.id).toBeDefined();
  });

  it('handles responses wrapped in markdown code fences', async () => {
    mockedSecureStore.getItemAsync.mockResolvedValue('test-key');

    ((globalThis as any).fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '```json\n{"verdict":"mixed","confidence":65,"reasoning":"Some parts are correct.","sources":["Source B"]}\n```'
            },
          },
        ],
      }),
    });

    const result = await factCheck('Do cats sleep a lot?');

    expect(result.verdict).toBe('mixed');
    expect(result.confidence).toBe(65);
    expect(result.sources).toEqual(['Source B']);
  });
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FactCheckResult, Verdict } from '../types';
import { Colors } from '../theme/colors';

const VERDICT_SHORT: Record<Verdict, { emoji: string; color: string }> = {
  true: { emoji: '✅', color: Colors.true },
  false: { emoji: '❌', color: Colors.false },
  mixed: { emoji: '⚠️', color: Colors.mixed },
  uncertain: { emoji: '🤔', color: Colors.uncertain },
};

interface Props {
  item: FactCheckResult;
  onPress: () => void;
  onDelete: () => void;
}

export function HistoryItem({ item, onPress, onDelete }: Props) {
  const { emoji, color } = VERDICT_SHORT[item.verdict];
  const date = new Date(item.timestamp);
  const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.content}>
          <Text style={styles.query} numberOfLines={1}>
            {item.query}
          </Text>
          <Text style={styles.meta}>{timeStr} · Confidence {item.confidence}%</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onDelete} hitSlop={8}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgCard,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  emoji: {
    fontSize: 22,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  query: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: 3,
  },
  meta: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  delete: {
    fontSize: 16,
    color: Colors.textMuted,
    padding: 4,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FactCheckResult, Verdict } from '../types';
import { Colors } from '../theme/colors';

const VERDICT_LABELS: Record<Verdict, string> = {
  true: '✅ True',
  false: '❌ False',
  mixed: '⚠️ Partially True',
  uncertain: '🤔 Uncertain',
};

interface Props {
  result: FactCheckResult;
}

export function FactCheckCard({ result }: Props) {
  const color = Colors[result.verdict];
  const label = VERDICT_LABELS[result.verdict];

  return (
    <View style={styles.card}>
      {/* Verdict badge */}
      <View style={[styles.verdictBadge, { backgroundColor: color + '20', borderColor: color }]}>
        <Text style={[styles.verdictText, { color }]}>{label}</Text>
        <Text style={[styles.confidence, { color }]}>
          置信度 {result.confidence}%
        </Text>
      </View>

      {/* Confidence bar */}
      <View style={styles.confidenceBar}>
        <View
          style={[
            styles.confidenceFill,
            { width: `${result.confidence}%`, backgroundColor: color },
          ]}
        />
      </View>

      {/* Reasoning */}
      <Text style={styles.sectionTitle}>Analysis</Text>
      <Text style={styles.reasoning}>{result.reasoning}</Text>

      {/* Sources */}
      {result.sources.length > 0 && (
        <View style={styles.sourcesSection}>
          <Text style={styles.sectionTitle}>Sources</Text>
          {result.sources.map((s, i) => (
            <Text key={i} style={styles.sourceItem}>
              • {s}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  verdictBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  verdictText: {
    fontSize: 20,
    fontWeight: '700',
  },
  confidence: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceBar: {
    height: 4,
    backgroundColor: Colors.bgInput,
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reasoning: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 16,
  },
  sourcesSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  sourceItem: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
});

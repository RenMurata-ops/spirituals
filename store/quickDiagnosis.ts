// 10秒診断用 Zustand ストア
import { create } from 'zustand';
import type { AgeGroup, Gender, QuickDiagnosisState } from '../types/diagnosis';

interface QuickDiagnosisStore extends QuickDiagnosisState {}

export const useQuickDiagnosisStore = create<QuickDiagnosisStore>((set) => ({
  // 初期状態
  step: 0,
  answers: {},
  attributes: {
    ageGroup: null,
    gender: null,
    occupation: '',
  },

  // 回答を設定
  setAnswer: (questionId: string, value: boolean) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: value,
      },
    })),

  // 属性を設定
  setAttribute: <K extends keyof QuickDiagnosisState['attributes']>(
    key: K,
    value: QuickDiagnosisState['attributes'][K]
  ) =>
    set((state) => ({
      attributes: {
        ...state.attributes,
        [key]: value,
      },
    })),

  // 次のステップへ
  nextStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),

  // リセット
  reset: () =>
    set({
      step: 0,
      answers: {},
      attributes: {
        ageGroup: null,
        gender: null,
        occupation: '',
      },
    }),
}));

// セレクター
export const selectQuickStep = (state: QuickDiagnosisStore) => state.step;
export const selectQuickAnswers = (state: QuickDiagnosisStore) => state.answers;
export const selectQuickAttributes = (state: QuickDiagnosisStore) => state.attributes;

// 全回答完了チェック
export const selectIsQuickComplete = (state: QuickDiagnosisStore) => {
  const { answers } = state;
  return ['q1', 'q2', 'q3', 'q4', 'q5'].every((id) => id in answers);
};

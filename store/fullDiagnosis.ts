// 無料診断用 Zustand ストア
import { create } from 'zustand';
import type { FullDiagnosisState } from '../types/diagnosis';

interface FullDiagnosisStore extends FullDiagnosisState {}

// 画面ごとの質問数（20問を5画面に分割）
const QUESTIONS_PER_SCREEN = 4;
const TOTAL_SCREENS = 5;

export const useFullDiagnosisStore = create<FullDiagnosisStore>((set) => ({
  // 初期状態
  currentScreen: 1,
  answers: {},

  // 回答を設定（1-5のリッカート尺度）
  setAnswer: (questionId: string, value: number) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: Math.min(5, Math.max(1, value)), // 1-5に制限
      },
    })),

  // 次の画面へ
  nextScreen: () =>
    set((state) => ({
      currentScreen: Math.min(state.currentScreen + 1, TOTAL_SCREENS),
    })),

  // 前の画面へ
  prevScreen: () =>
    set((state) => ({
      currentScreen: Math.max(state.currentScreen - 1, 1),
    })),

  // リセット
  reset: () =>
    set({
      currentScreen: 1,
      answers: {},
    }),
}));

// セレクター
export const selectCurrentScreen = (state: FullDiagnosisStore) => state.currentScreen;
export const selectFullAnswers = (state: FullDiagnosisStore) => state.answers;

// 現在の画面の質問IDリストを取得
export const selectCurrentQuestionIds = (state: FullDiagnosisStore): string[] => {
  const startIndex = (state.currentScreen - 1) * QUESTIONS_PER_SCREEN;
  return Array.from(
    { length: QUESTIONS_PER_SCREEN },
    (_, i) => `q${startIndex + i + 1}`
  );
};

// 現在の画面が完了しているか
export const selectIsCurrentScreenComplete = (state: FullDiagnosisStore): boolean => {
  const questionIds = selectCurrentQuestionIds(state);
  return questionIds.every((id) => id in state.answers);
};

// 全回答完了チェック
export const selectIsFullComplete = (state: FullDiagnosisStore): boolean => {
  const { answers } = state;
  return Array.from({ length: 20 }, (_, i) => `q${i + 1}`).every((id) => id in answers);
};

// 進捗率を取得（0-100）
export const selectProgress = (state: FullDiagnosisStore): number => {
  const answeredCount = Object.keys(state.answers).length;
  return Math.round((answeredCount / 20) * 100);
};

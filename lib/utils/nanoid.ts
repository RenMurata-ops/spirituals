import { customAlphabet } from 'nanoid';

/**
 * シリアル番号生成（6文字、英大文字+数字、紛らわしい文字除外）
 * 除外: O, 0, I, 1
 */
export const generateSerial = customAlphabet(
  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  6
);

/**
 * トークン生成（32文字、英数字）
 */
export const generateToken = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  32
);

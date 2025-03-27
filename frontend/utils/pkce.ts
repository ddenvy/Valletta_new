/**
 * Утилиты для работы с PKCE (Proof Key for Code Exchange)
 * Реализация в соответствии с RFC 7636
 */

// Генерирует случайную строку указанной длины
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  
  // Используем Web Crypto API для генерации случайных чисел
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  
  return result;
}

// Кодирует строку в base64url формат (без padding)
function base64UrlEncode(str: string): string {
  // Преобразуем строку в массив байтов
  const bytes = new TextEncoder().encode(str);
  
  // Преобразуем массив байтов в base64
  const base64 = btoa(String.fromCharCode(...bytes));
  
  // Заменяем символы, которые не разрешены в URL
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Генерирует code_verifier - случайная строка длиной от 43 до 128 символов
export function generateCodeVerifier(length: number = 64): string {
  return generateRandomString(length);
}

// Генерирует code_challenge из code_verifier с использованием SHA-256
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  // Преобразуем code_verifier в массив байтов
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  
  // Вычисляем SHA-256 хеш
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  // Преобразуем хеш в base64url строку
  const hashArray = Array.from(new Uint8Array(hash));
  const hashString = String.fromCharCode(...hashArray);
  
  return base64UrlEncode(hashString);
}

// Синхронная версия generateCodeChallenge для совместимости
export function generateCodeChallengeSync(codeVerifier: string): string {
  // Для браузеров, которые не поддерживают Web Crypto API,
  // можно использовать библиотеку js-sha256
  // Здесь используем упрощенную реализацию для примера
  
  // В реальном приложении следует использовать полноценную реализацию SHA-256
  // например, через библиотеку js-sha256 или crypto-js
  
  // Для простоты примера возвращаем base64url-кодированный code_verifier
  // Это НЕ безопасно для production, но подойдет для демонстрации
  return base64UrlEncode(codeVerifier);
} 
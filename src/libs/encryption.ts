import CryptoJS from "crypto-js";

/**
 * Base64(data:image/png;base64,...) 형식의 문자열을
 * AES-CBC(Pkcs7)로 암호화하여 Base64(IV + 암호문) 반환
 */
export const encryptSignatureBase64 = (base64Image: string): string => {
  const secretKey = import.meta.env.VITE_SIGNATURE_ENCRYPTION_KEY;

  if (!secretKey || secretKey.length !== 32) {
    throw new Error(
      "❌ 환경변수 VITE_SIGNATURE_ENCRYPTION_KEY 없거나 32바이트가 아닙니다.",
    );
  }

  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(base64Image, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const combined = iv.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
};

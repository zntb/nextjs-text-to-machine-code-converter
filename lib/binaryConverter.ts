import { BinaryMode, TextEncoding } from '@/types';

export const textToBinary = (
  text: string,
  encoding: TextEncoding = 'ascii',
): string => {
  if (!text) return '';

  let binary = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (encoding === 'ascii') {
      const charCode = char.charCodeAt(0);
      binary += charCode.toString(2).padStart(8, '0') + ' ';
    } else if (encoding === 'utf8') {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(char);
      for (const byte of bytes) {
        binary += byte.toString(2).padStart(8, '0') + ' ';
      }
    } else if (encoding === 'utf16') {
      const charCode = char.charCodeAt(0);
      binary += charCode.toString(2).padStart(16, '0') + ' ';
    }
  }

  return binary.trim();
};

export const hexToBinary = (hexString: string): string => {
  if (!hexString.trim()) return '';

  return hexString
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      const parts = trimmed.split(': ');
      if (parts.length !== 2) return line;

      const address = parts[0];
      const hexBytes = parts[1];

      const binaryBytes = hexBytes
        .split(' ')
        .map(hex => {
          if (hex.length === 2) {
            return parseInt(hex, 16).toString(2).padStart(8, '0');
          }
          return hex;
        })
        .join(' ');

      return `${address}: ${binaryBytes}`;
    })
    .filter(line => line)
    .join('\n');
};

export const numberToBinary = (input: string): string => {
  if (!input.trim()) return '';

  const lines = input.split('\n');
  return lines
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) {
        const binary = num.toString(2);
        return `${num} (decimal) = ${binary} (binary)`;
      }

      return `"${trimmed}" = ${textToBinary(trimmed)}`;
    })
    .filter(line => line)
    .join('\n');
};

export const convertToBinary = (
  input: string,
  mode: BinaryMode,
  encoding: TextEncoding,
  machineCode?: string,
): string => {
  switch (mode) {
    case 'text':
      return textToBinary(input, encoding);
    case 'machine':
      return hexToBinary(machineCode || '');
    case 'numbers':
      return numberToBinary(input);
    default:
      return '';
  }
};

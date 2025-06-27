import { Architecture, SourceLanguage } from '@/types';

const PATTERNS = {
  'x86-64': {
    c: {
      'int main()': '48 89 e5 48 83 ec 10',
      printf: '48 8d 3d 00 00 00 00 e8 00 00 00 00',
      'return 0': '31 c0 c9 c3',
      if: '48 85 c0 74 0a',
      for: '48 89 45 fc eb 0a',
      while: '48 85 c0 75 f6',
    },
    assembly: {
      mov: '48 89',
      add: '48 01',
      sub: '48 29',
      push: '50',
      pop: '58',
      call: 'e8',
      ret: 'c3',
    },
  },
  arm64: {
    c: {
      'int main()': 'fd 7b bf a9 fd 03 00 91',
      printf: '00 00 80 52 01 00 00 94',
      'return 0': '00 00 80 52 fd 7b c1 a8 c0 03 5f d6',
      if: '1f 00 00 71 81 00 00 54',
      for: 'e0 03 00 91 1f 00 00 71',
      while: '1f 00 00 71 a1 ff ff 54',
    },
    assembly: {
      mov: '00 00 80 d2',
      add: '00 00 00 8b',
      sub: '00 00 00 cb',
      ldr: '00 00 40 f9',
      str: '00 00 00 f9',
      bl: '00 00 00 94',
      ret: 'c0 03 5f d6',
    },
  },
} as const;

export const generateMachineCode = (
  text: string,
  architecture: Architecture,
  language: SourceLanguage,
): string => {
  if (!text.trim()) return '';

  let machineCode = '';
  const lines = text.toLowerCase().split('\n');

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const archPatterns = PATTERNS[architecture];
    const langPatterns = archPatterns[language];

    let found = false;
    for (const [pattern, code] of Object.entries(langPatterns)) {
      if (trimmedLine.includes(pattern)) {
        machineCode += `${(index * 4)
          .toString(16)
          .padStart(8, '0')}: ${code}\n`;
        found = true;
        break;
      }
    }

    if (!found) {
      const randomBytes = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, '0'),
      ).join(' ');
      machineCode += `${(index * 4)
        .toString(16)
        .padStart(8, '0')}: ${randomBytes}\n`;
    }
  });

  return machineCode || '00000000: 90 90 90 90\n';
};

export const generateAssembly = (
  text: string,
  architecture: Architecture,
): string => {
  if (!text.trim()) return '';

  const lines = text.toLowerCase().split('\n');
  let assembly = '';

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    if (architecture === 'x86-64') {
      if (trimmedLine.includes('main')) {
        assembly += `main:\n    push rbp\n    mov rbp, rsp\n`;
      } else if (trimmedLine.includes('printf')) {
        assembly += `    lea rdi, [rel msg]\n    call printf\n`;
      } else if (trimmedLine.includes('return')) {
        assembly += `    xor eax, eax\n    leave\n    ret\n`;
      } else {
        assembly += `    ; ${trimmedLine}\n`;
      }
    } else if (architecture === 'arm64') {
      if (trimmedLine.includes('main')) {
        assembly += `main:\n    stp x29, x30, [sp, #-16]!\n    mov x29, sp\n`;
      } else if (trimmedLine.includes('printf')) {
        assembly += `    adrp x0, msg\n    add x0, x0, :lo12:msg\n    bl printf\n`;
      } else if (trimmedLine.includes('return')) {
        assembly += `    mov w0, #0\n    ldp x29, x30, [sp], #16\n    ret\n`;
      } else {
        assembly += `    ; ${trimmedLine}\n`;
      }
    }
  });

  return assembly || '; No assembly generated\n';
};

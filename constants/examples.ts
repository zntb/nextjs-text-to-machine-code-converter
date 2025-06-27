import { Example, BinaryExample } from '../types';

export const CODE_EXAMPLES: Example[] = [
  {
    name: 'Hello World (C)',
    code: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
    language: 'c',
  },
  {
    name: 'Simple Loop (C)',
    code: `int main() {
    for (int i = 0; i < 10; i++) {
        printf("%d", i);
    }
    return 0;
}`,
    language: 'c',
  },
  {
    name: 'Assembly Instructions',
    code: `mov rax, 1
add rax, 2
sub rax, 1
ret`,
    language: 'assembly',
  },
];

export const BINARY_EXAMPLES: BinaryExample[] = [
  {
    name: 'Hello World Text',
    code: 'Hello, World!',
    mode: 'text',
  },
  {
    name: 'Numbers to Binary',
    code: '42\n255\n1024',
    mode: 'numbers',
  },
  {
    name: 'Unicode Text',
    code: 'Hello 世界 🌍',
    mode: 'text',
  },
];

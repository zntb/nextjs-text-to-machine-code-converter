export interface Example {
  name: string;
  code: string;
  language: string;
}

export interface BinaryExample {
  name: string;
  code: string;
  mode: 'text' | 'machine' | 'numbers';
}

export type Architecture = 'x86-64' | 'arm64';
export type SourceLanguage = 'c' | 'assembly';
export type TextEncoding = 'ascii' | 'utf8' | 'utf16';
export type BinaryMode = 'text' | 'machine' | 'numbers';

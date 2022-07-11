export type IFiles = {
  name: string;
  path: string;
}[];

export enum PARSER_ENUM {
  BABEL = 'babel',
  TS = 'typescript',
  VUE = 'vue',
}
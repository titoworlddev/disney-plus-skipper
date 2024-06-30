export interface AppLanguage {
  skipperSwitchLabel: string;
  introCheckboxLabel: string;
  resumeCheckboxLabel: string;
  jumpCheckboxLabel: string;
}

export interface AppLanguages {
  [key: string]: AppLanguage;
}

import { Developer } from './innerTypes';

export type Skills = {
  id: string;
  title: string;
  type: string;
};

export type Matches = {
  jobSkills: Skills[];
  developers: Developer[];
};

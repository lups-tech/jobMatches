export type Skills = {
  id: string;
  title: string;
  type: string;
};

export type DeveloperMatches = {
  id: string;
  name: string;
  email: string;
  skills: Skills[];
  skillMatch: number;
};

export type Matches = {
  jobSkills: Skills[];
  developers: DeveloperMatches[];
};

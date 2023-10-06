import { Region } from './externalTypes';

export type Skill = {
  id: string;
  title: string;
  type: string;
};

export type ComboBoxProps = {
  skills: Skill[];
  skillType: string;
  refetchSkills: () => void;
  isRequired: boolean;
};

export type FilterFormValues = {
  searchKeyword: string;
  skillsFilter: string[];
  regionFilter: Region[];
  isExperienced?: boolean;
};

export type DeveloperFilterFormValues = {
  searchKeyword: string;
  skillsFilter: string[];
  speaksSwedish: boolean;
};

export type Developer = {
  id: string;
  name: string;
  email: string;
  skills: Skill[];
  skillMatch: number;
};

export type TeamMemberInfo = {
  imgUrl: string;
  memberName: string;
  memberDescription: string;
  githubLink: string;
  linkedinLink: string;
};

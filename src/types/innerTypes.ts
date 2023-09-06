export type Skill = {
  id: string,
  title: string,
  type: string
}

export type ComboBoxProps = {
  skills : Skill[],
  skillType: string,
  refetchSkills: () => void
  isRequired: boolean
};

type Skills = {
  id: string;
  title: string;
  type: string;
};

export type Developer = {
  id: string;
  name: string;
  email: string;
  skills: Skills[];
  skillMatch: number;
};
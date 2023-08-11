export type Skill = {
  id: string,
  title: string,
  type: string
}

export type AddSkillToDev = {
  developerId: string
  selectedSkillIds: string[]
};

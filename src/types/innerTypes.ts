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
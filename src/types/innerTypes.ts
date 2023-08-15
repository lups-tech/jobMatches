export type Skill = {
  id: string,
  title: string,
  type: string
}

export type AddSkillToDev = {
  developerId: string
  selectedSkillIds: string[]
};

export type ComboBoxProps = {
  skills : Skill[],
  filter: string,
  formValueSetter: React.Dispatch<React.SetStateAction<AddSkillToDev>>,
  formValues: AddSkillToDev
};
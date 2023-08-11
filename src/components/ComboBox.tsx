import { Autocomplete, TextField } from "@mui/material";
import { AddSkillToDev, Skill } from "../types/innerTypes";

type ComboBoxProps = {
    skills : Skill[],
    filter: string,
    formValueSetter: React.Dispatch<React.SetStateAction<AddSkillToDev>>,
    formValues: AddSkillToDev
    skillValue: string,
}
export default function ComboBox({skills, filter, formValueSetter, formValues, skillValue}: ComboBoxProps){
    const skillList : Skill[]= skills?.filter(skill => skill.type == filter).map(skill => {return {title: skill.title, id: skill.id, type: skill.type}});
    return (
    <>
        <Autocomplete
            className=""
            multiple
            id={filter}
            options={skillList}
            getOptionLabel={skill => skill.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label={`Select ${filter}`} />}
            inputValue={skillValue}
            onChange={(_event, newValue) => {
                    const newState = formValues.selectedSkillIds.filter(skillToDelete => !skillList.map(skill => skill.id).includes(skillToDelete));
                    const newSelected = newValue.map(skill => skill.id);
                    formValueSetter({...formValues, selectedSkillIds : [...newState, ...newSelected]});
            }}
                    
        />
    </>
  )
}

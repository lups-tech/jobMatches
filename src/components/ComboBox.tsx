import { Autocomplete, TextField } from "@mui/material";
import { AddSkillToDev, Skill } from "../types/innerTypes";
import { useState } from "react";
import axios from "axios";
import { createFilterOptions } from '@mui/material/Autocomplete';

const backendServer = import.meta.env.VITE_BE_SERVER;


const filterFromMUI = createFilterOptions<string>();

type ComboBoxProps = {
    skills : Skill[],
    filter: string,
    formValueSetter: React.Dispatch<React.SetStateAction<AddSkillToDev>>,
    formValues: AddSkillToDev
}
export default function ComboBox({skills, filter, formValueSetter, formValues}: ComboBoxProps){
    const [value, setValue] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [addedSkill, setAddedSkill] = useState<string>("");
    const skillList : Skill[]= skills?.filter(skill => skill.type == filter).map(skill => {return {title: skill.title, id: skill.id, type: skill.type}});
    const skillTitleList : string[] = skillList.map(skill => skill.title);

    const handleAddSkill = async (newSkillName : string) => {
       const response = await axios.post(`${backendServer}api/skills`, {
            title: newSkillName,
            type: filter
        })
        skillList.push(response.data);
        const newValue = [...value,response.data.title];
        setValue(newValue);
        setAddedSkill(response.data.title);
        }

    return (
    <>
        <Autocomplete
            className="w-96"
            multiple
            id={filter}
            options={skillTitleList}
            getOptionLabel={skill => skill}
            filterOptions={(options, params) => {
                const filtered = filterFromMUI(options, params);
        
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== '' && !isExisting) {
                  filtered.push( `Add "${inputValue}"`);
                }
        
                return filtered;
              }}
            inputValue={inputValue}
            onInputChange={(_e, newInputValue) => setInputValue(newInputValue)}
            renderInput={(params) => <TextField {...params} label={`Select ${filter}`}/>}
            onChange={(_event, newValue) => {
                setValue([...newValue])
                const idList = skillList.filter(skill => value.includes(skill.title));
                const newState = formValues.selectedSkillIds
                    .filter(skillToDelete => !skillList.map(skill => skill.id).includes(skillToDelete));
                const newSelected = idList.map(skill => skill.id);
                formValueSetter({...formValues, selectedSkillIds : [...newState, ...newSelected]});
            }}         
        />
    </>
  )
}

/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, TextField } from "@mui/material";
import { ComboBoxProps, Skill } from "../types/innerTypes";
import { useState } from "react";
import axios from "axios";
import { createFilterOptions } from '@mui/material/Autocomplete';

const backendServer = import.meta.env.VITE_BE_SERVER;

const filterFromMUI = createFilterOptions<string>();

export default function ComboBox({skills, filter, formValueSetter, formValues}: ComboBoxProps){
    const [inputValue, setInputValue] = useState<string>("");
    const skillList : Skill[]= skills?.filter(skill => skill.type == filter).map(skill => {return {title: skill.title, id: skill.id, type: skill.type}});
    const skillTitleList : string[] = skillList.map(skill => skill.title);

    const handleAddSkill = async (newSkillName : string) => {
       const response = await axios.post(`${backendServer}api/skills`, {
            title: newSkillName,
            type: filter
        })
        return response.data;
    }

    const setForm = (value: string []) => {
        const idList = skillList.filter(skill => value.includes(skill.title));
        const newState = formValues.selectedSkillIds
            .filter(skillToDelete => !skillList.map(skill => skill.id).includes(skillToDelete));
        const newSelected = idList.map(skill => skill.id);
        formValueSetter({...formValues, selectedSkillIds : [...newState, ...newSelected]});
    }
    
    const addIdToSkill = (newSkill: Skill, value: string[]) => {
        skillList.push(newSkill);
        setForm(value);
    }

    return (
    <>
        <Autocomplete
            className="w-96"
            freeSolo
            multiple
            id={filter}
            options={skillTitleList}
            getOptionLabel={skill => skill}
            filterOptions={(options, params) => {
                const filtered = filterFromMUI(options, params);
        
                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== '' && !isExisting) {
                    filtered.push( `${inputValue}`);
                }
                return filtered;
              }}
            renderOption={(props, option) => {
                if(skillTitleList.includes(option)){
                    return(<li key={option} {...props}>{option}</li>)
                } else {
                    return(<li key={option} {...props}>Add "{option}"</li>)
                }
            }}
            inputValue={inputValue}
            onInputChange={(_e, newInputValue) => setInputValue(newInputValue)}
            renderInput={(params) => <TextField {...params} label={`Select ${filter}`}/>}
            onChange={async (_event, newValue) => {
                const newSkillArray = newValue.filter(element => !skillTitleList.includes(element));
                if(newSkillArray.length){
                    newSkillArray.forEach(element => {
                        handleAddSkill(element)
                            .then((response) => addIdToSkill(response, newValue))
                    });
                } else {
                    setForm(newValue);
                }
                
            }}         
        />
    </>
  )
}

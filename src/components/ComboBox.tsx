import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { AddSkillToDev, Skill } from "../types/innerTypes";
import { useState } from "react";
import axios from "axios";

const backendServer = import.meta.env.VITE_BE_SERVER;

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
    const stringList : string[] = skillList.map(skill => skill.title);

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
            options={stringList}
            getOptionLabel={skill => skill}
            inputValue={inputValue}
            onInputChange={(_e, newInputValue) => setInputValue(newInputValue)}
            noOptionsText={
                <Box className="flex justify-between">
                    <p className="pt-1">No skill found</p>
                    <Button variant="outlined" onClick={() => handleAddSkill(inputValue)}>Add skill to options</Button>
                </Box>
            }
            renderInput={(params) => <TextField {...params} label={`Select ${filter}`}/>}
            onChange={(_event, newValue) => {
                if(!addedSkill){
                    setValue([...newValue])
                } else {
                    setValue([...newValue, addedSkill])
                }
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

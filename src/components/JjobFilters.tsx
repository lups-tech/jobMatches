import { Autocomplete, TextField } from '@mui/material';
import { Skill } from '../types/innerTypes';
import { Dispatch, SetStateAction, useState } from 'react';


interface IJobFilters {
  setSearchKeyword: Dispatch<SetStateAction<string>>;
  skills: Skill[]
}

const JobFilters = ({ setSearchKeyword, skills }: IJobFilters) => {
  const [inputValue, setInputValue] = useState('');

  if (!skills) {
    return;
  }

  return (
    <Autocomplete
      id="skill-selection"
      freeSolo
      sx={{background: '#ffffff'}}
      options={skills.map((skill) => skill.title)}
      renderInput={(params) => <TextField {...params} label="Search skills" />}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(_event, newValue) => {
        if (newValue) {
          setSearchKeyword(newValue);
        }
      }}
    />
  );
};

export default JobFilters;

import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { Skill } from '../types/innerTypes';
import { Dispatch, SetStateAction } from 'react';
import { Controller, useForm } from 'react-hook-form';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

interface IJobFilters {
  setSearchKeyword: Dispatch<SetStateAction<FilterFormValues>>;
  skills: Skill[];
}

export type FilterFormValues = {
  searchKeyword: string;
  skillsFilter: string[];
  isRemote: boolean;
  isExperienced?: boolean;
};

const JobFilters = ({ setSearchKeyword, skills }: IJobFilters) => {
  const { register, handleSubmit, control } = useForm<FilterFormValues>({
    defaultValues: {
      searchKeyword: 'JavaScript',
      skillsFilter: [],
      isRemote: false,
      isExperienced: false,
    },
  });

  const processingData = (data: FilterFormValues) => {
    setSearchKeyword(data);
    console.log('hellew', data);
  };

  if (!skills) {
    return;
  }

  return (
    <form onSubmit={handleSubmit(processingData)}>
      <Controller
        control={control}
        name="searchKeyword"
        render={({ field: { onChange } }) => (
          <Autocomplete
            {...register('searchKeyword')}
            id="skill-selection"
            freeSolo
            sx={{ background: '#ffffff' }}
            options={skills.map((skill) => skill.title)}
            renderInput={(params) => (
              <TextField {...params} label="Search skills" />
            )}
            onInputChange={onChange}
            onChange={(_event, newValue) => {
              if (newValue) {
                onChange(newValue);
              }
            }}
          />
        )}
      />
 <div className='flex flex-row flex-wrap items-center'>
      <FormControlLabel
        {...register('isRemote')}
        control={<Checkbox />}
        label="isRemote"
      />
      <FormControlLabel
        {...register('isExperienced')}
        control={<Checkbox />}
        label="isExperienced"
      />
    
        <Controller
          control={control}
          name="skillsFilter"
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
              <InputLabel id="programming-languages-multiple-checkbox-label">Programming Language</InputLabel>
              <Select
                labelId="programming-languages-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                label="Programming Language"
                multiple
                value={value}
                onChange={onChange}
                input={<OutlinedInput label="Programming Language" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {skills.filter(skill => skill.type === 'Programming Language').map((skill) => (
                  <MenuItem key={skill.id} value={skill.title}>
                    <Checkbox checked={value.indexOf(skill.title) > -1}/>
                    <ListItemText primary={skill.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      <Button variant="outlined" type="submit">
        Search
      </Button>
      </div>
    </form>
  );
};

export default JobFilters;

// add filtering EXPERIENCE
// add filtering REGION
// add filtering PROGRAMMING LANGUAGES

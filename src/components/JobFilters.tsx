import { Autocomplete, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Skill } from '../types/innerTypes';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';

interface IJobFilters {
  setSearchKeyword: Dispatch<SetStateAction<FilterFormValues>>;
  skills: Skill[]
}

export type FilterFormValues = {
  searchKeyword: string,
  isRemote: boolean,
  isExperienced?: boolean 
}

const JobFilters = ({ setSearchKeyword, skills }: IJobFilters) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
    searchKeyword: 'JavaScript',
    isRemote: false,
    isExperienced:  false
    }
  });
  // const [inputFilterValue, setInputFilterValue] = useState();

  const processingData = (data: FilterFormValues) => {
    setSearchKeyword(data)
    console.log('hellew', data);
    
  }

  if (!skills) {
    return;
  }

  return (

    <form onSubmit={handleSubmit(processingData)}>
      <FormControlLabel 
      label='' 
      control={<Autocomplete
      {...register('searchKeyword')}
        id="skill-selection"
        freeSolo
        sx={{background: '#ffffff'}}
        options={skills.map((skill) => skill.title)}
        renderInput={(params) => <TextField {...params} label="Search skills" />}
      />} 
      />
      
      <FormControlLabel {...register('isRemote')} control={<Checkbox />} label="isRemote" />
      <FormControlLabel {...register('isExperienced')} control={<Checkbox />} label="isExperienced" />
      <button type='submit'>Search</button>
    </form>
  );
};

export default JobFilters;


// add filtering REMOTE 
// add filtering EXPERIENCE

// add filtering REGION
// add filtering PROGRAMMING LANGUAGES


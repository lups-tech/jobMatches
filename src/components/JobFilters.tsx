import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Skill } from '../types/innerTypes';
import { Dispatch, SetStateAction } from 'react';
import { Controller, useForm } from 'react-hook-form';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FilterFormValues } from '../types/innerTypes';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Region } from '../types/externalTypes';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface IJobFilters {
  setSearchKeyword: Dispatch<SetStateAction<FilterFormValues>>;
  skills: Skill[];
}

const fetchRegions = async () => {
  const res = await fetch(
    'https://taxonomy.api.jobtechdev.se/v1/taxonomy/specific/concepts/region'
  );
  return res.json();
};

const JobFilters = ({ setSearchKeyword, skills }: IJobFilters) => {
  const { register, handleSubmit, control } = useForm<FilterFormValues>({
    defaultValues: {
      searchKeyword: 'JavaScript',
      skillsFilter: [],
      regionFilter: [],
      isExperienced: false,
    },
  });

  const {
    isLoading: isRegionsLoading,
    error: regionsError,
    data: regions,
  } = useQuery<Region[]>(['regions'], async () => {
    return fetchRegions();
  });

  const processingData = (data: FilterFormValues) => {
    setSearchKeyword(data);
  };
  if (isRegionsLoading)
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );

  if (regionsError) {
    console.log('❗️error: ', Error);
    return (
      <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
      </div>
    );
  }
  if (!regions) {
    return;
  }

  return (
    <form onSubmit={handleSubmit(processingData)} className="mt-6">
      <Controller
        control={control}
        name="searchKeyword"
        render={({ field: { onChange } }) => (
          <Autocomplete
            {...register('searchKeyword')}
            id="skill-selection"
            freeSolo
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
              },
            }}
            options={skills.map(skill => skill.title)}
            renderInput={params => (
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
      <div className="flex flex-row flex-wrap items-center justify-between">
        <FormControlLabel
          {...register('isExperienced')}
          control={
            <Checkbox
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleIcon />}
            />
          }
          label="Experience Required"
        />

        <Controller
          control={control}
          name="skillsFilter"
          render={({ field: { onChange, value } }) => (
            <FormControl
              sx={{
                m: 1,
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                },
              }}
              size="small"
            >
              <InputLabel id="programming-languages-multiple-checkbox-label">
                Programming Language
              </InputLabel>
              <Select
                labelId="programming-languages-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                label="Programming Language"
                multiple
                value={value}
                onChange={onChange}
                input={<OutlinedInput label="Programming Language" />}
                renderValue={selected => selected.join(', ')}
              >
                {skills
                  .filter(skill => skill.type === 'Programming Language')
                  .map(skill => (
                    <MenuItem key={skill.id} value={skill.title}>
                      <Checkbox
                        checked={value.indexOf(skill.title) > -1}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                      />
                      <ListItemText primary={skill.title} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="regionFilter"
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <Autocomplete
              className="w-72"
              id="regionFilters"
              multiple
              size="small"
              options={
                regions.filter(region =>
                  region['taxonomy/preferred-label'].includes('län')
                ) as Region[]
              }
              renderInput={params => (
                <TextField
                  {...params}
                  key={params.id}
                  label={`Select regions`}
                />
              )}
              getOptionLabel={option => option['taxonomy/preferred-label']}
              onBlur={onBlur}
              onChange={(_event, values) => {
                if (values && regions) {
                  const regionMatched = values.map(regionMatched =>
                    regions.find(region => regionMatched === region)
                  );
                  onChange(regionMatched);
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                },
              }}
            />
          )}
        />

        <Button variant="outlined" type="submit" className="w-full">
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

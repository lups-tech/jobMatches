import { Autocomplete, TextField } from '@mui/material';
import { ComboBoxProps, Skill } from '../types/innerTypes';
import axios from 'axios';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Controller } from 'react-hook-form';

const backendServer = import.meta.env.VITE_BE_SERVER;
const filterFromMUI = createFilterOptions<string>();

const ComboBox = ({
  skills,
  skillType,
  refetchSkills,
  isRequired,
}: ComboBoxProps) => {
  const filteredSkills: Skill[] = skills.filter(
    (skill) => skill.type === skillType
  );
  const skillTitleList: string[] = filteredSkills.map((skill) => skill.title);

  const handleAddSkill = async (newSkillName: string) => {
    const response = await axios.post(`${backendServer}api/skills`, {
      title: newSkillName,
      type: skillType,
    })

    const skill: Skill = response.data;
    return skill;
  };

  return (
    <Controller
      defaultValue={[]}
      name={`selectedSkillIds.${skillType}`}
      rules={{
        validate: (value) => !isRequired || value.length > 0,
      }}
      render={({ field: { onChange, onBlur } }) => (
        <Autocomplete
          className="w-96"
          freeSolo
          multiple
          id={skillType}
          options={skillTitleList}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField {...params} label={`Select ${skillType}`} />
          )}
          filterOptions={(options, params) => {
            const filtered = filterFromMUI(options, params);

            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option);
            if (inputValue !== '' && !isExisting) {
              filtered.push(`${inputValue}`);
            }
            return filtered;
          }}
          renderOption={(props, option) => {
            return (
              <li key={option} {...props}>
                {skillTitleList.includes(option) ? option : `Add "${option}"`}
              </li>
            );
          }}
          onBlur={onBlur}
          onChange={async (_event, value) => {
            const skillsToCreate = value.filter(
              (skillTitle) =>
                !filteredSkills.some((skill) => skill.title === skillTitle)
            );

            const newSkills = await Promise.all(
              skillsToCreate.map((skillTitle) => handleAddSkill(skillTitle))
            );

            onChange(
              value.map(
                (skillTitle) =>
                  [...filteredSkills, ...newSkills].find(
                    (skill) => skill.title === skillTitle
                  )?.id
              )
            );

            refetchSkills();
          }}
        />
      )}
    />
  );
};

export default ComboBox;

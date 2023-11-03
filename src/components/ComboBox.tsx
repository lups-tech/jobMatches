import { Autocomplete, TextField } from '@mui/material';
import { ComboBoxProps, Skill } from '../types/innerTypes';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Controller } from 'react-hook-form';
import { handleAddSkill } from '../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';

const filterFromMUI = createFilterOptions<string>();

export const ComboBox = ({
  skills,
  skillType,
  refetchSkills,
  isRequired,
}: ComboBoxProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const filteredSkills: Skill[] = skills.filter(
    (skill) => skill.type === skillType,
  );
  const skillTitleList: string[] = filteredSkills.map((skill) => skill.title);

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
                !filteredSkills.some((skill) => skill.title === skillTitle),
            );

            const newSkills = await skillsToCreate.map((skillTitle) => {
              handleAddSkill(skillTitle, skillType, getAccessTokenSilently);
            });

            onChange(
              value.map(
                (skillTitle) =>
                  [...filteredSkills, ...newSkills].find((skill) => {
                    if (skill) {
                      return skill.title === skillTitle;
                    }
                  })?.id,
              ),
            );

            refetchSkills();
          }}
        />
      )}
    />
  );
};

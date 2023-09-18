import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Snackbar,
  Typography,
} from '@mui/material';
import { Skill } from '../types/innerTypes';
import { useState } from 'react';
import ComboBox from './ComboBox';
import { LoadingButton } from '@mui/lab';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

type FormValues = {
  developerId: string;
  selectedSkillIds: {
    [skillType: string]: string[];
  };
};

const backendServer = import.meta.env.VITE_BE_SERVER;

const fetchSkills = async (accessToken: string) => {
  const res = await axios.get(`${backendServer}api/skills`, {
    headers : {
      "Authorization" : `Bearer ${accessToken}`
    }
  });
  return res.data;
};

const SkillForm = () => {
  const { state: developerInfo } = useLocation();
  const [sendError, setSendError] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
    refetch: refetchSkills,
  } = useQuery<Skill[], Error>(['skills'], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken)});

  const formMethods = useForm<FormValues>({
    reValidateMode: 'onChange',
    defaultValues: {
      selectedSkillIds: {
        ['Programming Language']: [],
      },
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting: isFormSubmitting, errors: formValidationErrors },
    register,
  } = formMethods;

  if (isSkillsLoading) return <p>Loading...</p>;
  if (skillsError || skills === undefined)
    return <p>An error has occurred: {skillsError?.message}</p>;

  const skillTypes = Array.from(new Set(skills.map((skill) => skill.type)));

  const onSubmit = async (formValues: FormValues) => {
    const accessToken = await getAccessTokenSilently();
    try {
      await axios.patch(`${backendServer}api/developerSkills`, {
        developerId: developerInfo.id,
        selectedSkillIds: Object.values(formValues.selectedSkillIds).flat(),
      }, {
        headers : {
          "Authorization" : `Bearer ${accessToken}`
        }
      });
      setSendSuccess(true);
      setTimeout(() => navigate(`/developers`), 2000);
    } catch (error) {
      setSendError(true);
      setTimeout(() => setSendError(false), 2000);
    }
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4 mx-auto min-w-fit max-w-md px-4"
        >
          <Typography variant="h4" className="mb-10 md:pb-12">
            Add Skills to {developerInfo.name}
          </Typography>
          <FormControl className="flex flex-col mb-2 self-start w-full">
            <FormLabel>Programming Language</FormLabel>
            <div className="pl-2 w-full flex flex-col">
              {skills
                .filter((skill) => skill.type === 'Programming Language')
                .map((skill) => (
                  <FormControlLabel
                    key={skill.id}
                    control={
                      <Checkbox
                        value={skill.id}
                        {...register('selectedSkillIds.Programming Language', {
                          validate: (value) => value.length > 0,
                        })}
                      />
                    }
                    label={skill.title}
                  />
                ))}
            </div>
          </FormControl>
          <FormControl className="flex flex-col mb-2 self-start w-full gap-4">
            <FormLabel>Add Specialist Skills</FormLabel>
            <div className="w-full px-2 flex flex-col gap-4">
              {skillTypes
                .filter((skillType) => skillType != 'Programming Language')
                .map((skillType) => (
                  <ComboBox
                    key={skillType}
                    skills={skills}
                    skillType={skillType}
                    refetchSkills={refetchSkills}
                    isRequired={skillType === 'Speaking Languages'}
                  />
                ))}
            </div>

            {Object.keys(formValidationErrors).length > 0 && (
              <FormHelperText error>
                You have to select at least one Programming Language and one
                Speaking Language.
              </FormHelperText>
            )}

            <LoadingButton
              loading={isFormSubmitting}
              variant="outlined"
              type="submit"
              className="w-[60%] max-w-xs self-center"
            >
              Add skills
            </LoadingButton>
          </FormControl>
        </form>
      </FormProvider>
      <Snackbar
        open={sendSuccess}
        autoHideDuration={3000}
        message={`Skills added to ${developerInfo.name}`}
      />
      <Snackbar
        open={sendError}
        autoHideDuration={3000}
        message="Loading failed, please try again"
      />
    </>
  );
};

export default SkillForm;

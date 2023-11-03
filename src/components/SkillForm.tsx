import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Snackbar,
  Typography,
} from '@mui/material';
import { Skill } from '../types/innerTypes';
import { useState } from 'react';
import { ComboBox } from './ComboBox';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchSkills } from '../utils/fetchingTools';

type FormValues = {
  developerId: string;
  selectedSkillIds: {
    [skillType: string]: string[];
  };
};

const backendServer = import.meta.env.VITE_BE_SERVER;

export const SkillForm = () => {
  const navigate = useNavigate();
  const { state: developerInfo } = useLocation();
  const [sendError, setSendError] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
    refetch: refetchSkills,
  } = useQuery<Skill[], Error>(['skills'], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken);
  });

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
    formState: { errors: formValidationErrors },
    register,
  } = formMethods;

  const addSkillToDeveloperRequest = async ({
    developerId,
    selectedSkillIds,
  }: {
    developerId: string;
    selectedSkillIds: string[];
  }) => {
    const accessToken = await getAccessTokenSilently();
    await axios.patch(
      `${backendServer}api/developerSkills`,
      {
        developerId: developerId,
        selectedSkillIds: selectedSkillIds,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(addSkillToDeveloperRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['allDevelopers']);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 2000);
      setTimeout(() => navigate('/developers'), 2200);
    },
    onError: () => {
      setLoadingState(false);
      setSendError(true);
      setTimeout(() => setSendError(false), 2000);
    },
  });
  if (isSkillsLoading) return <p>Loading...</p>;
  if (skillsError || skills === undefined)
    return <p>An error has occurred: {skillsError?.message}</p>;

  const skillTypes = Array.from(new Set(skills.map((skill) => skill.type)));

  const onSubmit = async (formValues: FormValues) => {
    setLoadingState(true);
    mutation.mutate({
      developerId: developerInfo.id,
      selectedSkillIds: Object.values(formValues.selectedSkillIds).flat(),
    });
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
            <Button
              variant="outlined"
              type="submit"
              className="w-[60%] max-w-xs self-center"
              disabled={loadingState}
            >
              {loadingState ? <CircularProgress size={18} /> : 'Add skills'}
            </Button>
          </FormControl>
        </form>
      </FormProvider>
      <Snackbar
        open={sendSuccess}
        autoHideDuration={3000}
        message={`Skills added to ${developerInfo.name}`}
        ContentProps={{ sx: { backgroundColor: '#54ac68' } }}
      />
      <Snackbar
        open={sendError}
        autoHideDuration={3000}
        message="Loading failed, please try again"
        ContentProps={{ sx: { backgroundColor: '#ff3030' } }}
      />
    </>
  );
};

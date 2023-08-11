import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
// import * as z from 'zod';
// import { useForm } from 'react-hook-form';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Snackbar, Typography} from '@mui/material';
// import { zodResolver } from '@hookform/resolvers/zod';
import { AddSkillToDev, Skill } from '../types/innerTypes';
import { FormEvent, useState } from 'react';
import ComboBox from './ComboBox';
import { LoadingButton } from '@mui/lab';
import { useLocation } from 'react-router-dom';

// const formSchema = z.object({
// selectedSkillIds: z
//     .array(z.string())
//     .refine((value) => value.some((id) => id), {
//     message: 'You have to select at least one item.',
//     }),
// });

const backendServer = import.meta.env.VITE_BE_SERVER;

const fetchSkills = async () => {
    const res = await axios.get(`${backendServer}api/skills`);
    return res.data;
  };

export default function SkillForm() {
    const { state: developerInfo } = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [sendError, setSendError] = useState<boolean>(false);
    const [sendSuccess, setSendSuccess] = useState<boolean>(false);
    const [skillValue] = useState<string>("");
    const [formValues, setFormValues] = useState<AddSkillToDev>({
        developerId: developerInfo.id,
        selectedSkillIds : [],
    });

    const {
        isLoading,
        error,
        data: skills,
    } = useQuery<Skill[], Error>(['skills'], fetchSkills);

    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //       selectedSkillIds: [],
    //     },
    //  });

    if (isLoading) return 'Loading...';
    if (error || skills === undefined)
    return 'An error has occurred: ' + error?.message;

    const onSubmit = async (e : FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try{
            console.log(formValues);
            const res = await axios.patch(`${backendServer}developerSkills`, formValues,{
            headers: {
            'Content-Type': 'application/json'
          }})
          setLoading(false);
          setSendSuccess(true);
          setTimeout(() => setSendSuccess(false), 2000)
        return res.data;
        } catch(error){
            setSendError(true)
            setTimeout(() => setSendError(false), 2000)
            setLoading(false)
        }
        
    }

    const handleCheckboxChange = (event : React.ChangeEvent<HTMLInputElement>, skill : string) => {
        if(event.target.checked){
            const newSelected = formValues.selectedSkillIds;
                    newSelected.push(skill)
                    setFormValues({...formValues, selectedSkillIds : newSelected})
        } else {
            const newSelected = formValues.selectedSkillIds.filter(Selectedskill => Selectedskill != skill)
            setFormValues({...formValues, selectedSkillIds : newSelected});
        }
    }

    const skillTypes= () : string[] => {
        const skillTypesList = new Set<string>();
        skills.forEach(skill => skillTypesList.add(skill.type));
        return Array.from(skillTypesList);
    }

  return (
      <>
        <form onSubmit={(e) => onSubmit(e)}
        className="flex flex-col items-center gap-4 mx-auto min-w-fit max-w-md px-4">
            <Typography variant="h4" className="mb-10 md:pb-12">{`Add Skills to ${developerInfo.name}`}</Typography>
            <FormControl className='flex flex-col mb-2 self-start w-full'>
                <FormLabel>Programming Language</FormLabel>
                <div className='pl-2 w-full flex flex-col'>
                    {skills.length != 0 && skills.map(skill => {
                        if(skill.type == "Programming Language"){
                            return(
                            <FormControlLabel
                            key={skill.id}
                            control={<Checkbox checked={formValues.selectedSkillIds.includes(skill.id)} onChange={(e) => handleCheckboxChange(e, skill.id)}/>}
                            label={skill.title}/>)
                        }
                    })}
                </div>
                </FormControl>
                <FormControl className='flex flex-col mb-2 self-start w-full gap-4'>
                <FormLabel>Add Specialist Skills</FormLabel>
                <div className='w-full px-2 flex flex-col gap-4'>
                    {skills.length != 0 && skillTypes().map(type => {
                        if(type != "Programming Language"){
                            return(
                                <ComboBox
                                    key={type}
                                    skills={skills} 
                                    filter={type} 
                                    formValueSetter={setFormValues} 
                                    skillValue={skillValue}
                                    formValues={formValues}
                                />
                            )
                        }})}
                </div>
                <LoadingButton loading={loading} variant="outlined" type="submit" className="w-[60%] max-w-xs self-center">Submit</LoadingButton>
            </FormControl>
        </form>
        <Snackbar open={sendSuccess} autoHideDuration={3000} message={`Skills added to ${developerInfo.name}`}/>
        <Snackbar open={sendError} autoHideDuration={3000} message="Loading failed, please try again"/>
    </>
  )
}
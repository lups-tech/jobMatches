import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Autocomplete, Button, Checkbox, Chip, FormControl, FormControlLabel, FormLabel, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddSkillToDev, Skill } from '../types/innerTypes';
import { FormEvent, useState } from 'react';

const formSchema = z.object({
selectedSkillIds: z
    .array(z.string())
    .refine((value) => value.some((id) => id), {
    message: 'You have to select at least one item.',
    }),
});

const fetchSkills = async () => {
    const res = await axios.get('http://localhost:5092/api/skills');
    return res.data;
  };

type FormValues = {
    programmingLang : string[];
    technicalSkills : string [];
}

export default function SkillForm() {
    const [skillValue, setSkillValue] = useState<string>("");
    const [formValues, setFormValues] = useState<FormValues>({
        programmingLang : [],
        technicalSkills : [],
    });
    const {
        isLoading,
        error,
        data: skills,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refetch: refetchSkills
    } = useQuery<Skill[], Error>(['skills'], fetchSkills);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          selectedSkillIds: [],
        },
     });

    if (isLoading) return 'Loading...';
    if (error || skills === undefined)
    return 'An error has occurred: ' + error?.message;

    //Developer Id to come from created developer - navigate with state
    // const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    //     const skillsToAdd: AddSkillToDev = {
    //       developerId: "3fa85f64-5717-4562-b3fc-2c963f66afe4",
    //       selectedSkillIds: formData.selectedSkillIds,
    //     }
    //     console.log(skillsToAdd);
        
    //     const res = await axios.patch('http://localhost:5092/developerSkills', skillsToAdd,{
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }})
    //     return res.data;
    //   };
    const onSubmit = (e : FormEvent) => {
        e.preventDefault();
        console.log(formValues);
    }

    const deleteHandler = (techSkill : string) => {
        const newSelected = formValues.technicalSkills.filter(skill => skill != techSkill)
        setFormValues({...formValues, technicalSkills : newSelected});
    }

    const handleCheckboxChange = (event : React.ChangeEvent<HTMLInputElement>, skill : string) => {
        if(event.target.checked){
            const newSelected = formValues.programmingLang;
                    newSelected.push(skill)
                    setFormValues({...formValues, programmingLang : newSelected})
        } else {
            const newSelected = formValues.programmingLang.filter(Selectedskill => Selectedskill != skill)
            setFormValues({...formValues, programmingLang : newSelected});
        }
    }

  return (
    <form onSubmit={(e) => onSubmit(e)}>
        <FormControl>
            <FormLabel>Programming Language</FormLabel>
            {skills.length != 0 && skills.map(skill => {
                if(skill.type == "Programming Language"){
                    return(
                    <FormControlLabel
                    key={skill.id}
                    control={<Checkbox checked={formValues.programmingLang.includes(skill.title)} onChange={(e) => handleCheckboxChange(e, skill.title)}/>}
                    label={skill.title}/>)
                }
            })
            
            }
            
            <p>{skillValue}</p>
            <Autocomplete 
                id="skill-selection" freeSolo 
                options={skills?.filter((skill) => skill.type == "technicalSkills" ).map(skill => skill.title)} 
                renderInput={(params) => <TextField {...params} label="Search skills" />}
                inputValue={skillValue}
                onChange={(_event, newValue) => {
                if (newValue) {
                    const newSelected = new Set(formValues.technicalSkills);
                    newSelected.add(newValue)
                    setFormValues({...formValues, technicalSkills : Array.from(newSelected)});
                }
            }}/>
            {formValues.technicalSkills.map(skill => {
                return(
                    <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => deleteHandler(skill)}/>
                )
            })}
            <Button type="submit">Submit</Button>
        </FormControl>
    </form>
  )
}
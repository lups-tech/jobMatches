import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
// import * as z from 'zod';
// import { useForm } from 'react-hook-form';
import { Button, Checkbox, FormControl, FormControlLabel, FormLabel} from '@mui/material';
// import { zodResolver } from '@hookform/resolvers/zod';
import { AddSkillToDev, Skill } from '../types/innerTypes';
import { FormEvent, useState } from 'react';
import ComboBox from './ComboBox';

// const formSchema = z.object({
// selectedSkillIds: z
//     .array(z.string())
//     .refine((value) => value.some((id) => id), {
//     message: 'You have to select at least one item.',
//     }),
// });

const fetchSkills = async () => {
    const res = await axios.get('http://localhost:5092/api/skills');
    return res.data;
  };

export default function SkillForm() {
    const [skillValue] = useState<string>("");
    const [formValues, setFormValues] = useState<AddSkillToDev>({
        developerId: "5",
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
    <form onSubmit={(e) => onSubmit(e)}>
        <FormControl>
            <FormLabel>Programming Language</FormLabel>
            {skills.length != 0 && skills.map(skill => {
                if(skill.type == "Programming Language"){
                    return(
                    <FormControlLabel
                    key={skill.id}
                    control={<Checkbox checked={formValues.selectedSkillIds.includes(skill.id)} onChange={(e) => handleCheckboxChange(e, skill.id)}/>}
                    label={skill.title}/>)
                }
            })
            }
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
                }
            })}
            <Button type="submit">Submit</Button>
        </FormControl>
    </form>
  )
}
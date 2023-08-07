import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useQuery } from '@tanstack/react-query';
import { Skill } from "../types/innerTypes";
import { Dispatch, SetStateAction, useState } from "react";

const backendServer = import.meta.env.VITE_BE_SERVER

const fetchSkills = async () : Promise<Skill[]> => {
  const res = await fetch(`${backendServer}api/Skills`)
  return res.json()
}

interface IJobFilters { setSearchKeyword: Dispatch<SetStateAction<string>> }

const JobFilters = ({setSearchKeyword}: IJobFilters) => {
  const { isLoading, error, data } = useQuery<Skill[]>(['skills'], fetchSkills)
  const [inputValue, setInputValue] = useState('')

  if (isLoading) return <CircularProgress />
  
  if (error) {
    console.log('❗️error: ', error)
    return 'An error has occurred, check console for more info' }
    
  return (
    <>
    {data && 
      <Autocomplete 
        id="skill-selection" freeSolo 
        options={data?.map((skill) => skill.title)} 
        renderInput={(params) => <TextField {...params} label="Search skills" />}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }} 
        onChange={(_event, newValue) => {
          if (newValue) {
            setSearchKeyword(newValue);
          }
        }}
      />
    }
    </>
  )
}

export default JobFilters
import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useQuery } from '@tanstack/react-query';
import { Skill } from "../types/innerTypes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const fetchSkills = async () : Promise<Skill[]> => {
  const res = await fetch('http://localhost:5092/api/Skills')
  return res.json()
}

interface IJobFilters { setSearchKeyword: Dispatch<SetStateAction<string>> }

const JobFilters = ({setSearchKeyword}: IJobFilters) => {
  const { isLoading, error, data } = useQuery<Skill[]>(['skills'], fetchSkills)
  const [value, setValue] = useState<string|null>('JavaScript')
  const [inputValue, setInputValue] = useState('')
  
  useEffect(() => {
    setSearchKeyword(value)
  }, [value])

  if (isLoading) return <CircularProgress />
  
  if (error) {
    console.log('❗️error: ', error)
    return 'An error has occurred, check console for more info' }
    
      
  
  return (
    <>jobs filter here
    <p>Selected Value: {value}</p>
    <p>Typein Value: {inputValue}</p>
    {data && 
      <Autocomplete 
        id="skill-selection" freeSolo 
        options={data?.map((skill) => skill.title)} 
        renderInput={(params) => <TextField {...params} label="Search skills" />}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }} 
        onChange={(event, newValue: string | null) => {
          setValue(newValue);
        }}
      />
    }
    </>
  )
}

export default JobFilters
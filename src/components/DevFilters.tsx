import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";
// import { useQuery } from "@tanstack/react-query";
import { Skill } from "../types/innerTypes";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { DeveloperFilterFormValues } from "../types/innerTypes";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
// import { Region } from "../types/externalTypes";

interface IDevFilters {
  setSearchFilter: Dispatch<SetStateAction<DeveloperFilterFormValues>>;
  skills: Skill[];
}

const DevFilters = ({ setSearchFilter, skills }: IDevFilters) => {
  const { register, handleSubmit, control } =
    useForm<DeveloperFilterFormValues>({
      defaultValues: {
        searchKeyword: "",
        skillsFilter: [],
        speaksSwedish: false,
      },
    });

  const processingData = (filterData: DeveloperFilterFormValues) => {
    console.log("clicked search", filterData);
    setSearchFilter(filterData);
  };

  return (
    <form onSubmit={handleSubmit(processingData)}>
      <Controller
        control={control}
        name="searchKeyword"
        render={({ field: { onChange } }) => (
          <Autocomplete
            {...register("searchKeyword")}
            id="skill-selection"
            freeSolo
            sx={{ background: "#ffffff" }}
            options={skills.map((skill) => skill.title)}
            renderInput={(params) => (
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
        <Controller
        
          control={control}
          name="skillsFilter"
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ marginInlineStart: 0, marginBlock: 2, minWidth: 250 }} size="small">
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
                renderValue={(selected) => selected.join(", ")}
              >
                {skills
                  .filter((skill) => skill.type === "Programming Language")
                  .map((skill) => (
                    <MenuItem key={skill.id} value={skill.title}>
                      <Checkbox checked={value.indexOf(skill.title) > -1} />
                      <ListItemText primary={skill.title} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        />
        <FormControlLabel
          {...register("speaksSwedish")}
          control={<Checkbox />}
          label="Speaks Swedish"
        />

        <Button variant="outlined" type="submit" className="w-full">
          Search
        </Button>
      </div>
    </form>
  );
};

export default DevFilters;

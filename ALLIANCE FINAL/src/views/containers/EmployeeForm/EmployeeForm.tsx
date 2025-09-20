import React, { useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import Grid from '@mui/material/Grid2';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ContentPaper from "../../components/ContentPaper";
import { createEmployee } from "./service";


export const EmployeeForm = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [position, setPosition] = useState("");

  const handlePositionChange = (event: SelectChangeEvent<string>) => {
    setPosition(event.target.value as string);
  };

  const handleFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(event.target.value);
  };

  const handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(event.target.value);
  };

  const handleOnSubmit = () => {
    createEmployee({ firstname, lastname, position }).then(() => {
      alert("Employee created successfully");
    }).finally(() => {
      setFirstname("");
      setLastname("");
      setPosition("");
    });
  };

  return (
    <Container maxWidth="xl">
      <Box
        component="form"
        noValidate
        autoComplete="off"
      >
      <ContentPaper elevation={3}>
      <Grid container spacing={1} justifyContent={"center"}>
        <Grid size={12}>
          <TextField
              name="firstname"
              label="Firstname"
              value={firstname}
              placeholder="Firstname"
              variant="outlined"
              onChange={handleFirstnameChange}
              fullWidth
          />
        </Grid>
        <Grid size={12}>
          <TextField
              name="lastname"
              label="Lastname"
              value={lastname}
              placeholder="Lastname"
              variant="outlined"
              onChange={handleLastnameChange}
              fullWidth
          />
        </Grid>
        <Grid size={12}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Position</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Position"
              value={position}
              onChange={handlePositionChange}
            >
              <MenuItem value={"QA Tester"}>QA Tester</MenuItem>
              <MenuItem value={"Developer"}>Developer</MenuItem>
              <MenuItem value={"Designer"}>Designer</MenuItem>
              <MenuItem value={"Project Manager"}>Project Manager</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleOnSubmit}>Submit</Button>
        </Grid>
        </Grid>
        </ContentPaper>
      </Box>
    </Container>
  );
};

import React, { useEffect } from "react";
import { Container } from "@mui/material";
import ContentPaper from "../../components/ContentPaper";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getEmployees } from "./service";
import { Size, Typography } from "../../components/Typography/Typography";

interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  position: string;
}

export const EmployeeList = () => {
  const [loading, setLoading] = React.useState(true);
  const [employees, setEmployees] = React.useState<Array<Employee>>([]);

  const columns: Array<GridColDef> = [
    { field: "firstname", headerName: "First name", width: 150 },
    { field: "lastname", headerName: "Last name", width: 150 },
    { field: "position", headerName: "Position", width: 150 },
  ];

  useEffect(() => {
    getEmployees().then((response) => {
      setEmployees(response.data);
    }).finally(() => {   
      setLoading(false);
    });
  }, []);

  return (
    <Container maxWidth="xl">            
      {/* <Typography style={{ color: "green" }} label={"Label 1"} />
      <Typography style={{ color: "red" }} label={"Label 2"} />
      <Typography style={{ color: "blue" }} label={"Label 3"} />
      <Typography style={{ color: "yellow" }} label={"Label 4"} />
      <Typography style={{ color: "violet" }} label={"Label 5"} />
      <Typography label={"Label 6"} /> */}
      <div style = {{ display: "grid" }}>
        <Typography 
          label = {"Label"} 
          style = {{ color: "red"}}
          size = {Size.SMALL}    
        />
        <Typography 
          label = {"Label"} 
          style = {{ color: "red"}}
          size = {Size.MEDIUM}    
        />
        <Typography 
          label = {"Label"} 
          style = {{ color: "red"}}
          size = {Size.LARGE}    
        />
      </div>
    </Container>
  );
};

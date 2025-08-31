import React from "react";
import { Container } from "@mui/material";
import ContentPaper from "../../components/ContentPaper";
import {Typography} from "@mui/material";

export const Homepage = () => {
  return (
    <Container maxWidth="xl">
      <ContentPaper>
      <Typography variant="h3" align="center">This is Home Page</Typography>
      </ContentPaper>
    </Container>
  );
};

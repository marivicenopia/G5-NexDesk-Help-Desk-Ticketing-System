<<<<<<< Updated upstream
import Box from "@mui/material/Box";
=======
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import CreateTicket from './CreateTicket';
import DeleteTicket from './DeleteTicket';
import EditTicket from './EditTicket';
import ViewTicket from './ViewTicket';
import AssignTicket from './AssignTicket'; // Import your new AssignTicket component
import ReassignTicket  from './ReAssignTicket';
import './component-fixes.css';
>>>>>>> Stashed changes

import { AppRoutes } from "./routes";

const App = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <AppRoutes />
    </Box>
  );
};

export default App;

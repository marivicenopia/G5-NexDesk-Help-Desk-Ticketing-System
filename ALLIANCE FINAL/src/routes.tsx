import React from "react";
import { Routes, Route } from "react-router-dom";
import * as Views from "./views/containers";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index path="/" element={<Views.Homepage />} />
      <Route path="/employee" element={<Views.EmployeeList />} />
      <Route path="/employee/add" element={<Views.EmployeeForm />} />
      <Route path="/employee/details" element={<Views.EmployeeDetails />} />
      <Route path = "*" element={<Views.NotFoundScreen />} />
    </Routes>
  );
};

export default AppRoutes;

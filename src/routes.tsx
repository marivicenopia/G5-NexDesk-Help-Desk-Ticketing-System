<<<<<<< HEAD
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
=======
// import React from "react";
// import {BrowserRouter, Routes, Route} from 'react-router-dom';
// import * as Views from './views/containers';
// import { PATHS } from "./constant";

// export const AppRoutes: React.FC = () => {
//     return(
//         <BrowserRouter>
//             <Routes>
//                 <Route path={PATHS.MANAGE_TICKETS.path} element={<Views.TicketManagement/>}/>
//                 <Route path={PATHS.MANAGE_USERS.path} element={<Views.UserManagement/>}/>
//             </Routes>
//         </BrowserRouter>
//     )
// }
>>>>>>> origin/main

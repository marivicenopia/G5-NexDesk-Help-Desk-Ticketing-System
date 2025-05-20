import axios from 'axios';

export const createEmployee = async (data: any) => {
  return axios.post('http://localhost:3000/employee', data);
};
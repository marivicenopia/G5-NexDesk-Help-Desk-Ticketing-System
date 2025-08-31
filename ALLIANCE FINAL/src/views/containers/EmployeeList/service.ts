import axios from 'axios';

export const getEmployees = async () => {
  return axios.get('http://localhost:3000/employee');
};
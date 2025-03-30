import axios from 'axios';
import { EmployeeFormData } from '../types/types';

const API_URL = 'http://localhost:5000/api';

export const fetchEmployees = async (token: string) => {
  const response = await axios.get(`${API_URL}/employees/list`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  console.log(response.data)
  console.log(response)
  return response.data;
};

export const addEmployee = async (employeeData: EmployeeFormData, token: string) => {
    const apiData = {
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      accessRightId: employeeData.accessRightId,
      login: employeeData.login,
      password: employeeData.password
    };

    const response = await axios.put(`${API_URL}/employees/add`, apiData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    return response.data;
  };

export const updateEmployeeAccess = async (employeeId: number, newAccessRightId: number, token: string) => {
    const response = await axios.post(
      `${API_URL}/employees/change-access`,
      { employeeId, newAccessRightId },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    return response.data;
  };
  
  export const updateEmployeePassword = async (employeeLogin: string, newPassword: string, token: string) => {
    const response = await axios.post(
      `${API_URL}/employees/change-password`,
      { employeeLogin, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    return response.data;
  };


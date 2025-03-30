export interface Incident {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'closed';
    createdAt: string;
    createdBy: number;
    closedAt?: string;
    closedBy?: number;
    securityLevel: number;
    creator_name?: string;
    closer_name?: string;
    comments?: [
      id: number,
      text: string,
      createdAt: string,
      author: string
    ];
  }

  export interface IncidentComment {
    id: number;
    text: string;
    createdAt: string;
    author: string;
  }

  export interface IncidentC {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'closed';
    createdAt: string;
    createdBy: number;
    closedAt?: string;
    closedBy?: number;
    securityLevel: number;
    creator_name?: string;
    closer_name?: string;
    comments: IncidentComment[];
  }
  
  export interface User {
    employeeId: number;
    permissionLevel: number; 
    firstName: string;
    lastName: string;
    token: string;
  }

export interface Employee {
    id: number;
    firstName: string;  
    lastName: string;   
    accessRightId: number;
    permissionLevel?: number;
  }
  
  export interface EmployeeFormData {
    firstName: string;   
    lastName: string;    
    accessRightId: number;
    login: string;
    password: string;
  }
  
  export interface AuthInfo {
    login: string;
    password_hash: string;
    employee_id: number;
  }
  
  export interface ApiError {
    message: string;
    status?: number;
  }
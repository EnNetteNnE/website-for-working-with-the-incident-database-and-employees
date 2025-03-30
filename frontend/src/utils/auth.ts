export const storeAuthData = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  export const getAuthData = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  };
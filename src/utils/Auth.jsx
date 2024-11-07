
export const isAuthenticated = () => {
    const token = sessionStorage.getItem('jwt_token');
    return token !== null;
  };
  
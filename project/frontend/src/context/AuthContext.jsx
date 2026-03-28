import { createContext, useState, useContext, useEffect } from 'react';
import { graphqlRequest } from '../utils/graphql';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const query = `
        query {
          me {
            id
            name
            email
            phone
            role
            age
            isActive
          }
        }
      `;

      const data = await graphqlRequest(query);
      setUser(data.me);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const query = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            name
            email
            phone
            role
            age
            isActive
          }
        }
      }
    `;

    const data = await graphqlRequest(query, {
      input: { email, password }
    });

    localStorage.setItem('token', data.login.token);
    setUser(data.login.user);
    return data.login;
  };

  const register = async (registerData) => {
    const query = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            id
            name
            email
            phone
            role
            age
            isActive
          }
        }
      }
    `;

    const data = await graphqlRequest(query, {
      input: registerData
    });

    localStorage.setItem('token', data.register.token);
    setUser(data.register.user);
    return data.register;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

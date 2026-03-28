const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const GRAPHQL_ENDPOINT = `${API_URL}/graphql`;

export const graphqlRequest = async (query, variables = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables
    })
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
};

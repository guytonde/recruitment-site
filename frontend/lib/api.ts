const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiCall(
  endpoint: string,
  options?: RequestInit & { token?: string }
) {
  const { token, ...requestOptions } = options || {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...requestOptions.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API error');
  }

  return response.json();
}

export async function register(email: string, password: string, name: string) {
  return apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export async function login(email: string, password: string) {
  return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(refreshToken: string) {
  return apiCall('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getMe(token: string) {
  return apiCall('/api/users/me', { token });
}

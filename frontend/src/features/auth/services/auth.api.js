export const login = async (data) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to login');
    }
    return result;
}

export const register = async (data) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to register');
    }
    return result;
}

export const logout = async () => {
    const response = await fetch('/api/auth/logout', {
        method: 'GET'
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to logout');
    }
    return result;
}

export const getMe = async () => {
    const response = await fetch('/api/auth/get-me', {
        method: 'GET'
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to get user');
    }
    return result;
}
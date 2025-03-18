const API_BASE_URL = 'https://busypad-api.ashycliff-ef628af8.westus2.azurecontainerapps.io';

// User related API calls
export const userApi = {
    // Login user
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'password',
                    username: email,
                    password: password
                }).toString()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (!data.access_token) {
                throw new Error('No access token received');
            }

            // Store the token
            tokenService.setToken(data.access_token);
            
            // Store minimal user data
            const userData = {
                email: email,
                isLoggedIn: true
            };
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("isLoggedIn", "true");

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Device login
    deviceLogin: async (deviceCode) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/device`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    device_code: deviceCode
                })
            });

            const data = await response.json();
            console.log('Device login response:', data); // Log the response data
            
            if (!response.ok) {
                throw new Error(data.message || 'Device login failed');
            }

            // Store the token - use data.token instead of data.access_token
            const token = data.token;
            if (!token) {
                throw new Error('No access token received');
            }

            tokenService.setToken(token);
            
            // Store device user data
            const userData = {
                email: `Device-${deviceCode}`,
                isLoggedIn: true
            };
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("isLoggedIn", "true");

            return data;
        } catch (error) {
            console.error('Device login error:', error);
            throw error;
        }
    },

    // Register user
    signup: async (email, password, name, deviceCode) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    name,
                    device_code: deviceCode // API expects device_code
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    // Toggle game playability
    toggleGamePlayability: async (token, gameId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/games/${gameId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to toggle game status');
            }

            return await response.json();
        } catch (error) {
            console.error('Toggle game status error:', error);
            throw error;
        }
    },
};

// Games API calls
export const gamesApi = {
    // Get all games for admin
    getAllGames: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/games`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    tokenService.removeToken();
                    localStorage.removeItem('userData');
                    throw new Error('Session expired');
                }
                throw new Error('Failed to get games');
            }

            const data = await response.json();
            const defaultImage = '/images/game-place-holder.jpg';
            
            // Process games with default values
            return data.games.map(game => ({
                id: game.id,
                title: game.name,
                image_url: game.image_url || defaultImage,
                description: game.description || 'No description',
                is_playable: game.is_playable,
                url: game.url,
                category: game.category
            }));
        } catch (error) {
            console.error('Get games error:', error);
            throw error;
        }
    },

    // Get games for device users
    getPlayerGames: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/player/games`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    tokenService.removeToken();
                    localStorage.removeItem('userData');
                    throw new Error('Session expired');
                }
                throw new Error('Failed to get games');
            }

            const data = await response.json();
            const defaultImage = '/images/game-place-holder.jpg';
            
            // Process games with default values
            return data.games.map(game => ({
                id: game.id,
                title: game.name,
                image_url: game.image_url || defaultImage,
                description: game.description || 'No description',
                is_playable: true, // All games from player/games are playable
                url: game.url,
                category: game.category
            }));
        } catch (error) {
            console.error('Get player games error:', error);
            throw error;
        }
    },

    // Get player game by ID
    getPlayerGameById: async (token, gameId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/player/games/${gameId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    tokenService.removeToken();
                    localStorage.removeItem('userData');
                    throw new Error('Session expired');
                }
                throw new Error('Failed to get game details');
            }

            const game = await response.json();
            return game;
        } catch (error) {
            console.error('Get player game error:', error);
            throw error;
        }
    },

    // Get game by ID
    getGameById: async (gameId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/games/${gameId}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get game');
            }

            return await response.json();
        } catch (error) {
            console.error('Get game error:', error);
            throw error;
        }
    },
};

// Auth token management
export const tokenService = {
    setToken: (token) => {
        localStorage.setItem('token', token);
    },
    
    getToken: () => {
        return localStorage.getItem('token');
    },
    
    removeToken: () => {
        localStorage.removeItem('token');
    },
};

export default {
    userApi,
    gamesApi,
    tokenService,
}; 
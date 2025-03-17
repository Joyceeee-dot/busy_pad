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

// Games related API calls
export const gamesApi = {
    // Get all games
    getAllGames: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/games`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get games');
            }

            const data = await response.json();
            const defaultImage = '/images/game-place-holder.jpg';
            
            // 处理每个游戏的数据，设置默认值
            const processedGames = (data.games || []).map(game => ({
                ...game,
                title: game.name,
                image: game.image || defaultImage,
                description: game.description || 'No description'
            }));

            return processedGames;
        } catch (error) {
            console.error('Get games error:', error);
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
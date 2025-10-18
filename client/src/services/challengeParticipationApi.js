import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Get token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create axios instance with auth interceptor
const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const challengeParticipationApi = {
    // Get all active challenges
    getActiveChallenges: async () => {
        try {
            const response = await apiClient.get('/challenges/active');
            return response.data;
        } catch (error) {
            console.error('Error fetching active challenges:', error);
            throw error;
        }
    },

    // Get artist's challenge participations
    getArtistParticipations: async (artistId) => {
        try {
            const response = await apiClient.get(`/challenge-participants/artist/${artistId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching artist participations:', error);
            throw error;
        }
    },

    // Submit artwork for a challenge
    submitChallengeParticipation: async (participationData) => {
        try {
            const formData = new FormData();
            formData.append('challengeId', participationData.challengeId);
            formData.append('artworkTitle', participationData.artworkTitle);
            formData.append('artworkDescription', participationData.artworkDescription);
            formData.append('artworkImage', participationData.artworkImage);

            const response = await apiClient.post('/challenge-participants/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting challenge participation:', error);
            throw error;
        }
    },

    // Check if artist has already participated in a challenge
    checkParticipation: async (challengeId) => {
        try {
            const response = await apiClient.get(`/challenge-participants/check/${challengeId}`);
            return response.data;
        } catch (error) {
            console.error('Error checking participation:', error);
            throw error;
        }
    },

    // Get challenge details
    getChallengeDetails: async (challengeId) => {
        try {
            const response = await apiClient.get(`/challenges/${challengeId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching challenge details:', error);
            throw error;
        }
    },
};

export default challengeParticipationApi;

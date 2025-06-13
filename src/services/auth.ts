import axios from 'axios';

const AUTH_API_BASE_URL = 'https://20.215.192.90/api';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection or contact support.'));
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (registerData: {
    username: string;
    displayName: string;
    email: string;
    profilePicture: File | null;
    password: string;
    gender: string;
    birthDate: string;
    bio: string;
  }) => {

    let profilePictureBytes: number[] = [0]; // Default value
    
    if (registerData.profilePicture) {
      try {
        const arrayBuffer = await registerData.profilePicture.arrayBuffer();
        profilePictureBytes = Array.from(new Uint8Array(arrayBuffer));
      } catch (error) {
        console.error('Error converting profile picture to byte array:', error);
      }
    }

    const requestData = {
      username: registerData.username,
      displayName: registerData.displayName,
      email: registerData.email,
      profilePicture: profilePictureBytes,
      password: registerData.password,
      gender: registerData.gender,
      birthDate: registerData.birthDate,
      bio: registerData.bio,
    };

    return authApi.post('/Auth/register', requestData);
  },

  login: async (emailOrUser: string, password: string) => {
    const requestData = {
      emailOrUser,
      password,
    };

    return authApi.post('/Auth/login', requestData);
  },
};

export default authApi;
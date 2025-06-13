import axios from 'axios';

const COMMUNITY_API_BASE_URL = 'https://20.215.192.90:5002/api';

// Create axios instance with default config
const communityApi = axios.create({
  baseURL: COMMUNITY_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


communityApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
   
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
    } else {
      console.warn('No token found in localStorage');
    }
    

    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);


communityApi.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection or contact support.'));
    }
    
    console.error('Error response:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      url: error.config.url,
    });
    
    return Promise.reject(error);
  }
);

export const communityAPI = {
  fetchUserCommunities: async () => {
    return communityApi.get('/Commuity');
  },
  
  createCommunity: async (communityData: {
    name: string;
    description: string;
    banner?: number[];
    isPublic: boolean;
  }) => {
    // Always set isPublic to false as per requirements
    const requestData = {
      ...communityData,
      isPublic: false,
      banner: communityData.banner || [0], // Default banner if not provided
    };
    
    return communityApi.post('/Commuity/create', requestData);
  },
  
  deleteCommunity: async (communityId: string) => {
    return communityApi.delete(`/Commuity/delete?communityId=${communityId}`);
  },
  
  modifyCommunity: async (communityId: string, communityData: {
    name: string;
    description: string;
    banner?: number[];
  }) => {
    // Remove isPublic from the type definition as per requirements
    const requestData = {
      name: communityData.name,
      description: communityData.description,
      banner: communityData.banner || [0], // Default banner if not provided
    };
    
    return communityApi.put(`/Commuity?communityId=${communityId}`, requestData);
  },
  
  generateInviteCode: async (communityId: string) => {
    return communityApi.post(`/Commuity/generate/${communityId}`);
  },
  
  joinCommunityWithCode: async (code: string) => {
    return communityApi.post(`/Commuity/join?code=${code}`);
  },
  
  leaveCommunity: async (communityId: string) => {
    return communityApi.post(`/Commuity/leave?communityId=${communityId}`);
  },
};

export default communityApi;
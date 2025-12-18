import axios from 'axios';
import type { UploadResponse, SummaryResponse, AskResponse } from '../types';

const API_BASE_URL = 'https://mescours-backend.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const courseApi = {
  // Get supported file formats
  getSupportedFormats: async () => {
    const response = await api.get('/api/courses/supported-formats');
    return response.data;
  },

  // Upload a file and extract text
  uploadFile: async (file: File, apiKey?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (apiKey) {
      formData.append('api_key', apiKey);
    }

    const response = await api.post('/api/courses/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Generate summary from course content
  summarize: async (
    courseContent: string,
    apiKey: string,
    language: string
  ): Promise<SummaryResponse> => {
    const response = await api.post('/api/courses/summarize', {
      course_content: courseContent,
      api_key: apiKey,
      language,
    });
    return response.data;
  },

  // Ask a question about the course
  askQuestion: async (
    courseContent: string,
    question: string,
    apiKey: string
  ): Promise<AskResponse> => {
    const response = await api.post('/api/courses/ask', {
      course_content: courseContent,
      question: question,
      api_key: apiKey,
    });
    return response.data;
  },
};

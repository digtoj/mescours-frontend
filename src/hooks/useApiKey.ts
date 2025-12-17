import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
    setIsLoaded(true);
  }, []);

  // Save API key
  const saveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
  };

  // Remove API key
  const removeApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey(null);
  };

  // Check if API key exists
  const hasApiKey = !!apiKey;

  return {
    apiKey,
    hasApiKey,
    isLoaded,
    saveApiKey,
    removeApiKey,
  };
}

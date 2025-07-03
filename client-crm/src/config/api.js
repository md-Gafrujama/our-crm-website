// src/config/api.js
// Simple API configuration

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://our-crm-website.vercel.app';

export { API_BASE_URL };
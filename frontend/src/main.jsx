// Import necessary modules and components
import { StrictMode } from 'react'; // Import StrictMode to highlight potential problems in the application
import { createRoot } from 'react-dom/client'; // Import createRoot for rendering the React app
import "stream-chat-react/dist/css/v2/index.css";
import './index.css'; // Import global CSS styles for the application
import App from './App.jsx'; // Import the main App component
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing capabilities

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider for managing server state and data fetching

// Create a new instance of QueryClient to manage queries
const queryClient = new QueryClient();

// Render the application to the DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the application in BrowserRouter to enable routing */}
    <BrowserRouter>
      {/* Provide the QueryClient to the application for React Query */}
      <QueryClientProvider client={queryClient}>
        <App /> {/* Render the main App component */}
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);

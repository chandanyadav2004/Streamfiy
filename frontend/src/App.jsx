   import React from "react"; // Import React
   import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
   import LoginPage from "./pages/LoginPage.jsx"; // Import LoginPage component
   import HomePage from "./pages/HomePage.jsx"; // Import HomePage component
   import SignUpPage from "./pages/SignUpPage.jsx"; // Import SignUpPage component
   import NotificationPage from "./pages/NotificationPage.jsx"; // Import NotificationPage component
   import CallPage from "./pages/CallPage.jsx"; // Import CallPage component
   import ChatPage from "./pages/ChatPage.jsx"; // Import ChatPage component
   import OnBoardingPage from "./pages/OnBoardingPage.jsx"; // Import OnBoardingPage component

   import { Toaster } from "react-hot-toast"; // Import Toaster for toast notifications
   import { useQuery } from "@tanstack/react-query"; // Import useQuery hook from React Query
   import { axiosInstance } from "./lib/axios.js"; // Import the configured axios instance

   const App = () => {
     // Use the useQuery hook to fetch user data from the API
     const { data: authData, isLoading, error } = useQuery({
       queryKey: ["authUser"], // Unique key for the query
       queryFn: async () => {
         const res = await axiosInstance.get("auth/me"); // Make GET request to the API
         return res.data; // Return the response data
       },
       retry: false // Disable retry for auth check
     });

     const authUser  = authData?.user;

     return (
       <div className="h-screen" data-theme="night">
         {/* Define the routes for the application */}
         <Routes>
           <Route path="/" element={authUser  ? <HomePage /> : <Navigate to="/login" />} /> {/* Home page route */}
           <Route path="/signup" element={!authUser  ? <SignUpPage /> : <Navigate to="/" />} /> {/* Sign up page route */}
           <Route path="/login" element={!authUser  ? <LoginPage /> : <Navigate to="/" />} /> {/* Login page route */}
           <Route path="/notifications" element={authUser  ? <NotificationPage /> : <Navigate to="/login" />} /> {/* Notifications page route */}
           <Route path="/call" element={authUser  ? <CallPage /> : <Navigate to="/login" />} /> {/* Call page route */}
           <Route path="/chat" element={authUser  ? <ChatPage /> : <Navigate to="/login" />} /> {/* Chat page route */}
           <Route path="/onboarding" element={authUser  ? <OnBoardingPage /> : <Navigate to="/login" />} /> {/* Onboarding page route */}
         </Routes>

         <Toaster /> {/* Render the Toaster component for toast notifications */}
       </div>
     );
   }

   export default App; // Export the App component for use in other parts of the application
   
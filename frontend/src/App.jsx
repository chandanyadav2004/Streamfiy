import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
import LoginPage from "./pages/LoginPage.jsx"; // Import LoginPage component
import HomePage from "./pages/HomePage.jsx"; // Import HomePage component
import SignUpPage from "./pages/SignUpPage.jsx"; // Import SignUpPage component
import NotificationPage from "./pages/NotificationPage.jsx"; // Import NotificationPage component
import CallPage from "./pages/CallPage.jsx"; // Import CallPage component
import ChatPage from "./pages/ChatPage.jsx"; // Import ChatPage component
import OnBoardingPage from "./pages/OnBoardingPage.jsx"; // Import OnBoardingPage component

import { Toaster } from "react-hot-toast"; // Import Toaster for toast notifications
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";

const App = () => {
  // Use the useQuery hook to fetch user data from the API

  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme="night">
      {/* Define the routes for the application */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <HomePage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />{" "}
        {/* Home page route */}
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />{" "}
        {/* Sign up page route */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />{" "}
        {/* Login page route */}
        <Route
          path="/notifications"
          element={
            isAuthenticated ? <NotificationPage /> : <Navigate to="/login" />
          }
        />{" "}
        {/* Notifications page route */}
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
        />{" "}
        {/* Call page route */}
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        />{" "}
        {/* Chat page route */}
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />{" "}
        {/* Onboarding page route */}
      </Routes>
      <Toaster /> {/* Render the Toaster component for toast notifications */}
    </div>
  );
};

export default App; // Export the App component for use in other parts of the application

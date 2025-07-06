import React from 'react'; // Importing React library
import { ShipWheelIcon } from "lucide-react"; // Importing the ShipWheelIcon from lucide-react
import { useState } from 'react'; // Importing useState hook from React for managing state
import { Link } from 'react-router';

import useSignUp from '../hooks/useSignUp';

function SignUpPage() { // Defining the SignUpPage functional component

  // State to hold the signup data
  const [signupData, setSignupData] = useState({
    fullName: "", // Initial state for full name
    email: "", // Initial state for email
    password: "", // Initial state for password
  });

  const {isPending,error , signupMutation} = useSignUp();
  // Function to handle form submission
  const handleSignup = (e) => {
    e.preventDefault(); // Preventing the default form submission behavior
    signupMutation(signupData); // Triggering the mutation with the signup data
  }

  return (
    <div className='h-screen overflow-auto flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest"> {/* Main container with full height and centered content */}
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden"> {/* Container for the signup form */}
        
        {/* SIGNUP FORM - LEFT SIDE  */}
        <div className="w-full lg:w-1/2 p-2 sm:p-8 flex flex-col "> {/* Left side for the signup form */}
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-2 "> {/* Logo container */}
            <ShipWheelIcon className='size-9 text-primary ' /> {/* Ship wheel icon */}
            <span className='text-3 font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Streamify</span> {/* Brand name with gradient text */}
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className='alert mb-4 alert-error'>
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full"> {/* Full width container for the form */}
            <form onSubmit={handleSignup}> {/* Form element with onSubmit handler */}
              <div className="space-y-4"> {/* Vertical spacing between elements */}
                <div>
                  <h2 className="text-xl font-semibold">Create an Account </h2> {/* Heading for the form */}
                  <p className='text-sm opacity-70'> {/* Subtext for the form */}
                    Join Streamify and start your language learning adventure
                  </p>
                </div>

                <div className="space-y-3"> {/* Vertical spacing for input fields */}
                  {/* Full name */}
                  <div className="form-control w-full"> {/* Full name input container */}
                    <label className='label'> {/* Label for the input */}
                      <span className="label-text">Full Name</span> {/* Text for the label */}
                    </label>

                    <input type="text" 
                       placeholder='John Doe' // Placeholder text for the input
                       className='input input-bordered w-full' // Input styling classes
                       value={signupData.fullName} // Controlled input value
                       onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })} // Updating state on change
                       required // Making the field required
                    />
                  </div>
                  {/* Email */}
                  <div className="form-control w-full"> {/* Email input container */}
                    <label className='label'> {/* Label for the input */}
                      <span className="label-text">Email</span> {/* Text for the label */}
                    </label>

                    <input type="email" 
                       placeholder='John@gmail.com' // Placeholder text for the input
                       className='input input-bordered w-full' // Input styling classes
                       value={signupData.email} // Controlled input value
                       onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} // Updating state on change
                       required // Making the field required
                    />
                  </div>
                  {/* Password */}
                  <div className="form-control w-full"> {/* Password input container */}
                    <label className='label'> {/* Label for the input */}
                      <span className="label-text">Password</span> {/* Text for the label */}
                    </label>

                    <input type="text" 
                       placeholder='**********' // Placeholder text for the input
                       className='input input-bordered w-full' // Input styling classes
                       value={signupData.password} // Controlled input value
                       onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} // Updating state on change
                       required // Making the field required
                    />
                    <p className="text-xs opacity-70 mt-1"> {/* Helper text for password requirements */}
                      Password must be at least 6 characters long 
                    </p>
                  </div>

                  <div className="form-control"> {/* Checkbox container for terms and conditions */}
                    <label className="label cursor-pointer justify-start gap-2"> {/* Label for the checkbox */}
                      <input type="checkbox" className="checkbox checkbox-sm" required /> {/* Checkbox input */}
                      <span className='text-xs leading-tight'> {/* Text for the checkbox */}
                        I agree to the {" "}
                        <span className='text-primary hover:underline'>terms of service</span> and{" "} {/* Link to terms of service */}
                        <span className='text-primary hover:underline'>privacy policy</span> {/* Link to privacy policy */}
                      </span>
                    </label>
                  </div>  
                </div>

                <button className='btn btn-primary w-full ' type='submit'> {/* Submit button for the form */}
                  { isPending ? (
                    <>
                    <span className='loading loading-spinner loading-xs'></span>
                    Loading...
                    </>
                  ) : ("Create Account")}
                </button>
                <div className="text-center mt-4"> {/* Centered text for existing users */}
                  <p className='text-sm'>
                    Already have an account? {" "}
                    <Link to="/login" className='text-primary hover:underline'>Sign in</Link> {/* Link to login page */}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'> {/* Right side for illustration */}
          <div className="max-w-md p-8"> {/* Container for the illustration */}
            <div className="relative aspect-square max-w-sm mx-auto"> {/* Aspect ratio container for the image */}
              <img src="/i.png" alt="Language connection illustration" className='w-full h-full' /> {/* Illustration image */}
            </div>

            <div className="text-center space-y-3 mt-6"> {/* Centered text for the right side */}
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2> {/* Heading for the right side */}
              <p className="opacity-70"> {/* Subtext for the right side */}
                Practice conversation, make friends, and improve your language skills together 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage; // Exporting the SignUpPage component for use in other parts of the application

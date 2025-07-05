import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants';

const OnBoardingPage = () => {
  const {authUser} = useAuthUser();

  const queryClient =useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const {mutate:onboardingMutation,isPending} =useMutation({
    mutationFn: completeOnboarding,
    onSuccess: ()=>{
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({queryKey:["authUser"]})
    },
    onError: (error) =>{
      toast.error(error.response.data.message);
    }
  });

  const handleSubmit =(e) =>{
    e.preventDefault();
    onboardingMutation(formState);
  }

  const handleRandomAvtar = () =>{
     // Generate a random avatar for the user
    const idx = Math.floor(Math.random() * 100) + 1; // Generate a number between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;

    setFormState({...formState, profilePic: randomAvatar});
    toast.success("Random profile picture generated!");
  };




  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl ">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* PROFILE PIC CONTAINER  */}

            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img 
                    src={formState.profilePic} alt='Profile Preview' className='w-full h-full object-cover'
                  />
                ):(
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className='size-12 text-base-content opacity-40'/>
                  </div>
                )}
              </div>

              {/* Generate Random Avatar btn */}
              <div className="flex items-center gap-2">
                <button type='button' onClick={handleRandomAvtar} className='btn btn-accent'>
                  <ShuffleIcon className='size-4 mr-2'/>
                  Generate Random Avatar
                </button>
              </div>

              



            </div>

            {/* FULL NAME */}
            <div className="form-control w-full"> {/* Full name input container */}
              <label className='label'> {/* Label for the input */}
                <span className="label-text">Full Name</span> {/* Text for the label */}
              </label>

              <input type="text" 
                  name='fullName'
                  value={formState.fullName} // Controlled input value
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })} // Updating state on change
                  className='input input-bordered w-full' // Input styling classes
                  placeholder='Your full name' // Placeholder text for the input
              />
            </div>

            {/* BIO */}
            <div className="form-control w-full"> {/* Full name input container */}
              <label className='label'> {/* Label for the input */}
                <span className="label-text">Bio</span> {/* Text for the label */}
              </label>

              <input type="text" 
                  name='bio'
                  value={formState.bio} // Controlled input value
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })} // Updating state on change
                  className='textarea textarea-bordered h-14' // Input styling classes
                  placeholder='Tell others about yourself and your language learning goals' // Placeholder text for the input
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGES */}
              <div className="form-control">
                <label className='label'> {/* Label for the input */}
                  <span className="label-text">Native Language</span> {/* Text for the label */}
                </label>
                <select
                    name='nativeLanguage'
                    value={formState.nativeLanguage}
                    onChange={(e)=> setFormState({...formState, nativeLanguage: e.target.value })}
                    className='select select-bordered w-full'
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}

                </select>
              </div>

              {/* LEARNING LANGUAGES */}
              <div className="form-control">
                <label className='label'> {/* Label for the input */}
                  <span className="label-text">Learning Language</span> {/* Text for the label */}
                </label>
                <select
                    name='learningLanguage'
                    value={formState.learningLanguage}
                    onChange={(e)=> setFormState({...formState, learningLanguage: e.target.value })}
                    className='select select-bordered w-full'
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}

                </select>
              </div>
            </div>

            {/* Locations */}
            <div className="form-control w-full"> {/*  input container */}
              <label className='label'> {/* Label for the input */}
                <span className="label-text">Location</span> {/* Text for the label */}
              </label>

              <div className="relative">
                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70'/>
                <input type="text" 
                  name='location'
                  value={formState.location} // Controlled input value
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })} // Updating state on change
                  className='input input-bordered w-full pl-10' // Input styling classes
                  placeholder='City, Country' // Placeholder text for the input
                />
              </div>
            </div>
            
            {/* SUBMIT BUTTON */}
            <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
                  {!isPending ? (
                    <>
                     <ShipWheelIcon className='size-5 mr-2'/>
                     Complete Onboarding
                    </>
                  ) : (
                    <>
                     <LoaderIcon className='animate-spin size-5 mr-2'/>
                     Onboarding....
                    </>
                  )}
            </button>


          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage
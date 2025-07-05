import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { getAuthUser } from '../lib/api';

function useAuthUser() {
  const authUser = useQuery({
       queryKey: ["authUser"], // Unique key for the query
       queryFn: getAuthUser,
       retry: false // Disable retry for auth check
     });
    
     return { isLoading : authUser.isLoading, authUser: authUser.data?.user };
}

export default useAuthUser
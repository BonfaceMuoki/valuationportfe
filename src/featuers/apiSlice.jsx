import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials,logOut } from './authSlice'
import { Navigate,useNavigate } from 'react-router-dom'

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        console.log("Sending request");
        headers.set('Accept', 'Application/json');
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    console.log(result?.error?.status);
    // if (result?.error?.status === 403) {
    //     console.log('sending refresh token');
    //     // send refresh token to get new access token 
    //     const refreshResult = await baseQuery({
    //         url: `/api/auth/refresh-token`,
    //         method: 'GET'
    //     }, api, extraOptions)
    
    //     console.log(refreshResult);
    //     if (refreshResult?.data) {
    //         const user = api.getState().auth.user 
    //         // store the user data only, token is handled by HTTP-only cookie
    //         api.dispatch(setCredentials({ user }))
    //         // retry the original query
    //         result = await baseQuery(args, api, extraOptions)
    //     } else {
    //         api.dispatch(logOut())
    //     }
    // } else if (result?.error?.status === 401) {      
    //     api.dispatch(logOut())
    // }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})
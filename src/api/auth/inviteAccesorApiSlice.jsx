import { apiSlice } from "../../featuers/apiSlice"
export const inviteAccesorApiSlice = apiSlice.injectEndpoints({   
    endpoints: builder => ({      
        getAccesorInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-accessor-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        getAccesorUserInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-accessor-user-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        registerAccesor: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/register-accesor`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        registerAccesorUser: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/register-accesor-user`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),requestLenderCourtAccess: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/request-accesor-access`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        requestAccesorRegistrationStatus: builder.query({
            query: (request) => ({
                url: `/api/admin/get-accesor-request-registration-status?req=${request}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        archiveAccesorRegistrationRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/archive-accesor-registration-request`,
                method: 'POST',
                body:formdata,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const {
    useArchiveAccesorRegistrationRequestMutation,
    useRequestLenderCourtAccessMutation,
    useRequestAccesorRegistrationStatusQuery,
    useRegisterAccesorMutation,
    useRegisterAccesorUserMutation,
    useGetAccesorInviteDetailsQuery,
    useGetAccesorUserInviteDetailsQuery
} = inviteAccesorApiSlice ;
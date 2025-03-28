import { apiSlice } from "../../featuers/apiSlice"
import { useSelector } from "react-redux";

export const inviteValuerApiSlice = apiSlice.injectEndpoints({

    endpoints: builder => ({
        getValuerUserInvites: builder.query({
            query: (invite_token) => ({
                url: `/api/commons/get-all-valuer-user-invites`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        getValuerUserInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-valuer-user-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        registerUploaderUser: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/register-valuer-user`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        getValuerInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/access-requests/valuer/get-invite-details?inviteToken=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        registerUploader: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/valuation-firm/complete-registration`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        requestUploaderAccess: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/valuation-firm/request-access`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        requestUploaderRegistrationStatus: builder.query({
            query: (request) => ({
                url: `/api/admin/get-Valuer-request-registration-status?req=${request}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        archiveUploaderRegistrationRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/archive-valuer-registration-request`,
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const {
    useGetValuerUserInvitesQuery,
    useArchiveUploaderRegistrationRequestMutation,
    useRegisterUploaderMutation,
    useRequestUploaderAccessMutation,
    useRequestUploaderRegistrationStatusQuery,
    useRegisterUploaderUserMutation,
    useGetValuerUserInviteDetailsQuery,
    useGetValuerInviteDetailsQuery
} = inviteValuerApiSlice;
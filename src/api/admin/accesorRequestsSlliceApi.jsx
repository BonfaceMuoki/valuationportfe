import { apiSlice } from "../../featuers/apiSlice"
export const accesorRequestsSlliceApi = apiSlice.injectEndpoints({   
    endpoints: builder => ({
        getAccesorRequests: builder.query({
            query: ({ currentPage, rowsPerPage, searchText, orderColumn, sortOrder }) => ({
                url: `/api/admin/access-requests/valuers?page=${currentPage}&no_records=${rowsPerPage}&search=${searchText}&orderby=${orderColumn}&sortOrder=${sortOrder}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        approveAccesorRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/accept-accesor-access-request`,
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        rejectAccesorRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/reject-accesor-access-request`,
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetAccesorRequestsQuery,useApproveAccesorRequestMutation,useRejectAccesorRequestMutation
} = accesorRequestsSlliceApi ;
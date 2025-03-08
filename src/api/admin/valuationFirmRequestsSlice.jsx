import { apiSlice } from "../../featuers/apiSlice"
export const valuationFirmRequestsSlliceApi = apiSlice.injectEndpoints({

    endpoints: builder => ({
        getValuationFirmRequests: builder.query({
            query: () => ({
                url: `/api/admin/get-valuation-access-requests`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        approveValuationFirmRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/accept-valuation-access-request`,
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        rejectValuationFirmRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/reject-valuation-access-request`,
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        getValuationReports: builder.query({
            query: ({ currentPage, rowsPerPageS, searchText, orderColumn, sortOrder }) => ({
                url: `/api/commons/get-reports-list?page=${currentPage}&no_records=${rowsPerPageS}&search=${searchText}&orderby=${orderColumn}&sortOrder=${sortOrder}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        getPropertyTypeList: builder.query({
            query: () => `/api/commons/get-all-propertytypes`,
            skipCache: true,
            keepUnusedDataFor: 5,
            refetchOnFocus: true,
        })
    })
})

export const {
    useGetValuationFirmRequestsQuery,
    useApproveValuationFirmRequestMutation,
    useRejectValuationFirmRequestMutation,
    useGetValuationReportsQuery
} = valuationFirmRequestsSlliceApi;
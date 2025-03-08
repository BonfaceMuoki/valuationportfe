import { apiSlice } from "../featuers/apiSlice";
import { useSelector } from "react-redux";

export const CommonEnpointsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ currentPage, rowsPerPage, searchText, orderColumn, sortOrder }) => ({
        url: `/api/commons/get-all-users?page=${currentPage}&no_records=${rowsPerPage}&search=${searchText}&orderby=${orderColumn}&sortOrder=${sortOrder}`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getAccesorsList: builder.query({
      query: () => `/api/commons/get-accesors-list`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getValuersList: builder.query({
      query: () => `/api/commons/get-uploaders-list`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getPropertyTypeList: builder.query({
      query: () => `/api/commons/get-all-propertytypes`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getAllCounties: builder.query({
      query: () => `/api/commons/get-all-counties`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    sendValuationFirmUserInvite: builder.mutation({
      query: (formData) => ({
        url: `/api/uploader/send-user-invite`,
        method: "POST",
        body: formData,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    uploadValuationReportV2: builder.mutation({
      query: (formData) => ({
        url: "/api/uploader/upload-valuation-report-v2",
        method: "POST",
        body: formData,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetAllCountiesQuery,
  useGetUsersQuery,
  useGetAccesorsListQuery,
  useGetValuersListQuery,
  useGetPropertyTypeListQuery,
  useUploadValuationReportV2Mutation,
  useSendValuationFirmUserInviteMutation,
} = CommonEnpointsApi;

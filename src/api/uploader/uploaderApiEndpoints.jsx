import { apiSlice } from "../../featuers/apiSlice";
import { useSelector } from "react-redux";


export const uploaderApiEndpoints = apiSlice.injectEndpoints({
    endpoints: builder => ({
        cacheReportDocument: builder.mutation({
            query: (formData) => ({
                url: '/api/uploader/upload-cached-report-document',
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            })
        }),
        submitValuationReport: builder.mutation({
            query: (formData) => ({
                url: '/api/uploader/upload-valuation-report',
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json',
                }
            })
        }),
        downLoadCachedFile: builder.mutation({
            query: (file) => {
                if (file) {
                    return {
                        url: `/api/uploader/download-cached-image?file=${file}`,
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    };
                } else {
                    // Handle the case where 'file' is null or undefined
                    // You can return an error message or perform any other desired action
                    console.error('File is null or undefined.');
                    return null; // Return null or an appropriate value
                }
            }
        }),
        getCurrentUploadedFile: builder.query({
            query: () => `/api/uploader/get-current-uploaded-file`,
            skipCache: true,
            keepUnusedDataFor: 5,
            refetchOnFocus: true,
        })
    })
})

export const {
    useCacheReportDocumentMutation,
    useGetCurrentUploadedFileQuery,
    useDownLoadCachedFileMutation,
    useSubmitValuationReportMutation,
} = uploaderApiEndpoints;
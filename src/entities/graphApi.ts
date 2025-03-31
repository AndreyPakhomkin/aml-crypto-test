import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IGetDataResponse, IGetDataParams } from './types';

export const graphApi = createApi({
    reducerPath: 'graphApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getData: builder.mutation<IGetDataResponse, IGetDataParams>({
            query: ({ adress }) => ({
                url: 'messages',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    address: adress
                }
            }),
            transformResponse: (response: IGetDataResponse) => (response)
        })
    })
})

export const { useGetDataMutation } = graphApi;
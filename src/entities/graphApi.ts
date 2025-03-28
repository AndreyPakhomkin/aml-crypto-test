import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IGetDataResponse } from './types';

export const graphApi = createApi({
    reducerPath: 'graphApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getData: builder.mutation<IGetDataResponse, void>({
            query: () => ({
                url: 'messages',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    address: "0x0001" // нужен динамический адресс в queryParams
                }
            }),
            transformResponse: (response: IGetDataResponse) => (response)
        })
    })
})

export const { useGetDataMutation } = graphApi;
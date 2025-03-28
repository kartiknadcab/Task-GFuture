import { configureStore } from '@reduxjs/toolkit'
import dataSlice from './dataSlice'
export const store = configureStore({
    reducer: {
        user: dataSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }),
})
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { adoptReducer } from './adoptSlice'

export const store = configureStore({
    reducer: {
        adoptReducer: adoptReducer
    },
    middleware: getDefaultMiddleware({
        seriallizableCheck: false,
        immutableCheck: false
    })
})
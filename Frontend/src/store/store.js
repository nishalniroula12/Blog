import {configureStore} from '@reduxjs/toolkit'
import {slice} from '../Redux/Slice'

export const store =configureStore({
    reducer:{
        data:slice.reducer,
    }
})
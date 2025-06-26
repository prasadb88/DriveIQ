import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Store/authSlice.js"
import carSlice from "../Store/carSlice"
const store=configureStore({
    reducer:{
        auth:authSlice,
        carsdata:carSlice
    }
})

export default store
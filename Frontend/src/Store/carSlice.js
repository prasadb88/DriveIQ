import { createSlice } from "@reduxjs/toolkit";

const initialState={
    carstatus:false,
    cardata:null,
    allcardata:null

}
const carSlice=createSlice({
    name:"carsdata",
    initialState,
    reducers:{
       car: (state, action) => {
          state.carstatus = true;
          state.cardata = action.payload.car;
        },
         allcar:(state, action)=>{
            state.carstatus=true,
            state.allcardata=action.payload.allcar
         }

    }
    
})

export const{allcar,car}=carSlice.actions

export default carSlice.reducer
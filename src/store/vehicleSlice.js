import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    vehicles: [],
};

const vehicleSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {
        addVehicleReducer: (state, action) => {
            state.vehicles.push(action.payload);
        },
        setVehiclesReducer: (state, action) => {
            state.vehicles = action.payload;
        },
        deleteVehicleReducer: (state, action) => {
            state.vehicles = state.vehicles.filter(vehicle => vehicle._id !== action.payload);
        },
        updateVehicleReducer: (state, action) => {
            const index = state.vehicles.findIndex(vehicle => vehicle._id === action.payload._id);
            console.log(index);
            if (index !== -1) {
                state.vehicles[index] = action.payload;
            }
        },
    },
});

export const { addVehicleReducer, setVehiclesReducer, deleteVehicleReducer, updateVehicleReducer } = vehicleSlice.actions;

export default vehicleSlice.reducer;
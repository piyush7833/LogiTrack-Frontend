import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    drivers: [],
};

const driverSlice = createSlice({
    name: 'drivers',
    initialState,
    reducers: {
        addDriverReducer: (state, action) => {
            state.drivers.push(action.payload);
        },
        setDriversReducer: (state, action) => {
            state.drivers = action.payload;
        },
        deleteDriverReducer: (state, action) => {
            state.drivers = state.drivers.filter(driver => driver._id !== action.payload);
        },
        updateDriverReducer: (state, action) => {
            const index = state.drivers.findIndex(driver => driver._id === action.payload._id);
            if (index !== -1) {
                state.drivers[index] = action.payload;
            }
        },
    },
});

export const { addDriverReducer, setDriversReducer, deleteDriverReducer, updateDriverReducer } = driverSlice.actions;

export default driverSlice.reducer;
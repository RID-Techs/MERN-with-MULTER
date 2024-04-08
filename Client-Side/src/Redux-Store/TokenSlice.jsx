import { createSlice } from '@reduxjs/toolkit';

const TokenSlice = createSlice({
    name: "token",
    initialState: {value: null},
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setToken } = TokenSlice.actions
export const SelectToken = (state) => state.token.value
export default TokenSlice.reducer
import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  userData: {},
  userExist: false,
  refresh: false,
};
const dataSlice = createSlice({
  name: "dataSlice",
  initialState: {
    value: initialValue,
  },
  reducers: {
    setUserData: (state, action) => {
      state.value.userData = action.payload.userData;
    },
    setUserExist: (state, action) => {
      state.value.userExist = action.payload.userExist;
    },
    setRefresh: (state, action) => {
      state.value.refresh = action.payload.refresh;
    },
  },
});

export const { setUserData, setUserExist,setRefresh } = dataSlice.actions;
export default dataSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { IResponseUser, IResponseUserData, IUser } from '@/types/types.ts';

// Define a type for the slice state
interface IUserState {
	user: IResponseUser | null;
	token: string | null;
	isAuth: boolean;
}

// Define the initial state using that type
const initialState: IUserState = {
	user: null,
	token: null,
	isAuth: false
};

export const userSlice = createSlice({
	name: 'user',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		login: (state, action: PayloadAction<IResponseUserData>) => {
			state.user = action.payload.user;
			state.token = action.payload.accessToken;
			state.isAuth = true;
		},
		logout: (state) => {
			state.isAuth = false;
			state.user = null;
			state.token = null;
		},
		updateUserProfile: (state, action: PayloadAction<IUser>) => {
			if (state.user) {
				state.user = {
					...state.user,
					...action.payload
				}
			}
		}
	}
});

export const { login, logout, updateUserProfile } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { IResponseUser, IResponseUserData, IUser } from '@/types/types.ts';

interface IUserState {
	user: IResponseUser | null;
	token: string | null;
	isAuth: boolean;
}

const initialState: IUserState = {
	user: null,
	token: null,
	isAuth: false
};

export const userSlice = createSlice({
	name: 'user',
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
		actionUpdateUserProfile: (state, action: PayloadAction<IUser>) => {
			if (state.user) {
				state.user = {
					...state.user,
					...action.payload
				}
			}
		}
	}
});

export const { login, logout, actionUpdateUserProfile } = userSlice.actions;


export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;
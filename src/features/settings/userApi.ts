import { BACKEND_URL } from '@/config/env';
import { axiosApi } from '@/main';

import { type UserDataDto } from './types';

const USER_BACKEND_URL = `${BACKEND_URL}/users`;

export const fetchUser = async (): Promise<UserDataDto> => {
  const response = await axiosApi.get<UserDataDto>(USER_BACKEND_URL);
  return response.data;
};

export const createUser = async (userDataDto: UserDataDto): Promise<UserDataDto> => {
  const response = await axiosApi.post<UserDataDto>(USER_BACKEND_URL, userDataDto);
  return response.data;
};

export const deleteUser = async () => {
  await axiosApi.delete(USER_BACKEND_URL);
};

export const updateUsersUsername = async (newUsername: string): Promise<UserDataDto> => {
  const urlWithParams = `${USER_BACKEND_URL}/${newUsername}`;
  const response = await axiosApi.patch<UserDataDto>(urlWithParams, null);
  return response.data;
};

import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_URL;

export const makeReq = axios.create({
  baseURL: API_URL,
});

export const SIGN_UP_URL = `${API_URL}/api/user`;
export const HOME_PAGE = `${API_URL}/`;
export const LOGIN_PAGE = `${API_URL}/sign-in`;
export const SIGN_UP_PAGE = `${API_URL}/sign-up`;
export const GET_LEASES = `${API_URL}/api/lease`;
export const ADD_LEASE = `${API_URL}/api/lease`;
export const UPDATE_LEASE = `${API_URL}/api/lease`;
export const SHARE_LEASE = `${API_URL}/api/lease`;
export const DELETE_LEASE = `${API_URL}/api/lease`;

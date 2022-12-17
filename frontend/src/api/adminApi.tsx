import axios from "axios";
import { OkNullDataReservationResponse } from "../shared/types";

export const adminApi = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const login = async (login: string, password: string) => {
    return await adminApi
        .post<OkNullDataReservationResponse>("/api/admin-gate/login", { login, password })
        .then((response) => {
            return response.data;
        })
        .catch((error) => error);
};

export const logout = async () => {
    return await adminApi
        .get<OkNullDataReservationResponse>("/api/admin/logout")
        .then((response) => {
            return response.data;
        })
        .catch((error) => error);
};

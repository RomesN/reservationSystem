import axios from "axios";
import { OkNullDataReservationResponse } from "../shared/types";

export const adminApi = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const login = async (login: string, password: string) => {
    return await adminApi
        .post<OkNullDataReservationResponse>("/api/admin-gate/login", { login, password }, { withCredentials: true })
        .then((response) => {
            return response.data;
        })
        .catch((error) => error);
};

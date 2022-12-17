import axios from "axios";
import { QueryFunctionContext, QueryKey } from "react-query";
import { OkNullDataReservationResponse, OkReservationsListResponse } from "../shared/types";

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

export const getMonthReservations = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
    const [, params] = queryKey as [string, [number | string, number | string]];
    const response = await adminApi.get<OkReservationsListResponse>(`api/admin/reservations/${params[0]}/${params[1]}`);
    return response.data;
};

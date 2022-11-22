import axios from "axios";
import { QueryFunctionContext, QueryKey } from "react-query";

export const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const getServices = async () => {
    const response = await api.get("/api/services");
    return response.data;
};

export const getTimeSlots = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
    const [, params] = queryKey as [string, [number | null, number, number]];
    const response = await api.get(`api/reservations/available-days/${params[0]}`, {
        params: {
            year: params[1],
            month: params[2],
        },
    });
    return response.data;
};

import axios, { AxiosError } from "axios";
import { QueryFunctionContext, QueryKey } from "react-query";
import {
    ErrorResponse,
    OkIsDateAvailableResponse,
    OkMakeTemporalBookingResponse,
    OkServiceResponseTimeSlots,
    OkServiceResponse,
} from "../shared/types";

export const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const getServices = async () => {
    const response = await api.get<OkServiceResponse>("/api/services");
    return response.data;
};

export const getTimeSlots = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
    const [, params] = queryKey as [string, [number | null, number, number]];
    const response = await api.get<OkServiceResponseTimeSlots>(
        `api/reservations/available-days/${params[0]}/${params[1]}/${params[2]}`
    );
    return response.data;
};

export const isDateAvailable = async (dateISOString: string, serviceId: number) => {
    return await api
        .get<OkIsDateAvailableResponse>(`api/reservations/is-available/${dateISOString}/${serviceId}`)
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

export const createTemporalBooking = async (dateISOString: string, serviceId: number) => {
    return await api
        .put<OkMakeTemporalBookingResponse>(`api/reservations/temporal-booking/${dateISOString}/${serviceId}`)
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

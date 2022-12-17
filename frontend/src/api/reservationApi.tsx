import axios, { AxiosError } from "axios";
import { QueryFunctionContext, QueryKey } from "react-query";
import { parseISO, isBefore } from "date-fns";
import {
    ErrorResponse,
    OkDeleteTemporaryReservationResponse,
    OkIsDateAvailableResponse,
    OkMakeFinalReservationResponse,
    OkMakeTemporaryReservationResponse,
    OkServiceResponseTimeSlots,
    OkServiceResponse,
    Reservation,
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

export const createTemporaryReservation = async (dateISOString: string, serviceId: number) => {
    return await api
        .put<OkMakeTemporaryReservationResponse>(`api/reservations/temporary-reservation/${dateISOString}/${serviceId}`)
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

export const createFinalReservation = async (
    temporaryToken: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string
) => {
    return await api
        .put<OkMakeFinalReservationResponse>(`api/reservations/final-reservation/${temporaryToken}`, {
            firstName,
            lastName,
            email,
            phone,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

export const deleteTemporaryReservation = async (temporaryReservation: Reservation) => {
    if (isBefore(new Date(), parseISO(temporaryReservation.validityEnd))) {
        return await api
            .delete<OkDeleteTemporaryReservationResponse>(
                `api/reservations/temporary-reservation/${temporaryReservation.reservationToken}`
            )
            .then((response) => {
                return response.data;
            })
            .catch((error: AxiosError<ErrorResponse>) => error);
    }
    return "After validity";
};

export const deleteFinalReservation = async (reservationToken: string) => {
    return await api
        .delete<OkMakeFinalReservationResponse>(`api/reservations/final-reservation/${reservationToken}`)
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

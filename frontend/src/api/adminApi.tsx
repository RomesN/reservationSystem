import axios, { AxiosError } from "axios";
import { QueryFunctionContext, QueryKey } from "react-query";
import {
    ErrorResponse,
    IntervalGeneralRestriction,
    OkBusinessHoursResponse,
    OkNullDataReservationResponse,
    OkReservationsListResponse,
    Restriction,
} from "../shared/types";
import { timesArrayConverter } from "../shared/utils/helpers/functions";

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

export const deleteFinalReservationByAdmin = async (reservationToken: string) => {
    return await adminApi
        .delete<OkNullDataReservationResponse>(`api/admin/reservations/${reservationToken}`)
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

export const deleteAllFinalReservationsOnGivenDay = async (year: number, month: number, day: number) => {
    return await adminApi
        .delete<OkNullDataReservationResponse>(`api/admin/reservations/${year}/${month}/${day}`)
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

export const getAllBusinesshours = async (
    setData: React.Dispatch<React.SetStateAction<Restriction[] | null>>,
    setIsError: React.Dispatch<React.SetStateAction<boolean | null>>
) => {
    return await adminApi
        .get<OkBusinessHoursResponse>(`api/admin/restrictions/business-hours`)
        .then((response) => {
            setData(response.data.data);
        })
        .catch((error: AxiosError<ErrorResponse>) => setIsError(true));
};

export const getAllRegularBrakes = async (
    setData: React.Dispatch<React.SetStateAction<Restriction[] | null>>,
    setIsError: React.Dispatch<React.SetStateAction<boolean | null>>
) => {
    return await adminApi
        .get<OkBusinessHoursResponse>(`api/admin/restrictions/regular-brakes`)
        .then((response) => {
            setData(response.data.data);
        })
        .catch((error: AxiosError<ErrorResponse>) => setIsError(true));
};

export const updateBusinessHours = async (timesArray: IntervalGeneralRestriction[]) => {
    const dataToSend = timesArrayConverter(timesArray);
    return await adminApi
        .patch<OkNullDataReservationResponse>(`api/admin/restrictions/business-hours`, {
            businessHours: dataToSend,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

export const updateRegularBrakes = async (timesArray: IntervalGeneralRestriction[]) => {
    const dataToSend = timesArrayConverter(timesArray);
    return await adminApi
        .patch<OkNullDataReservationResponse>(`api/admin/restrictions/regular-brakes`, {
            regularBrakes: dataToSend,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error: AxiosError<ErrorResponse>) => error);
};

import axios, { AxiosError, AxiosResponse } from "axios";
import { QueryFunctionContext, QueryKey } from "react-query";
import {
    ErrorResponse,
    IntervalGeneralRestriction,
    OkRestrictionsArrayResponse,
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
    return response.data.data;
};

export const getMonthBusinessClosedRestrictions = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
    const [, params] = queryKey as [string, [number | string, number | string]];
    const response = await adminApi.get<OkRestrictionsArrayResponse>(
        `api/admin/restrictions/business-closed/${params[0]}/${params[1]}`
    );
    return response.data.data;
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
        .get<OkRestrictionsArrayResponse>(`api/admin/restrictions/business-hours`)
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
        .get<OkRestrictionsArrayResponse>(`api/admin/restrictions/regular-brakes`)
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

const mutationRequest = async ({ ...options }) => {
    const onSuccess = (response: AxiosResponse) => response.data.data;
    return adminApi(options).then(onSuccess);
};

export const createBusinessClosedRestriction = async (date: string) => {
    return mutationRequest({ url: `/api/admin/restrictions/business-closed/${date}`, method: "put" });
};

export const deleteBusinessClosedRestriction = async (id: number) => {
    return mutationRequest({ url: `/api/admin/restrictions/business-closed/${id}`, method: "delete" });
};

export const deleteFinalReservationByAdmin = async (reservationToken: string) => {
    return mutationRequest({ url: `api/admin/reservations/${reservationToken}`, method: "delete" });
};

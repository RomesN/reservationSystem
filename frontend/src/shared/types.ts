import { ReactNode } from "react";

type Customer = {
    id: number;
    createdAt: string;
    customerStatus: string;
    email: string;
    firstName: string;
    lastName: string;
    scheduledJobId: null | string;
    telephoneNumber: string;
    updatedAt: string;
};

type ErrorResponse = {
    status: number | string;
    message: string;
    error: [
        {
            name: string;
            stack: string;
        }
    ];
};

type IntervalGeneralRestriction = {
    weekday: string;
    startTime: string;
    endTime: string;
};

type IntervalString = {
    start: string;
    end: string;
};

type LoginInputs = {
    login: string;
    password: string;
};

type OkServiceResponseTimeSlots = {
    status: string;
    message: string;
    data: {
        year: Number;
        monthAsNumber: Number;
        numberOfDays: Number;
        timesOffsetedByMinutes: Number;
        serviceRequiredId: Number;
        serviceRequiredName: String;
        serviceRequiredTime: Number;
        ["1"]: IntervalString[];
        ["2"]: IntervalString[];
        ["3"]: IntervalString[];
        ["4"]: IntervalString[];
        ["5"]: IntervalString[];
        ["6"]: IntervalString[];
        ["7"]: IntervalString[];
        ["8"]: IntervalString[];
        ["9"]: IntervalString[];
        ["10"]: IntervalString[];
        ["11"]: IntervalString[];
        ["12"]: IntervalString[];
        ["13"]: IntervalString[];
        ["14"]: IntervalString[];
        ["15"]: IntervalString[];
        ["16"]: IntervalString[];
        ["17"]: IntervalString[];
        ["18"]: IntervalString[];
        ["19"]: IntervalString[];
        ["20"]: IntervalString[];
        ["21"]: IntervalString[];
        ["22"]: IntervalString[];
        ["23"]: IntervalString[];
        ["24"]: IntervalString[];
        ["25"]: IntervalString[];
        ["26"]: IntervalString[];
        ["27"]: IntervalString[];
        ["28"]: IntervalString[];
        ["29"]?: IntervalString[];
        ["30"]?: IntervalString[];
        ["31"]?: IntervalString[];
    };
};

type OkReservationsListResponse = {
    status: string;
    message: string;
    data: {
        year: Number;
        monthAsNumber: Number;
        numberOfDays: Number;
        timesOffsetedByMinutes: Number;
        ["1"]: IntervalString[];
        ["2"]: IntervalString[];
        ["3"]: IntervalString[];
        ["4"]: IntervalString[];
        ["5"]: IntervalString[];
        ["6"]: IntervalString[];
        ["7"]: IntervalString[];
        ["8"]: IntervalString[];
        ["9"]: IntervalString[];
        ["10"]: IntervalString[];
        ["11"]: IntervalString[];
        ["12"]: IntervalString[];
        ["13"]: IntervalString[];
        ["14"]: IntervalString[];
        ["15"]: IntervalString[];
        ["16"]: IntervalString[];
        ["17"]: IntervalString[];
        ["18"]: IntervalString[];
        ["19"]: IntervalString[];
        ["20"]: IntervalString[];
        ["21"]: IntervalString[];
        ["22"]: IntervalString[];
        ["23"]: IntervalString[];
        ["24"]: IntervalString[];
        ["25"]: IntervalString[];
        ["26"]: IntervalString[];
        ["27"]: IntervalString[];
        ["28"]: IntervalString[];
        ["29"]?: IntervalString[];
        ["30"]?: IntervalString[];
        ["31"]?: IntervalString[];
    };
};

type OkIsDateAvailableResponse = {
    status: string;
    message: string;
    data: { isAvailable: boolean };
};

type OkMakeTemporaryReservationResponse = {
    status: string;
    message: string;
    data: { temporaryBooking: Reservation };
};

type OkMakeFinalReservationResponse = {
    status: string;
    message: string;
    data: Reservation;
};

type OkNullDataReservationResponse = {
    status: string;
    message: string;
    data: null;
};

type OkBusinessHoursResponse = {
    status: string;
    message: string;
    data: Restriction[];
};

type OkServiceResponse = {
    status: string;
    message: string;
    data: Service[];
};

type Position = { x: number; y: number };

type Positions = { prevPos: Position; currPos: Position };

type Props = {
    children?: ReactNode;
};

type Reservation = {
    id: string;
    date: string;
    detail: string;
    serviceId: number;
    service: Service;
    reservationStatus: string;
    updatedAt: string;
    createdAt: string;
    customerId: number | null;
    customer: Customer;
    validityEnd: string;
    reservationToken: string;
};

type Restriction = {
    weekday: string | null;
    date: string | null;
    startTime: string | null;
    endTime: string | null;
    type: string;
};

type Service = {
    id: number;
    name: string;
    minutesRequired: number;
    createdAt: Date;
    updatedAt: Date;
};

type TableArrayNewReservation = {
    available: boolean;
    date: number;
    intervalsConnected: Interval[];
    morningCount?: number;
    afternoonCount?: number;
};

type TableArrayExistingReservations = {
    available: boolean;
    date: number;
    reservations: Reservation[];
};

type TargetProps = { element?: React.MutableRefObject<HTMLElement | null> | null; useWindow?: boolean };

export type {
    ErrorResponse,
    IntervalGeneralRestriction,
    IntervalString,
    LoginInputs,
    OkBusinessHoursResponse,
    OkNullDataReservationResponse,
    OkIsDateAvailableResponse,
    OkMakeFinalReservationResponse,
    OkMakeTemporaryReservationResponse,
    OkReservationsListResponse,
    OkServiceResponseTimeSlots,
    OkServiceResponse,
    Position,
    Positions,
    Props,
    Reservation,
    Restriction,
    Service,
    TableArrayNewReservation,
    TableArrayExistingReservations,
    TargetProps,
};

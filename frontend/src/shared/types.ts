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
    data: ReservationsInfoObject;
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

type OkRestrictionsArrayResponse = {
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
    note: string;
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

type ReservationsInfoObject = {
    year: Number;
    monthAsNumber: Number;
    numberOfDays: Number;
    timesOffsetedByMinutes: Number;
    ["1"]: Reservation[];
    ["2"]: Reservation[];
    ["3"]: Reservation[];
    ["4"]: Reservation[];
    ["5"]: Reservation[];
    ["6"]: Reservation[];
    ["7"]: Reservation[];
    ["8"]: Reservation[];
    ["9"]: Reservation[];
    ["10"]: Reservation[];
    ["11"]: Reservation[];
    ["12"]: Reservation[];
    ["13"]: Reservation[];
    ["14"]: Reservation[];
    ["15"]: Reservation[];
    ["16"]: Reservation[];
    ["17"]: Reservation[];
    ["18"]: Reservation[];
    ["19"]: Reservation[];
    ["20"]: Reservation[];
    ["21"]: Reservation[];
    ["22"]: Reservation[];
    ["23"]: Reservation[];
    ["24"]: Reservation[];
    ["25"]: Reservation[];
    ["26"]: Reservation[];
    ["27"]: Reservation[];
    ["28"]: Reservation[];
    ["29"]?: Reservation[];
    ["30"]?: Reservation[];
    ["31"]?: Reservation[];
};

type Restriction = {
    id?: number;
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

type TableArrayBusinessClosed = {
    restrictionId?: number | null;
    isClosed: boolean;
    date: number;
    isInPastOrNextMonth: boolean;
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
    OkNullDataReservationResponse,
    OkIsDateAvailableResponse,
    OkMakeFinalReservationResponse,
    OkMakeTemporaryReservationResponse,
    OkReservationsListResponse,
    OkRestrictionsArrayResponse,
    OkServiceResponseTimeSlots,
    OkServiceResponse,
    Position,
    Positions,
    Props,
    Reservation,
    ReservationsInfoObject,
    Restriction,
    Service,
    TableArrayBusinessClosed,
    TableArrayNewReservation,
    TableArrayExistingReservations,
    TargetProps,
};

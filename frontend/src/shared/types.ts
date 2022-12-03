import { ReactNode } from "react";

type Service = {
    id: number;
    name: string;
    minutesRequired: number;
    createdAt: Date;
    updatedAt: Date;
};

type Props = {
    children?: ReactNode;
};

type IntervalString = {
    start: string;
    end: string;
};

type okServiceResponseTimeSlots = {
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

export type { IntervalString, okServiceResponseTimeSlots, Service, Props };

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

type Interval = {
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
        ["1"]: Interval[];
        ["2"]: Interval[];
        ["3"]: Interval[];
        ["4"]: Interval[];
        ["5"]: Interval[];
        ["6"]: Interval[];
        ["7"]: Interval[];
        ["8"]: Interval[];
        ["9"]: Interval[];
        ["10"]: Interval[];
        ["11"]: Interval[];
        ["12"]: Interval[];
        ["13"]: Interval[];
        ["14"]: Interval[];
        ["15"]: Interval[];
        ["16"]: Interval[];
        ["17"]: Interval[];
        ["18"]: Interval[];
        ["19"]: Interval[];
        ["20"]: Interval[];
        ["21"]: Interval[];
        ["22"]: Interval[];
        ["23"]: Interval[];
        ["24"]: Interval[];
        ["25"]: Interval[];
        ["26"]: Interval[];
        ["27"]: Interval[];
        ["28"]: Interval[];
        ["29"]?: Interval[];
        ["30"]?: Interval[];
        ["31"]?: Interval[];
    };
};

export type { Interval, okServiceResponseTimeSlots, Service, Props };

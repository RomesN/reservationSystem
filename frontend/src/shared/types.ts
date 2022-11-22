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

type interval = {
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
        ["1"]: interval[];
        ["2"]: interval[];
        ["3"]: interval[];
        ["4"]: interval[];
        ["5"]: interval[];
        ["6"]: interval[];
        ["7"]: interval[];
        ["8"]: interval[];
        ["9"]: interval[];
        ["10"]: interval[];
        ["11"]: interval[];
        ["12"]: interval[];
        ["13"]: interval[];
        ["14"]: interval[];
        ["15"]: interval[];
        ["16"]: interval[];
        ["17"]: interval[];
        ["18"]: interval[];
        ["19"]: interval[];
        ["20"]: interval[];
        ["21"]: interval[];
        ["22"]: interval[];
        ["23"]: interval[];
        ["24"]: interval[];
        ["25"]: interval[];
        ["26"]: interval[];
        ["27"]: interval[];
        ["28"]: interval[];
        ["29"]?: interval[];
        ["30"]?: interval[];
        ["31"]?: interval[];
    };
};

export type { Service, Props, okServiceResponseTimeSlots };

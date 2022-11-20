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

export type { Service, Props };

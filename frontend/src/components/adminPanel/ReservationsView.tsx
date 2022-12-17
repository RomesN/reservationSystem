import { useState } from "react";
import { useQuery } from "react-query";
import { getMonthReservations } from "../../api/adminApi";
import Loading from "../Loading";

const ReservationsView = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const reservationsInfo = useQuery(["reservationsInfoObject", [year, month]], getMonthReservations, {
        useErrorBoundary: true,
    });

    if (reservationsInfo) {
        return <p>{JSON.stringify(reservationsInfo.data?.data)}</p>;
    }

    return <Loading />;
};

export default ReservationsView;

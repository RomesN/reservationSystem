import { useQuery } from "react-query";
import { getServices } from "../api/reservationApi";
import { AxiosError } from "axios";
import ErrorBoundary from "./ErrorBoundary";
import { Service } from "../shared/types";
import styles from "../styles/loading.module.css";

type okServiceResponse = {
    status: string;
    message: string;
    data: Service[];
};

const Services = () => {
    const services = useQuery<okServiceResponse>("services", getServices, {
        staleTime: 60000,
        useErrorBoundary: true,
    });

    const getServicesList = (serviceArray: Service[]) => {
        return (
            <ul>
                {serviceArray.map((service: Service) => {
                    return <li key={service.id}>{service.name}</li>;
                })}
            </ul>
        );
    };

    if (services.data) {
        return <>{getServicesList(services.data.data)}</>;
    }

    return (
        <div className={styles["loadingio-spinner-pulse-5by9iuqunuc"]}>
            <div className={styles["ldio-x6iswrgd0c"]}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default Services;

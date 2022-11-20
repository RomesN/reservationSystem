import { useQuery } from "react-query";
import { getServices } from "../api/reservationApi";
import { Service } from "../shared/types";
import ServiceBox from "./ServiceBox";
import stylesLoading from "../styles/loading.module.css";
import stylesServices from "../styles/services.module.css";

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
            <div className={stylesServices.serviceList}>
                {serviceArray
                    .sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0))
                    .map((service: Service) => {
                        return (
                            <ServiceBox
                                key={service.id}
                                id={service.id}
                                name={service.name}
                                minutesRequired={service.minutesRequired}
                                services={serviceArray}
                            />
                        );
                    })}
            </div>
        );
    };

    if (services.data) {
        return <>{getServicesList(services.data.data)}</>;
    }

    return (
        <div className={stylesLoading.loadingContainer}>
            <div className={stylesLoading["loadingio-spinner-pulse-mvs7jy77wdr"]}>
                <div className={stylesLoading["ldio-1zhfes7vwu4"]}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default Services;

import { useQuery } from "react-query";
import { getServices } from "../../../api/reservationApi";
import { Service } from "../../../shared/types";
import ServiceBox from "./ServiceBox";
import Loading from "../../Loading";
import stylesServices from "../../../styles/user/newReservation/serviceSelection/serviceSelection.module.css";

const ServiceSelection = () => {
    const services = useQuery("services", getServices, {
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

    return <Loading />;
};

export default ServiceSelection;

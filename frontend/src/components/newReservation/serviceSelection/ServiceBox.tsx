import { Service } from "../../../shared/types";
import styles from "../../../styles/user/newReservation/serviceSelection/serviceBox.module.css";
import { useNewReservationContext } from "../../../hooks/NewReservationContext";
import { NewReservationViewEnum } from "../../../utils/enums/newReservationViewEnum";

type ServiceBoxProps = {
    id: number;
    name: string;
    minutesRequired: number;
    services: Service[];
};

const ServiceBox = ({ id, name, minutesRequired, services }: ServiceBoxProps) => {
    const { bookedService, setBookedService, setView } = useNewReservationContext();

    const handleClick = (id: number) => {
        const serviceObject = services.find((service) => service.id === id) || null;
        setBookedService(serviceObject);
        setView(NewReservationViewEnum.Calendar);
    };

    return (
        <div
            className={bookedService?.id === id ? styles.serviceBoxSelected : styles.serviceBox}
            onClick={() => {
                handleClick(id);
            }}
        >
            <div className={styles.namePart}>
                <p>{name}</p>
            </div>
            <div className={styles.minutesPart}>
                <p>{minutesRequired} min</p>
            </div>
        </div>
    );
};

export default ServiceBox;

import { useQuery, useMutation, useQueryClient } from "react-query";
import { getServices } from "../api/reservationApi";
import { AxiosError } from "axios";

const Services = () => {
    const queryClient = useQueryClient();
    const {
        isLoading,
        isError,
        error,
        data: services,
    } = useQuery<[], AxiosError>("services", getServices, { staleTime: 60000 });

    let content;
    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isError) {
        content = <p>{error.message}</p>;
    } else {
        content = JSON.stringify(services);
    }
    return <>{content}</>;
};

export default Services;

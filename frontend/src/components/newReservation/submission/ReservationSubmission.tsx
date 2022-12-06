import ReservationForm from "./ReservationForm";
import ReservationOverview from "./ReservationOverview";

const ReservationSubmission = () => {
    return (
        <div>
            <div>
                <ReservationOverview />
            </div>
            <div>
                <ReservationForm />
            </div>
        </div>
    );
};

export default ReservationSubmission;

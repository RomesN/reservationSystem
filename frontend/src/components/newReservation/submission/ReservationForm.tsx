import { format } from "date-fns";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { createFinalReservation } from "../../../api/reservationApi";
import styles from "../../../styles/newReservation/submission/reservationForm.module.css";
import stylesSweetAlert from "../../../styles/sweetAlert.module.css";
import { useNewReservationContext } from "../../../hooks/NewReservationContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReservationForm = () => {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [agree, setAgree] = useState(false);

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [agreeError, setAgreeError] = useState(false);

    const { bookedDate, temporaryReservation, setTimerOn } = useNewReservationContext();
    const navigate = useNavigate();

    useEffect(() => {
        setTimerOn(true);
    }, [setTimerOn]);

    const validateName = (firstName: string) => {
        return !/[A-Za-z]{2}/g.test(firstName) ? "Name must contain at least 2 characters." : "";
    };

    const validateEmail = (email: string) => {
        return !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g.test(email) ? "Must be valid email address." : "";
    };

    const validatePhone = (phone: string) => {
        return !/^(\+42[0-1])? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/g.test(phone)
            ? "Must be valid SK/CZ phone number."
            : "";
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case "firstName":
                setFirstName(value);
                setFirstNameError(validateName(value));
                break;
            case "lastName":
                setLastName(value);
                setLastNameError(validateName(value));
                break;
            case "email":
                setEmail(value);
                setEmailError(validateEmail(value));
                break;
            case "phone":
                setPhone(value);
                setPhoneError(validatePhone(value));
                break;
        }
    };

    const handleSwitch = () => {
        setAgreeError(agree);
        setAgree(!agree);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const firstNameValidated = validateName(firstName || "");
        const secondNameValidated = validateName(lastName || "");
        const emailValidated = validateEmail(email || "");
        const phoneValidated = validatePhone(phone || "");

        setFirstNameError(firstNameValidated);
        setLastNameError(secondNameValidated);
        setEmailError(emailValidated);
        setPhoneError(phoneValidated);
        setAgreeError(!agree);

        if (!firstNameValidated && !secondNameValidated && !emailValidated && !phoneValidated && agree) {
            if (!temporaryReservation || !firstName || !lastName || !phone || !email) {
                throw new Error("Unexpected scenario");
            }
            setTimerOn(false);
            const bookDateToShow = bookedDate ? format(bookedDate, "dd.MM.yyyy HH:mm") : "ERROR";
            const response = await createFinalReservation(
                temporaryReservation.reservationToken,
                firstName,
                lastName,
                email,
                phone
            );
            console.log(response);
            if (!axios.isAxiosError(response) && response.data.id) {
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `We will be happy to see you on ${bookDateToShow}.`,
                    iconColor: "#6d9886",
                    customClass: {
                        popup: stylesSweetAlert.bookingCollision,
                        confirmButton: stylesSweetAlert.bookingCollisionButton,
                        title: stylesSweetAlert.bookingCollisionTitle,
                        icon: stylesSweetAlert.bookingCollisionIcon,
                        htmlContainer: stylesSweetAlert.bookingCollisionContainer,
                    },
                }).then(() => {
                    navigate("/");
                });
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className={styles.rowOne}>
                <Col className={styles.colLeft}>
                    <Form.Group>
                        <Form.Label className={styles.label}>First name</Form.Label>
                        <Form.Control
                            className={styles.input}
                            name="firstName"
                            type="text"
                            placeholder="First"
                            onChange={handleInput}
                            autoFocus
                            isInvalid={!!firstNameError}
                        />
                        <Form.Control.Feedback type="invalid">{firstNameError}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className={styles.colRight}>
                    <Form.Group>
                        <Form.Label className={styles.label}>Last name</Form.Label>
                        <Form.Control
                            className={styles.input}
                            name="lastName"
                            type="text"
                            placeholder="Last"
                            onChange={handleInput}
                            isInvalid={!!lastNameError}
                        />
                        <Form.Control.Feedback type="invalid">{lastNameError}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row className={styles.rowTwo}>
                <Col className={styles.colLeft}>
                    <Form.Group>
                        <Form.Label className={styles.label}>Email</Form.Label>
                        <Form.Control
                            className={styles.input}
                            name="email"
                            type="email"
                            placeholder="example@example.com"
                            onChange={handleInput}
                            isInvalid={!!emailError}
                        />
                        <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className={styles.colRight}>
                    <Form.Group>
                        <Form.Label className={styles.label}>Phone</Form.Label>
                        <Form.Control
                            className={styles.input}
                            name="phone"
                            type="text"
                            placeholder="+420 123 456 789"
                            onChange={handleInput}
                            isInvalid={!!phoneError}
                        />
                        <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row className={styles.rowThree}>
                <Form.Check
                    type="switch"
                    className={styles.checkbox}
                    label="I agree to store personal data for the purpose of the reservation"
                    onClick={handleSwitch}
                    isInvalid={!!agreeError}
                />
            </Row>
            <Row className={styles.rowFour}>
                <Button type="submit" className={styles.button}>
                    Submit reservation
                </Button>
            </Row>
        </Form>
    );
};

export default ReservationForm;

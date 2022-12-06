import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import styles from "../../../styles/newReservation/submission/reservationForm.module.css";

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

    const validateName = (firstName: string) => {
        return !/[A-Za-z]{3}/g.test(firstName) ? "Name must contain at least 3 characters." : "";
    };

    const validateEmail = (email: string) => {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g.test(email) ? "Must be valid email address." : "";
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
                setFirstName(() => value);
                setFirstNameError(() => validateName(value));
                break;
            case "lastName":
                setLastName(() => value);
                setLastNameError(() => validateName(value));
                break;
            case "email":
                setEmail(() => value);
                setEmailError(() => validateEmail(value));
                break;
            case "phone":
                setPhone(() => value);
                setPhoneError(() => validatePhone(value));
                break;
        }
    };

    const handleSwitch = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        setAgree(!agree);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setFirstNameError(() => validateName(firstName || ""));
        setLastNameError(() => validateName(lastName || ""));
        setEmailError(() => validateEmail(email || ""));
        setPhoneError(() => validatePhone(phone || ""));
        setAgreeError(() => !agree);

        if (!!firstNameError && !!lastNameError && !!emailError && !!phoneError && !!agreeError) {
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

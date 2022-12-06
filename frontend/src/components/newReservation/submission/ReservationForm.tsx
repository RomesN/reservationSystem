import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import styles from "../../../styles/newReservation/submission/reservationForm.module.css";

const ReservationForm = () => {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [telephone, setTelephone] = useState();
    const [email, setEmail] = useState();
    const [agree, setAgree] = useState(false);
    const [firstNameError, setFirstNameError] = useState();
    const [lastNameError, setLastNameError] = useState();
    const [telephoneError, setTelephoneError] = useState();
    const [emailError, setEmailError] = useState();

    const handleInput = () => {};

    return (
        <Form>
            <Row className={styles.rowOne}>
                <Col className={styles.colLeft}>
                    <Form.Group>
                        <Form.Label className={styles.label}>First name</Form.Label>
                        <Form.Control
                            className={styles.input}
                            name="firstName"
                            type="text"
                            placeholder="First"
                            onChange={(e) => {
                                handleInput();
                            }}
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
                            onChange={(e) => {
                                handleInput();
                            }}
                            isInvalid={!!lastNameError}
                        />
                        <Form.Control.Feedback type="invalid">{lastNameError}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row className={styles.rowTwo}>
                <Col className={styles.colLeft}>
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>Email</Form.Label>
                        <Form.Control
                            className={styles.input}
                            name="email"
                            type="email"
                            placeholder="example@example.com"
                            onChange={(e) => {
                                handleInput();
                            }}
                            isInvalid={!!emailError}
                        />
                        <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className={styles.colRight}>
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>Phone</Form.Label>
                        <Form.Control
                            className={styles.input}
                            name="tel"
                            type="text"
                            placeholder="+420 123 456 789"
                            onChange={(e) => {
                                handleInput();
                            }}
                            isInvalid={!!telephoneError}
                        />
                        <Form.Control.Feedback type="invalid">{telephoneError}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row className={styles.rowThree}>
                <Form.Check
                    type="switch"
                    className={styles.checkbox}
                    label="I agree to store personal data for the purpose of the reservation"
                    onClick={() => {
                        setAgree(() => !agree);
                    }}
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

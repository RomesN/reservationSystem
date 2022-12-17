import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { LoginInputs } from "../../shared/types";
import { login } from "../../api/adminApi";
import styles from "../../styles/admin/login.module.css";

const Login = () => {
    const [error, setError] = useState<AxiosError | null>();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginInputs>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        const response = await login(data.login, data.password);
        if (axios.isAxiosError(response)) {
            setError(response);
        } else {
            navigate("/admin/panel");
        }
    };

    const showError = (error: AxiosError) => {
        if (error.response?.status === 401) {
            return <p className={styles.errorMessage}>wrong credentials</p>;
        } else {
            return <p className={styles.errorMessage}>{error.message}</p>;
        }
    };

    return (
        <div className={styles.centered}>
            <div className={styles.formContainer}>
                <h2 className={styles.header}>Admin panel login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.inputContainer}>
                        <input type="text" {...register("login", { required: true })} />
                        <label className={watch("login") ? styles.usedLabel : undefined}>Login</label>
                        {errors.login && <span className={styles.error}>the field is required</span>}
                    </div>
                    <div className={styles.inputContainer}>
                        <input type="password" {...register("password", { required: true })} />
                        <label className={watch("password") ? styles.usedLabel : undefined}>Password</label>
                        {errors.password && <span className={styles.error}>the field is required</span>}
                        {error && showError(error)}
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="submit" value="Submit">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

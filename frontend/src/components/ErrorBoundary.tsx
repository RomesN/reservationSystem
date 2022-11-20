import { Props } from "../shared/types";
import React, { ErrorInfo } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/errorBoundary.module.css";

type State = {
    hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.errorContainer}>
                    <p>
                        <FontAwesomeIcon size="sm" icon={faCircleExclamation} />
                        {` Sorry, something went wrong...`}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

import { Props } from "../shared/types";
import React, { ErrorInfo } from "react";

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
            return <p>Sorry.. there was an error</p>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

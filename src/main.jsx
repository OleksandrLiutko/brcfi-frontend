import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import App from "./App";
import { AuthStateProvider } from "./context/AuthContext";
import { ModalStateProvider } from "./context/ModalContext";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthStateProvider>
                <ModalStateProvider>
                    <App />
                </ModalStateProvider>
            </AuthStateProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

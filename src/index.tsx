import {ColorModeScript} from "@chakra-ui/react"
import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import {App} from "./App"
import './global.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'moment/locale/ru';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement as Element);

root.render(
    <StrictMode>
        <ColorModeScript/>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </StrictMode>
);

import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import "../components/layout/Layout.css";

function AppLayout() {

    return (

        <div className="layout">

            <Sidebar />

            <div className="main-area">

                <Header />

                <main className="content">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default AppLayout;
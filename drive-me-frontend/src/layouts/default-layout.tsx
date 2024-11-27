// default-layout.tsx

import { Outlet } from "react-router";
import { AsideMenu } from "../components/aside-menu";

export function  DefaultLayout() {
    return (
        <div className="flex bg-neutral-100">
            <AsideMenu />
            <Outlet />
        </div>
    )
}
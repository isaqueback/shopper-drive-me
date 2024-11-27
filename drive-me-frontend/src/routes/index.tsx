// routes/index.tsx

import { BrowserRouter, Route, Routes } from "react-router"
import { TakeARide } from "./take-a-ride/page"
import { RidesHistory } from "./rides-history/page"
import { DefaultLayout } from "../layouts/default-layout"
import { Toaster } from "sonner"
import { RideProvider } from "../contexts/ride-context"

export function RoutesContainer() {
    return (
        <BrowserRouter>
            <RideProvider>
                <Toaster />
                <Routes>
                    <Route path="/" element={<DefaultLayout />}>
                        <Route path="/" element={<TakeARide />} />
                        <Route path="/rides-history" element={<RidesHistory />} />
                    </Route>
                </Routes>
            </RideProvider >
        </BrowserRouter>
    )
}
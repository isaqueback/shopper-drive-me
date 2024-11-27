// take-a-ride/page.tsx

import { TakeARideForm } from "./take-a-ride-form"
import { YourRide } from "./your-ride"
import { Drivers } from "./drivers"

export function TakeARide() {
    return (
        <main className="flex-1 overflow-x-hidden max-sm:mb-24">
            <h1 className="border-b border-neutral-300 text-neutral-800 h-16 flex items-center font-bold px-2 text-lg">Faça uma viagem</h1>
            <div className="flex max-lg:flex-col p-2 gap-2 w-full max-w-[1920px] mx-auto">
                <TakeARideForm />
                <YourRide />
            </div>
            <div className="flex p-2 gap-2 w-full lg:max-w-[1920px] mx-auto">
                <Drivers />
            </div>
        </main>
    )
}
import { MapPinned } from "lucide-react"
import { useContext } from "react"
import { RideContext } from "../../contexts/ride-context"

export function YourRide() {
    const { estimate } = useContext(RideContext)

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=color:red%7Clabel:A%7C${estimate?.origin.latitude},${estimate?.origin.longitude}&markers=color:blue%7Clabel:B%7C${estimate?.destination.latitude},${estimate?.destination.longitude}&key=AIzaSyDXH1Zg4Qdu26cLimzDRFEVKzuIQriXTN4`
    return (
        <div className="border h-72 bg-neutral-50 border-neutral-300 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
            <h2 className="font-medium border-b border-neutral-300 min-h-14 px-2 flex items-center text-neutral-800">Seu percurso</h2>
            <div className="size-full max-lg:h-60 flex items-center justify-center">
                {!estimate ? (
                    <MapPinned className="size-32 max-xl:size-28 max-xl:stroke-1 text-neutral-200" />
                ) : (
                    <img src={mapUrl} alt="Rota" className="w-full h-[231px] max-lg:[240px] object-fill" />
                )}
            </div>
        </div>
    )
}

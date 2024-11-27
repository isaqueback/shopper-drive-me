// drivers.tsx

import { SearchX } from "lucide-react"
import { useContext } from "react"
import { RideContext } from "../../contexts/ride-context"
import { ConfirmDriverModal } from "./confirm-driver-modal"


export function Drivers() {
    const { estimate, isOpenConfirmDriverModal, handleChooseDriver } = useContext(RideContext)

    return (
        <div className="border min-h-48 pb-2 w-full bg-neutral-50 border-neutral-300 gap-4 rounded-lg shadow-sm flex flex-col flex-1">
            <h2 className="font-medium border-b border-neutral-300 min-h-14 px-2 flex items-center text-neutral-800">Motoristas disponíveis</h2>
            <div className={`sm:px-2 flex max-lg:overflow-x-auto max-lg:min-h-96 ${estimate ? '' : 'items-center justify-center'}`}>
                {
                    estimate ? (
                        <table className="max-lg:w-6xl table-auto max-lg:h-fit max-lg:min-w-[1024px]">
                            <thead>
                                <tr className="border-b border-neutral-300 bg-neutral-100">
                                    <th className="text-left text-sm font-medium text-neutral-800 p-2">Ação</th>
                                    <th className="text-left text-sm font-medium text-neutral-800 p-2">Nome</th>
                                    <th className="text-left text-sm font-medium text-neutral-800 p-2">Descrição</th>
                                    <th className="text-left text-sm font-medium text-neutral-800 p-2">Veículo</th>
                                    <th className="text-left text-sm font-medium text-neutral-800 p-2">Avaliação</th>
                                    <th className="text-left text-sm font-medium text-blue-800 p-2">Valor da viagem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    estimate.options.map((driver, idx) => (
                                        <tr key={idx} className="border-b border-neutral-300 hover:bg-neutral-100">
                                            <td className="p-2">
                                                <button type="button"
                                                    className="bg-neutral-800 text-neutral-50 text-sm py-1 px-4 rounded-lg hover:bg-neutral-700 transition duration-200"
                                                    onClick={() => handleChooseDriver({ customer_id: estimate.customer_id, destination: estimate.sDestination, origin: estimate.sOrigin, distance: estimate.distance, driver, duration: estimate.duration, value: driver.value })}
                                                >
                                                    Escolher
                                                </button>
                                            </td>
                                            <td className="p-2 text-sm text-neutral-700">{driver.name}</td>
                                            <td className="p-2 text-sm text-neutral-700">{driver.description}</td>
                                            <td className="p-2 text-sm text-neutral-700">{driver.vehicle}</td>
                                            <td className="p-2 text-sm text-neutral-700">
                                                {driver.review.rating}
                                                {driver.review.rating && driver.review.comment && <br />}
                                                {driver.review.comment}
                                            </td>
                                            <td className="p-2 text-sm text-blue-800">
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(driver.value)}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ) : (
                        <SearchX className="size-32 text-neutral-200" />
                    )
                }
            </div>
            {isOpenConfirmDriverModal && <ConfirmDriverModal />}
        </div>
    )
}
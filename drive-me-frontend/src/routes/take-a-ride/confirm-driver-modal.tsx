import { useContext } from "react"
import { RideContext } from "../../contexts/ride-context"
import { Loader2 } from "lucide-react"

export function ConfirmDriverModal() {
    const { handleCancelDriver, handleConfirmDriver, chosenDriver, isConfirmingDriver } = useContext(RideContext)
    return (
        <div className="w-screen h-screen z-10 left-0 top-0 bg-black/10 fixed flex items-center justify-center">
            <div className="border h-64 bg-neutral-50 border-neutral-300 gap-4 rounded-lg shadow-sm flex flex-col flex-1 w-full max-w-md">
                <h2 className="font-medium border-b border-neutral-300 h-12 px-2 flex items-center text-neutral-800">Confirmar motorista</h2>
                <p className="px-2 text-sm font-thin text-neutral-800">
                    {chosenDriver ? (
                        <>
                            Você escolheu {chosenDriver.driver.name}. Valor: ㅤ
                            <span className="text-emerald-500">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(chosenDriver.value)}
                            </span>
                            {'. Deseja continuar?'}
                        </>
                    ) : (
                        'Ocorreu um erro'
                    )}
                </p>
                <div className="mt-auto p-2 flex gap-2 justify-end">
                    <button onClick={() => handleCancelDriver()} className="border border-neutral-300 py-2 px-3 text-sm rounded-lg text-neutral-800 hover:bg-neutral-300 transition duration-200 flex justify-center items-center gap-2">
                        Cancelar
                    </button>
                    {chosenDriver && <button onClick={() => handleConfirmDriver(chosenDriver)} className="bg-neutral-800 py-2 px-3 text-sm rounded-lg text-neutral-50 hover:bg-neutral-700 transition duration-200 flex items-center justify-center gap-2">
                        Confirmar
                        {isConfirmingDriver && <Loader2 className="size-3.5 animate-spin" />}
                    </button>}
                </div>
            </div>
        </div>
    )
}
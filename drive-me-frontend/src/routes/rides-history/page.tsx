// rides-history/page.tsx

import { useContext, useEffect, useState } from "react"
import { RideContext } from "../../contexts/ride-context"
import { Loader2, SearchX } from "lucide-react"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ridesHistorySchema = z.object({
    customer_id: z
        .string({ message: 'O ID do cliente deve ser uma string' })
        .min(1, 'O ID do cliente é obrigatório')
})

type RidesHistorySchema = z.infer<typeof ridesHistorySchema>
interface FormattedRide {
    date: Date
    destination: string
    distance: number
    driver: {
        id: number
        name: string
    }
    id: number
    origin: string
    value: number
    duration: string
    formattedDate: string
    formattedDistance: string
    formattedDuration: string
    formattedValue: string
}

export function RidesHistory() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RidesHistorySchema>({
        resolver: zodResolver(ridesHistorySchema),
        mode: 'onChange',
    })
    const { fetchedRides, fetchRides, setFetchedRides } = useContext(RideContext)

    const [formattedRides, setFormattedRides] = useState<FormattedRide[]>([])
    const [isFetchingRides, setIsFetchingRides] = useState(false)

    useEffect(() => {
        if (fetchedRides) {
            const formatRides = fetchedRides.rides.map((ride) => {
                const formattedDate = formatDateAndTime(ride.date)

                const formattedDuration = formatDuration(ride.duration)
                
                const formattedDistance = formatDistance(ride.distance)

                const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ride.value)

                return {
                    ...ride,
                    date: new Date(ride.date),
                    formattedDate,
                    formattedDuration,
                    formattedValue,
                    formattedDistance,
                }
            })

            setFormattedRides(formatRides)
        } else {
            setFormattedRides([])
        }
    }, [fetchedRides])

    function formatDateAndTime(date: Date) {
        // (DD/MM/YYYY)
        const formattedDate = format(new Date(date), "dd/MM/yyyy", { locale: ptBR })
      
        // (HH:MM)
        const formattedTime = format(new Date(date), "HH:mm", { locale: ptBR })
      
        return `${formattedDate} às ${formattedTime}`
      }

    function formatDuration(duration: string) {
        const seconds = parseInt(duration.replace('s', ''), 10)

        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60

        let formatted = ''
        if (hours > 0) {
            formatted += `${hours} h `
        }
        if (minutes > 0) {
            formatted += `${minutes} min `
        }
        if (remainingSeconds > 0) {
            formatted += `${remainingSeconds} s`
        }

        return formatted || '0 s'
    }

    function formatDistance(distance: number) {
        const kilometers = distance / 1000
    
        return new Intl.NumberFormat('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(kilometers) + " km"
    }

    async function onSubmit(data: RidesHistorySchema) {
        setIsFetchingRides(true)
        const rides = await fetchRides(data.customer_id)
        setIsFetchingRides(false)

        if ('error_code' in rides) {
            toast.error(rides.error_description, {
                className: 'bg-rose-500 text-neutral-50'
            })
            setFetchedRides(null)
            return
        }

        setFetchedRides(rides)
        toast.success('Atualizado com sucesso', {
            className: 'bg-emerald-500 text-neutral-50'
        })
    }

    return (
        <main className="flex-1 overflow-x-hidden">
            <h1 className="border-b border-neutral-300 text-neutral-800 h-16 flex items-center font-bold px-2 text-lg">Histórico de viagens</h1>
            <div className="flex max-2xl:flex-col p-2 gap-2 w-full max-w-[1920px] mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="border h-96 bg-neutral-50 border-neutral-300 gap-4 rounded-lg shadow-sm flex flex-col w-full max-w-sm max-md:max-w-full">
                    <h2 className="font-medium border-b border-neutral-300 h-14 px-2 flex items-center text-neutral-800">
                        Pesquisa de viagens
                    </h2>
                    <div className="flex max-sm:items-center flex-col gap-4 p-2 pt-0 items-start">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="customer_id" className="text-xs">Id do usuário</label>
                            <input {...register('customer_id')} type="text" id="customer_id" className="text-neutral-800 border rounded-lg w-full max-w-52 font-extralight p-1 border-neutral-300" />
                            <small className="text-xs text-rose-400">
                                {errors.customer_id ? errors.customer_id.message : 'ㅤ'}
                            </small>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="driver" className="text-xs">Selecionar motorista</label>
                            <select name="driver" id="driver" defaultValue="*" className="appearance-none bg-neutral-50 text-neutral-800 border rounded-lg w-52 font-extralight p-1 border-neutral-300">
                                <option value="*" className="text-neutral-800 font-extralight" defaultChecked>Mostrar Todos</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-neutral-800 max-sm:mt-8 py-2 px-5 text-sm rounded-lg text-neutral-50 hover:bg-neutral-700 transition duration-200 flex items-center justify-center gap-2"
                        >
                            Pesquisar
                            {isFetchingRides && <Loader2 className="size-3.5 animate-spin" />}
                        </button>
                    </div>
                </form>
                <div className="border bg-neutral-50 max-lg:overflow-x-auto max-lg:min-h-96 border-neutral-300 gap-4 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
                    <h2 className="font-medium border-b border-neutral-300 min-h-14 px-2 flex items-center text-neutral-800">
                        Histórico de viagens
                        {fetchedRides?.customer_id && <span>ㅤ de {fetchedRides.customer_id}</span>}
                    </h2>
                    <div className={`lg:px-2 px-0 flex max-lg:overflow-x-auto max-lg:min-h-96 ${fetchedRides && fetchedRides.rides.length ? '' : 'items-center justify-center'}`}>
                        {
                            fetchedRides && fetchedRides.rides.length ? (
                                <table className="max-lg:w-6xl w-full table-auto max-lg:h-fit max-lg:min-w-[1024px]">
                                    <thead>
                                        <tr className="border-b border-neutral-300 bg-neutral-100">
                                            <th className="text-left text-sm font-medium text-neutral-800 p-2">Data e hora da viagem</th>
                                            <th className="text-left text-sm font-medium text-neutral-800 p-2">Nome do motorista</th>
                                            <th className="text-left text-sm font-medium text-neutral-800 p-2">Origem</th>
                                            <th className="text-left text-sm font-medium text-neutral-800 p-2">Destino</th>
                                            <th className="text-left text-sm font-medium text-neutral-800 p-2">Distância</th>
                                            <th className="text-left text-sm font-medium text-neutral-800 p-2">Tempo</th>
                                            <th className="text-left text-sm font-medium text-neutral-800 p-2">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            formattedRides.map((ride) => (
                                                <tr className="border-b border-neutral-300 hover:bg-neutral-100">
                                                    <td className="p-2 text-sm text-neutral-700">{ride.formattedDate}</td>
                                                    <td className="p-2 text-sm text-neutral-700">{ride.driver.name}</td>
                                                    <td className="p-2 text-sm text-neutral-700">{ride.origin}</td>
                                                    <td className="p-2 text-sm text-neutral-700">{ride.destination}</td>
                                                    <td className="p-2 text-sm text-neutral-700">{ride.formattedDistance}</td>
                                                    <td className="p-2 text-sm text-neutral-700">{ride.formattedDuration}</td>
                                                    <td className="p-2 text-sm text-neutral-700">{ride.formattedValue}</td>
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
                </div>
            </div>
        </main>
    )
}
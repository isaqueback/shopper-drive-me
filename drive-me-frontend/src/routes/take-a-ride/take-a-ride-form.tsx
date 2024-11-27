// take-a-ride-form.tsx

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { ErrorResponse, Estimate, RideContext } from "../../contexts/ride-context"
import { toast } from "sonner"


const rideFormSchema = z.object({
    customer_id: z
        .string({ message: 'O ID do cliente deve ser uma string' })
        .min(1, 'O ID do cliente é obrigatório'),
    destination: z
        .string({ message: 'O destino deve ser uma string' })
        .min(1, 'O destino é obrigatório'),
    origin: z
        .string({ message: 'O ID da origem deve ser uma string' })
        .min(1, 'A origem é obrigatória'),
})
    .refine(
        ({ origin, destination }) => {
            return origin !== destination
        },
        {
            message: 'Origem e destino não podem ser os mesmos',
            path: ['origin'],
        },
    )


type RideFormSchema = z.infer<typeof rideFormSchema>

async function fetchEstimates(data: RideFormSchema): Promise<Estimate | ErrorResponse> {
    try {
        const response = await fetch('http://localhost:8080/ride/estimate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const _estimate: Omit<Estimate, | 'customer_id'> = await response.json()
            const estimate: Estimate = {
                ..._estimate,
                customer_id: data.customer_id,
                sOrigin: data.origin,
                sDestination: data.destination,
            }
            return estimate
        }

        const error: ErrorResponse = await response.json()

        return error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
        return {
            error_code: 'NETWORK_ERROR',
            error_description: 'Não foi possível se conectar ao servidor. Verifique sua conexão de internet e tente novamente',
        }
    }
}

export function TakeARideForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RideFormSchema>({
        resolver: zodResolver(rideFormSchema),
        mode: 'onChange',
    })
    const [isRequesting, setIsRequesting] = useState(false)
    const { setEstimate } = useContext(RideContext)

    async function onSubmit(data: RideFormSchema): Promise<void> {
        setIsRequesting(true)
        const response = await fetchEstimates(data)
        setIsRequesting(false)

        if ('error_code' in response) {
            console.error(response)

            switch (response.error_code) {
                case 'GOOGLE_GEOCODING_ERROR':
                    toast.error('Não foi possível entender este endereço', {
                        className: 'bg-rose-500 text-neutral-50'
                    })
                    break
                case 'GOOGLE_ROUTES_ERROR':
                    toast.error('Não foi possível calcular esta rota', {
                        className: 'bg-rose-500 text-neutral-50'
                    })
                    break
                case 'INVALID_DATA':
                    toast.error('Por favor, preencha todos os campos corretamente', {
                        className: 'bg-rose-500 text-neutral-50'
                    })
                    break
                default:
                    toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde', {
                        className: 'bg-rose-500 text-neutral-50'
                    })
            }
        } else {
            setEstimate(response)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="border h-96 bg-neutral-50 border-neutral-300 gap-4 rounded-lg shadow-sm flex flex-col flex-1">
            <h2 className="font-medium border-b border-neutral-300 h-14 px-2 flex items-center text-neutral-800">Informe os detalhes da viagem</h2>
            <div className="flex flex-col gap-4 max-sm:items-center p-2 pt-0 items-start">
                <div className="flex flex-col gap-1">
                    <label htmlFor="customer_id" className="text-xs">Id do usuário</label>
                    <input {...register('customer_id')} type="text" id="customer_id" className="text-neutral-800 border rounded-lg w-full max-w-52 font-extralight p-1 border-neutral-300" />
                    <small className="text-xs text-rose-400">
                        {errors.customer_id ? errors.customer_id?.message : 'ㅤ'}
                    </small>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="origin" className="text-xs">Origem</label>
                    <input {...register('origin')} type="text" id="origin" className="text-neutral-800 border rounded-lg w-full max-w-52 font-extralight p-1 border-neutral-300" />
                    <small className="text-xs text-rose-400">
                        {errors.origin ? errors.origin.message : 'ㅤ'}
                    </small>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="destination" className="text-xs text-neutral-800">Destino</label>
                    <input {...register('destination')} type="text" id="destination" className="text-neutral-800 border rounded-lg w-full max-w-52 font-extralight p-1 border-neutral-300" />
                    <small className="text-xs text-rose-400">
                        {errors.destination ? errors.destination.message : 'ㅤ'}
                    </small>
                </div>
                <button type="submit" className="bg-neutral-800 flex gap-2 items-center justify-center py-2 px-5 text-sm rounded-lg text-neutral-50 hover:bg-neutral-700 transition duration-200">
                    Calcular rota
                    {isRequesting && <Loader2 className="size-3.5 animate-spin" />}
                </button>
            </div>
        </form>
    )
}
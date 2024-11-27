// ride-contexts

import { createContext, ReactNode, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

export type ErrorResponse = {
    error_code: string
    error_description: string
}

type GoogleRouteResponse = {
    routes: Array<{
        distanceMeters: number // Distance in meters
        duration: string // Duration as a string (e.g., "165s")
        polyline: {
            encodedPolyline: string
        }
    }>
}

export type Driver = {
    id: number
    name: string
    description: string | null
    vehicle: string
    review: {
        rating: number | null
        comment: string | null
    }
    value: number
}

export type Estimate = {
    customer_id: string
    sDestination: string
    sOrigin: string
    distance: number
    duration: string
    routeResponse: GoogleRouteResponse
    options: Driver[]
    origin: {
        latitude: number
        longitude: number
    }
    destination: {
        latitude: number
        longitude: number
    }
}

export type Rides = {
    customer_id: string
    rides: {
        date: Date
        destination: string
        distance: number
        duration: string
        driver: {
            id: number
            name: string
        }
        id: number
        origin: string
        value: number
    }[]
}

const confirmDriverSchema = z
    .object({
        customer_id: z.coerce
            .string({ message: 'O ID do cliente deve ser uma string' })
            .min(1, 'O ID do cliente é obrigatório'),
        destination: z
            .string({ message: 'O destino deve ser uma string' })
            .min(1, 'O destino é obrigatório'),
        distance: z.coerce
            .number({ message: 'A distância deve ser um número' })
            .positive({ message: 'A distância deve ser um número positivo' }),
        driver: z.object({
            id: z.coerce
                .number({ message: 'O ID do motorista deve ser um número' })
                .int({ message: 'O ID do motorista deve ser um número inteiro' })
                .positive({ message: 'O ID do motorista deve ser um número positivo' })
                .min(1, 'O ID do motorista é obrigatório'),
            name: z
                .string({ message: 'O nome do motorista deve ser uma string' })
                .min(1, 'O nome do motorista é obrigatório'),
        }),
        duration: z.string().min(1, 'A duração é obrigatória'),
        origin: z.string().min(1, 'A origem é obrigatória'),
        value: z.coerce.number({ message: 'O valor deve ser um número' }),
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

export type ConfirmDriverSchema = z.infer<typeof confirmDriverSchema>

interface RideContextType {
    estimate: Estimate | null
    setEstimate: (estimate: Estimate) => void
    chosenDriver: ConfirmDriverSchema | null
    isOpenConfirmDriverModal: boolean
    handleChooseDriver: (arg: ConfirmDriverSchema) => void
    handleConfirmDriver: (arg: ConfirmDriverSchema | null) => Promise<void>
    handleCancelDriver: () => void
    isConfirmingDriver: boolean
    fetchRides: (customer_id: string, driver_id?: number) => Promise<Rides | ErrorResponse>
    fetchedRides: Rides | null
    setFetchedRides: React.Dispatch<React.SetStateAction<Rides | null>>
}

interface RideProviderProps {
    children: ReactNode
}

export const RideContext = createContext({} as RideContextType)

export function RideProvider({ children }: RideProviderProps) {
    const [estimate, _setEstimate] = useState<Estimate | null>(null)
    const [chosenDriver, setChosenDriver] = useState<ConfirmDriverSchema | null>(null)
    const [isOpenConfirmDriverModal, setIsOpenConfirmDriverModal] = useState(false)
    const [isConfirmingDriver, setIsConfirmingDriver] = useState(false)
    const [fetchedRides, setFetchedRides] = useState<Rides | null>(null)

    function setEstimate(estimate: Estimate) {
        _setEstimate(estimate)
    }

    async function confirmDriver(data: ConfirmDriverSchema): Promise<{ success: true } | ErrorResponse> {
        try {
            const response = await fetch('http://localhost:8080/ride/confirm', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                return { success: true }
            }

            const responseError: ErrorResponse = await response.json()
            const error: ErrorResponse = {} as ErrorResponse

            error.error_code = responseError.error_code

            switch (responseError.error_code) {
                case 'INVALID_DATA':
                    error.error_description = 'Por favor, preencha todos os campos corretamente'
                    break
                case 'DRIVER_NOT_FOUND':
                    error.error_description = 'Nenhum motorista encontrado'
                    break
                case 'INVALID_DISTANCE':
                    error.error_description = 'Quilometragem inválida para o motorista'
                    break
                case 'GOOGLE_GEOCODING_ERROR':
                    error.error_description = 'Não foi possível entender este endereço'
                    break
                default:
                    error.error_description = 'Ocorreu um erro inesperado. Tente novamente mais tarde'
            }

            return error
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            return {
                error_code: 'NETWORK_ERROR',
                error_description: 'Não foi possível se conectar ao servidor. Verifique sua conexão de internet e tente novamente',
            }
        }
    }

    function handleChooseDriver(arg: ConfirmDriverSchema) {
        setChosenDriver(arg)
        setIsOpenConfirmDriverModal(true)
    }

    const navigate = useNavigate()

    async function handleConfirmDriver(arg: ConfirmDriverSchema | null): Promise<void> {
        setIsConfirmingDriver(true)

        if (arg === null) {
            toast.error('Ocorreu um erro, tente novamente mais tarde', {
                className: 'bg-rose-500 text-neutral-50'
            })
            setIsConfirmingDriver(false)
            return
        }

        const data = confirmDriverSchema.safeParse(arg)
        if (!data.success) {
            toast.error(data.error.errors[0].message, {
                className: 'bg-rose-500 text-neutral-50'
            })
            setIsConfirmingDriver(false)
            return
        }
        const result = await confirmDriver(arg)

        if ('error_code' in result) {
            toast.error(result.error_description, {
                className: 'bg-rose-500 text-neutral-50'
            })
            setIsConfirmingDriver(false)
            return
        }

        toast.success('Seu pedido foi realizado com sucesso!', {
            className: 'bg-emerald-500 text-neutral-50'
        })
        setIsConfirmingDriver(false)
        const rides = await fetchRides(arg.customer_id)
        
        setIsOpenConfirmDriverModal(false)
        if ('error_code' in rides) {
            toast.error('Não foi possível mostrar o histórico de viagens', {
                className: 'bg-rose-500 text-neutral-50'
            })
            return
        }
        setFetchedRides(rides)
        navigate('/rides-history')
        
    }

    function handleCancelDriver(): void {
        setIsOpenConfirmDriverModal(false)
        setChosenDriver(null)
    }

    async function fetchRides(customer_id: string, driver_id?: number): Promise<Rides | ErrorResponse> {
        try {
            const baseUrl = new URL(`http://localhost:8080/ride/${customer_id}`)
    
            if (driver_id) {
                baseUrl.searchParams.append('driver_id', driver_id.toString())
            }
            const response = await fetch(baseUrl.toString())
    
            if (response.ok) {
                const rides: Rides = await response.json()
    
                return rides
            }
    
            const errorResponse: ErrorResponse = await response.json()
            const error: ErrorResponse = {} as ErrorResponse
            error.error_code = errorResponse.error_code
            switch(errorResponse.error_code) {
                case 'NO_RIDES_FOUND':
                    error.error_description = 'Nenhuma viagem encontrada'
                    break
                case 'INVALID_DRIVER':
                    error.error_description = 'ID de motorista inválido'
                    break
                default:
                    error.error_description = 'Ocorreu um erro inesperado. Tente novamente mais tarde'
            }
    
            return error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch(err: unknown) {
            return {
                error_code: 'NETWORK_ERROR',
                error_description: 'Não foi possível se conectar ao servidor. Verifique sua conexão de internet e tente novamente',
            }
        }
    }

    return (
        <RideContext.Provider
            value={{
                estimate,
                setEstimate,
                chosenDriver,
                isOpenConfirmDriverModal,
                handleChooseDriver,
                handleConfirmDriver,
                handleCancelDriver,
                isConfirmingDriver,
                fetchRides,
                fetchedRides,
                setFetchedRides
            }}
        >
            {children}
        </RideContext.Provider>
    )
}
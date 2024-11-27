// aside-menu.tsx

import { Link, useLocation } from "react-router"
import { History, Car } from 'lucide-react'

export function AsideMenu() {
    const location = useLocation()

    const isTakeATripRoute = location.pathname === '/'
    const isRidesHistoryRoute = location.pathname === '/rides-history'
    
    return (
        <aside className="flex flex-col min-h-screen max-sm:min-h-fit max-sm:w-screen border-r max-sm:justify-center max-sm:bg-blue-200 max-sm:bottom-0 border-neutral-300 max-sm:fixed max-sm:flex-row">
            <nav className="flex flex-col max-sm:flex-row items-center gap-3">
                <Link to='/' aria-label="Logotipo que leva para a página de fazer viagem (home)" className="text-sm font-bold border-b max-sm:order-2 border-neutral-300 text-center w-full px-2 h-16 flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" title="Driver-me" className="size-14 scale-95 max-sm:scale-75" />               
                </Link>
                <Link to='/' title="Faça uma viagem" aria-label="Faça uma viagem" className={`border-2 p-2 rounded-lg flex justify-center max-sm:order-1 items-center ${isTakeATripRoute ? 'border-blue-500' : 'border-neutral-200 max-sm:border-neutral-400'}`}>
                    <Car className={`${isTakeATripRoute ? 'text-blue-500' : 'text-neutral-500 max-sm:text-neutral-400'}`} />
                </Link>
                <Link to='/rides-history' title="Histórico de viagens" aria-label="Histórico de viagens" className={`border-2 p-2 rounded-lg max-sm:order-3 flex justify-center items-center ${isRidesHistoryRoute ? 'border-blue-500' : 'border-neutral-200 max-sm:border-neutral-400'}`}>
                    <History className={`${isRidesHistoryRoute ? 'text-blue-500' : 'text-neutral-500 max-sm:text-neutral-400'}`} />
                </Link>
            </nav>
    </aside>
    )
}
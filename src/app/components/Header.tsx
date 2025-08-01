import Link from "next/link";

export default function Header() {
    return (
        <nav className="flex w-full justify-center py-6 items-center 
        border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/95 text-sm px-6 lg:px-8 sticky top-0 z-50 shadow-2xl">
            <div className="max-w-7xl flex w-full items-center justify-center">
                <Link href='/' className="font-black text-3xl text-white flex items-center gap-4 hover:scale-105 transition-transform duration-300 uppercase tracking-wider">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center border border-red-400/30 shadow-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                    <span>Tune Gawd</span>
                </Link>
            </div>
        </nav>
    );
}

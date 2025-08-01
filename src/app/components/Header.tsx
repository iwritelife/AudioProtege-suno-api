import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";

export default function Header() {
    return (
        <nav className="flex w-full justify-center py-4 items-center 
        border-b border-gray-700 backdrop-blur-xl bg-gray-900/95 text-sm px-6 lg:px-8 sticky top-0 z-50 shadow-2xl">
            <div className="max-w-7xl flex w-full items-center justify-center">
                <div className="font-bold text-2xl text-white flex items-center gap-3 hover:scale-105 transition-transform duration-300 uppercase tracking-wider">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center border border-red-500/30">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                    <Link href='/'>
                        Tune Gawd
                    </Link>
                </div>
            </div>
        </nav>
    );
}

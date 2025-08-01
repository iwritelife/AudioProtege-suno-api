import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";

export default function Header() {
    return (
        <nav className="flex w-full justify-center py-6 items-center 
        border-b border-slate-200/50 backdrop-blur-xl bg-white/80 text-sm px-6 lg:px-8 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl flex w-full items-center justify-center">
                <div className="font-bold text-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                    <Logo className="w-4 h-4" />
                    <Link href='/'>
                        Tune Gawd
                    </Link>
                </div>
            </div>
        </nav>
    );
}

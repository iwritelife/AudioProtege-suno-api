import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";

export default function Header() {
    return (
        <nav className="flex w-full justify-center py-8 items-center 
        border-b border-white/10 backdrop-blur-xl bg-black/20 text-sm px-6 lg:px-8 sticky top-0 z-50">
            <div className="max-w-7xl flex w-full items-center justify-center">
                <div className="font-bold text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                    <Logo className="w-4 h-4" />
                    <Link href='/'>
                        Tune Gawd
                    </Link>
                </div>
            </div>
        </nav>
    );
}

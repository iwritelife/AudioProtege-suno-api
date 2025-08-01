import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="flex w-full justify-center py-6 items-center bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white/70 backdrop-blur-xl border-t border-white/10 text-sm px-4 lg:px-0">
            <div className="flex items-center gap-2">
                <span>© 2024</span>
                <Link 
                    href="https://github.com/gcui-art/suno-api/" 
                    className="text-white/70 hover:text-white transition-colors duration-200 font-medium"
                >
                    Tune Gawd
                </Link>
                <span className="text-white/40">•</span>
                <span className="text-white/50">AI Music Studio</span>
            </div>
        </footer>
    );
}

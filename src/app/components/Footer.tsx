import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="flex w-full justify-center py-8 items-center bg-white/80 backdrop-blur-xl border-t border-slate-200/50 text-slate-600 text-sm px-4 lg:px-0">
            <div className="flex items-center gap-2">
                <span>© 2024</span>
                <Link 
                    href="https://github.com/gcui-art/suno-api/" 
                    className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium"
                >
                    Tune Gawd
                </Link>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">AI Music Studio</span>
            </div>
        </footer>
    );
}

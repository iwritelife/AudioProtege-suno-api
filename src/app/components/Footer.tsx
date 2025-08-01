import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex w-full justify-center py-8 items-center bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 text-slate-400 text-sm px-4 lg:px-0">
            <div className="flex items-center gap-4">
                <span className="uppercase tracking-wider font-bold">© 2025</span>
                <Link 
                    href="https://github.com/gcui-art/suno-api/" 
                    className="text-slate-400 hover:text-white transition-colors duration-200 font-bold uppercase tracking-wider"
                >
                    Tune Gawd
                </Link>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 uppercase tracking-wider font-bold">Professional AI Music Studio</span>
            </div>
        </footer>
    );
}

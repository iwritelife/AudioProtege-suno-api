import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";

export default function Header() {
    return (
        <nav className="flex w-full justify-center py-6 items-center 
        border-b border-slate-200/50 backdrop-blur-xl bg-white/80 text-sm px-4 lg:px-0 sticky top-0 z-50">
            <div className="max-w-3xl flex w-full items-center justify-between">
                <div className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                    <Logo className="w-4 h-4" />
                    <Link href='/'>
                        Suno API
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-700">
                    <Link href="/" className="px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </Link>
                    <Link href="/create" className="px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        Create
                    </Link>
                    <Link href="/docs" className="px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        API Docs
                    </Link>
                    <a 
                        href="https://github.com/gcui-art/suno-api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center gap-2"
                    >
                        <Image src="/github-mark.png" alt="GitHub" width={16} height={16} />
                        GitHub
                    </a>
                </div>
            </div>
        </nav>
    );
}

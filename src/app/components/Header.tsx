import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";

export default function Header() {
    return (
        <nav className="flex w-full justify-center py-6 items-center 
        border-b border-white/10 backdrop-blur-xl bg-black/20 text-sm px-4 lg:px-0 sticky top-0 z-50">
            <div className="max-w-3xl flex w-full items-center justify-between">
                <div className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Logo className="w-4 h-4" />
                    <Link href='/'>
                        Tune Gawd
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-white/70">
                    <Link href="/" className="px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-2 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Studio
                    </Link>
                    <Link href="/docs" className="px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-2 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        API Docs
                    </Link>
                    <a 
                        href="https://github.com/gcui-art/suno-api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-2 hover:text-white"
                    >
                        <Image src="/github-mark.png" alt="GitHub" width={16} height={16} />
                        GitHub
                    </a>
                </div>
            </div>
        </nav>
    );
}

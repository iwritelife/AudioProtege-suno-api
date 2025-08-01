import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="flex w-full justify-center py-6 items-center bg-gray-900/95 backdrop-blur-xl border-t border-gray-700 text-gray-400 text-xs px-4 lg:px-0">
            <div className="flex items-center gap-2">
                <span className="uppercase tracking-wider font-bold">© 2024</span>
                <Link 
                    href="https://github.com/gcui-art/suno-api/" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 font-bold uppercase tracking-wider"
                >
                    Tune Gawd
                </Link>
                <span className="text-gray-600">•</span>
                <span className="text-gray-500 uppercase tracking-wider font-bold">AI Music Studio</span>
            </div>
        </footer>
    );
}

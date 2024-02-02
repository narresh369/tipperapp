import { NavMobile } from "./nav-mobile";
import { NavDesktop } from "./nav-desktop";

export const Topbar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 bg-neutral-950 border-b border-neutral-700">
            <nav className="container flex items-center justify-between py-1 lg:py-5">
                {/* <span className="text-lg">⚡️</span> */}
                <img src="/logo.png" style={{ height: '65px', width: '80px' }}
                    alt="Logo" className="logo" />
                <h1 className="text-2xl font-bold text-center">Tipper App</h1>
                <NavMobile />
                <NavDesktop />
            </nav>
        </div>
    );
};

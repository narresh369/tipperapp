import { routes } from "../routes";
import { Link } from 'react-router-dom';
import './nav-desktop.css'; // Import your CSS file for styling
import { NavLink } from 'react-router-dom';

export const NavDesktop = () => {
    return (
        <ul className="hidden lg:flex lg:items-center gap-5 text-sm">
            {routes.map((route) => {
                const { Icon, href, title } = route;                
                return (
                   /*  <li key={title}>
                        <Link to={href} className="flex items-center gap-1 hover:text-neutral-400 transition-all"                          
>
                            <Icon size={30} color="lime" />
                            {title}
                        </Link>
                    </li> */
                    <li key={title}>
                        <NavLink
                            to={href}
                            className="flex items-center gap-1 hover:text-neutral-400 transition-all"
                            activeClassName="active"  // Add this line
                        >
                            <Icon size={30} color="lime" />
                            {title}
                        </NavLink>
                    </li>

                );
            })}
        </ul>
    );
};
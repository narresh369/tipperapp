import { BiHomeAlt2 } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { PiChatCircleBold } from "react-icons/pi";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdLocalShipping } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai'; // Import the edit icon
import { AiOutlineUnorderedList } from 'react-icons/ai';

export const routes = [
    {
        title: "Home",
        path: '/',
        href: '/',
        Icon: BiHomeAlt2,
    },
    {
        title: "Tipper",
        path: '/tipper',
        href: '/tipper',
        Icon: MdLocalShipping,
    },
    {
        title: "Tipper-List",
        path: '/tipperlist',
        href: '/tipperlist',
        Icon: AiOutlineUnorderedList,
    },
    {
        title: "Reports",
        path: '/reports',
        href: '/reports',
        Icon: IoPricetagsOutline,
    },
   /*  {
        title: "Pricing",
        path: '/pricing',
        href: '/pricing',
        Icon: IoPricetagsOutline,
    }, */
    {
        title: "About",
        path: '/about',
        href: '/about',
        Icon: PiChatCircleBold,
    },
   /*  {
        title: "Edit Tipper",
        path: '/tipper/edit/:id', // Adjust the path to include an ID parameter
        href: '/tipper/edit/1', // Example: You can set a default ID or adjust it dynamically
        Icon: AiOutlineEdit, // Use the edit icon for this route
    }, */
];
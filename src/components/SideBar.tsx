// import { NavLink } from 'react-router-dom';
// import { HomeIcon, CalendarDaysIcon, BookOpenIcon, UserGroupIcon, ReceiptPercentIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

// const mainNav = [
//     { label: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
//     { label: 'Session', icon: CalendarDaysIcon, href: '/session' },
//     { label: 'Course', icon: BookOpenIcon, href: '/course' },
//     { label: 'Users', icon: UserGroupIcon, href: '/users' },
//     { label: 'Notes', icon: PencilSquareIcon, href: '/notes' },
//     { label: 'Invoice', icon: ReceiptPercentIcon, href: '/invoices' },
//     // { label: 'Product', icon: CubeIcon, href: '/product' },
//     // { label: 'Expense', icon: BanknotesIcon, href: '/expense' },
// ];

// export default function Sidebar() {
//     return (
//         <aside className="fixed top-0 left-0 h-full bg-primary text-primary-content flex flex-col w-16 md:w-64 transition-all duration-300">
//             <nav className="space-y-2 py-2 px-0 md:px-4">
//                 {mainNav.map(({ label, icon: Icon, href }) => (
//                     <NavLink
//                         key={label}
//                         to={href}
//                         className={({ isActive }) =>
//                             `flex items-center justify-center md:justify-start px-4 py-3 rounded transition ${isActive ? 'bg-secondary text-secondary-content' : 'hover:bg-secondary'
//                             }`
//                         }
//                         title={label}
//                     >
//                         <Icon className="h-6 w-6 flex-shrink-0" />
//                         <span className="hidden md:inline ml-3">{label}</span>
//                     </NavLink>
//                 ))}
//             </nav>
//         </aside>
//     );
// }
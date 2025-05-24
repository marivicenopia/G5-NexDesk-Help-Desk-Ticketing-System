import { FaUsers, FaTachometerAlt, FaTicketAlt, FaCog, FaSignOutAlt, FaBook, FaCommentDots } from "react-icons/fa";
import { PATHS } from "../../../../routes/constant";

export const AdminSideBarItems = [
  {
    label: "Dashboard",
    icon: FaTachometerAlt,
    path: PATHS.ADMIN.DASHBOARD.path,
  },
  {
    label: "Users",
    icon: FaUsers,
    children: [
      { label: "All Users", path: PATHS.ADMIN.MANAGE_USERS.path },
      { label: "Admins", path: `${PATHS.ADMIN.MANAGE_USERS.path}?role=admin` },
      { label: "Agents", path: `${PATHS.ADMIN.MANAGE_USERS.path}?role=agent` },
      { label: "Users", path: `${PATHS.ADMIN.MANAGE_USERS.path}?role=user` },
      { label: "Create User", path: `${PATHS.ADMIN.CREATE_USER.path}?role=admin` },
    ],
  },
  {
    label: "Tickets",
    icon: FaTicketAlt,
    children: [
      { label: "View Tickets", path: PATHS.ADMIN.MANAGE_TICKETS.path },
      { label: "Create Ticket", path: `${PATHS.ADMIN.CREATE_TICKET.path}`},
    ],
  },
  {
    label: "Knowledgebase",
    icon: FaBook,
    path: PATHS.ADMIN.KNOWLEDGEBASE.path,
  },
  {
    label: "Feedback",
    icon: FaCommentDots,
    path: PATHS.ADMIN.VIEW_FEEDBACK.path,
  },
];

export const SideBarFooterItems = [
  {
    label: "Settings",
    icon: FaCog,
    path: "/admin/settings",
  },
  {
    label: "Logout",
    icon: FaSignOutAlt,
    action: true,
  },
];
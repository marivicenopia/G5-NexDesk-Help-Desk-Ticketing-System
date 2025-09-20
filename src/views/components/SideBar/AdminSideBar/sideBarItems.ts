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
      { label: "Staff", path: `${PATHS.ADMIN.MANAGE_USERS.path}?role=staff` },
      { label: "Create User", path: `${PATHS.ADMIN.CREATE_USER.path}?role=admin` },
    ],
  },
  {
    label: "Tickets",
    icon: FaTicketAlt,
    children: [
      { label: "Manage Tickets", path: "/admin/tickets" },
      { label: "Ticket Assignment", path: "/admin/tickets/assignment" },
      { label: "Ticket Tracking", path: "/admin/tickets/tracking" },
      { label: "Ticket Summary", path: "/admin/tickets/analytics" },
      { label: "Create Ticket", path: "/admin/tickets/create" },
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
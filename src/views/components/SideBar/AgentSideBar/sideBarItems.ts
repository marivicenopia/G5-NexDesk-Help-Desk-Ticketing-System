import { FaTachometerAlt, FaTicketAlt, FaCog, FaSignOutAlt, FaBook, FaCommentDots } from "react-icons/fa";
import { PATHS } from "../../../../routes/constant";

export const AgentSideBarItems = [
    {
        label: "Dashboard",
        icon: FaTachometerAlt,
        path: PATHS.AGENT.DASHBOARD.path,
    },
    {
        label: "Tickets",
        icon: FaTicketAlt,
        children: [
            { label: "My Tickets", path: PATHS.AGENT.MY_TICKETS.path },
            { label: "Ticket Assignment", path: PATHS.AGENT.TICKET_ASSIGNMENT.path },
        ],
    },
    {
        label: "Knowledge Base",
        icon: FaBook,
        children: [
            { label: "View Articles", path: PATHS.AGENT.KNOWLEDGEBASE.path },
            { label: "Add Article", path: PATHS.AGENT.ADD_ARTICLE.path },
        ],
    },
    {
        label: "Feedback",
        icon: FaCommentDots,
        path: PATHS.AGENT.VIEW_FEEDBACK.path,
    },
];

export const AgentSideBarFooterItems = [
    {
        label: "Settings",
        icon: FaCog,
        path: PATHS.AGENT.SETTINGS.path,
    },
    {
        label: "Logout",
        icon: FaSignOutAlt,
        action: true,
    },
];

import './LeftSidebar.css'
import { MdOutlineBarChart, MdOutlineSettings, MdOutlinePerson, MdOutlineConfirmationNumber } from 'react-icons/md'
import { Link } from 'react-router-dom'

function LeftSidebar() {
    return (
        <div className="sidebar">
            <div className="logo-container">
                <div className="logo">N</div>
            </div>
            <nav>
                <Link to="/tickets" className="icon-link" title="Tickets Management">
                    <MdOutlineConfirmationNumber size={24} />
                </Link>
                <Link to="/summary" className="icon-link" title="Ticket Summary">
                    <MdOutlineBarChart size={24} />
                </Link>
                <Link to="/profile" className="icon-link" title="Profile">
                    <MdOutlinePerson size={24} />
                </Link>
                <Link to="/settings" className="icon-link" title="Settings">
                    <MdOutlineSettings size={24} />
                </Link>
                <div className="image-profile">J</div>
            </nav>
        </div>
    )
}

export default LeftSidebar
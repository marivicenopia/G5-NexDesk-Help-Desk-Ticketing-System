import React from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom";
>>>>>>> origin/main

interface SidebarSubmenuProps {
  items: { label: string; path: string }[];
  onClose: () => void;
}

const SidebarSubMenu: React.FC<SidebarSubmenuProps> = ({ items, onClose }) => {
<<<<<<< HEAD
=======
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    onClose();
    navigate(path);
  };

>>>>>>> origin/main
  return (
    <div className="w-48 bg-[#031849] shadow-md p-4 space-y-3">
      <button onClick={onClose} className="text-sm text-white hover:text-red-500 float-right">
        Close
      </button>
      {items.map((item) => (
<<<<<<< HEAD
        <Link key={item.label} to={item.path} className="block text-white hover:underline">
          {item.label}
        </Link>
=======
        <button
          key={item.label}
          onClick={() => handleItemClick(item.path)}
          className="block text-white hover:underline w-full text-left"
        >
          {item.label}
        </button>
>>>>>>> origin/main
      ))}
    </div>
  );
};

<<<<<<< HEAD
export default SidebarSubMenu;
=======
export default SidebarSubMenu;
>>>>>>> origin/main

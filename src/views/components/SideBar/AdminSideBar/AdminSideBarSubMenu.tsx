import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface SidebarSubmenuProps {
  items: { label: string; path: string }[];
  onClose: () => void;
}

const SidebarSubMenu: React.FC<SidebarSubmenuProps> = ({ items, onClose }) => {
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="w-48 bg-[#031849] shadow-md p-4 space-y-3">
      <button onClick={onClose} className="text-sm text-white hover:text-red-500 float-right">
        Close
      </button>
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => handleItemClick(item.path)}
          className="block text-white hover:underline w-full text-left"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SidebarSubMenu;
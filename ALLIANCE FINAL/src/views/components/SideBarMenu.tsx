import React from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, NavLinkProps } from "react-router-dom";

interface SideBarNavProps extends NavLinkProps{
    icon: React.ReactNode;
    text: string;
}

interface SideBarMenuProps {
    pages: Array<SideBarNavProps>;
}

const SideBarMenu = (props: SideBarMenuProps) => {
    return(
        <List>
            {props.pages.map((item, index) => (
                <ListItem component={NavLink} to={item.to} key={index + item.text} disablePadding {...props} className='nav-link'>
                    <ListItemButton>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default SideBarMenu;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import "../style/styles.css"

function SideBar(props) {

    const pathName = useLocation().pathname

    // menus: 각 사이드바의 메뉴들을 담아놓은 배열
    const menus = [
        {name: "Home", path: "/"},
        {name: "대피소 안내", path: "/shelter"},
        {name: "재난행동요령", path: "/manual"}
    ]

    return (
        <div className='sidebar'>
            {menus.map((menu, index) => {
                return (
                    <Link to = {menu.path} key={index}>
                        <SidebarItem menu={menu} isActive={pathName === menu.path ? true : false} />
                    </Link>
                )
            })}
            
        </div>
    );
}

export default SideBar;
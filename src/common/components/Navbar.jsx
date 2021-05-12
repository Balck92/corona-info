import React from 'react'


const Navbar = (props) => {
    return (
        <div>
            <h1 className="nav-text">{props.children}</h1>
        </div>
    )
}

export default Navbar;

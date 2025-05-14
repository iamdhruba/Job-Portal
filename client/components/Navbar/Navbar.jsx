import React from "react";

const Navbar = () => {
    return (
        <>
            <nav className="flex justify-between items-center">
                <div>
                    <img src="../assests/logo.png" alt="Logo" />
                </div>

                <div>
                    <ul>
                        <li className="">
                            <a className="">Home</a>
                            <a className="">Jobs</a>
                            <a className="">About Us</a>
                            <a className="">Contact Us</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <button> Login </button>
                    <button> Register </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;

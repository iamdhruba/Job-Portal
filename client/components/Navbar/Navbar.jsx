import React from "react";

const Navbar = () => {
    return (
        <>
            <nav style={{ background: "#333", padding: "1rem" }}>
                <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
                    <li style={{ marginRight: "1.5rem" }}>
                        <a href="/" style={{ color: "#fff", textDecoration: "none" }}>
                            Home
                        </a>
                    </li>
                    <li style={{ marginRight: "1.5rem" }}>
                        <a href="/jobs" style={{ color: "#fff", textDecoration: "none" }}>
                            Jobs
                        </a>
                    </li>
                    <li>
                        <a href="/about" style={{ color: "#fff", textDecoration: "none" }}>
                            About
                        </a>
                    </li>
                    <li>
                        <a href="/contact" style={{ color: "#fff", textDecoration: "none" }}>
                            Contact Us
                        </a>
                    </li>
                    <li>
                        <a href="/login" style={{ color: "#fff", textDecoration: "none" }}>
                            Login
                        </a>
                    </li>
                    <li>
                        <a href="/register" style={{ color: "#fff", textDecoration: "none" }}>
                            Register
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Navbar;

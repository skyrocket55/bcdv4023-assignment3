import React from 'react';
import Header from './Header';
import { NavLink, useLocation } from 'react-router-dom';
import { faReadme } from '@fortawesome/free-brands-svg-icons';

function Navigation() {
    const location = useLocation();

    const handleNavLinkClick = () => {
        if (location.pathname === '/borrowed-books') {
            window.location.reload();
        }
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-success bg-gradient">
                <div className="container-fluid">
                    <NavLink to="/" className="navbar-brand">
                        <div className='row'>
                            <div className='col'>
                                <Header title="Library DApp" margin="ml-2" icon={faReadme} size="xl"/>
                            </div>
                        </div>
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink to="/add-book" className="nav-link" aria-current="page" >
                                    <Header title="Add Book" />
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/borrowed-books" className="nav-link" aria-current="page" onClick={handleNavLinkClick}>
                                    <Header title="Borrowed Books" />
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navigation
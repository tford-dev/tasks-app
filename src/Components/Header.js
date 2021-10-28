import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default class Header extends React.PureComponent {
    //pageReload() is mainly in this component so when the page refreshes, the correct buttons/links in the nav are rendered 
    pageReload(){
        window.location.reload();
    }

    render(){
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        return(
            <div>
                <header>
                    <nav className="container">
                        <h1 className="nav-logo"><Link to="/">Tasks App</Link></h1>
                        <React.Fragment>
                            {/*If a user is authenticated, the header renders welcome and sign out link/button in nav bar*/}
                            {authUser ?
                                <React.Fragment>
                                    <ul className="nav-ul">
                                        <li className="nav-li"><span><i className="far fa-user-circle"></i> {authUser.firstName}</span></li>
                                        <li className="nav-li"><NavLink to="/signout">Sign Out</NavLink></li>
                                    </ul>
                                </React.Fragment>
                                :
                                    //If signin route, header renders sign-up link/button in nav bar
                                    (window.location.pathname === "/signin") ?
                                        <React.Fragment>
                                            <ul className="nav-ul">
                                                <li onClick={()=>{this.pageReload()}} className="nav-li"><NavLink to="/signup">Sign Up</NavLink></li>
                                            </ul>
                                        </React.Fragment>
                                        :
                                        //If signup route, header renders sign-in link/button in nav bar
                                        (window.location.pathname === "/signup") ?
                                            <React.Fragment>
                                                <ul className="nav-ul">
                                                    <li onClick={()=>{this.pageReload()}} className="nav-li"><NavLink to="/signin">Sign In</NavLink></li>
                                                </ul>
                                            </React.Fragment>
                                            :
                                            //If no user is authenticated, sign-in and sign-up link/buttons are rendered in nav bar
                                            <React.Fragment>
                                                <ul className="nav-ul">
                                                    <li onClick={()=>{this.pageReload()}} className="nav-li"><NavLink to="/signin">Sign In</NavLink></li>
                                                    <li onClick={()=>{this.pageReload()}} className="nav-li"><NavLink to="/signup">Sign Up</NavLink></li>
                                                </ul>
                                            </React.Fragment>
                            }
                        </React.Fragment>
                    </nav>
                </header>
            </div>
        )
    }
}
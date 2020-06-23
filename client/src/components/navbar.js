import React, {useEffect, useState} from "react";
import {Collapse, Nav, Navbar, NavbarToggler, NavItem} from "reactstrap";
import Cookie from "js-cookie";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {useHistory} from "react-router";
import {loginAction, logoutAction} from "../redux/actions.js";
import {ReactComponent as ReactLogo} from "./svgs/blog.svg";

function NavComponent(props) {
    let {loginAction, logoutAction, isLoggedIn, user} = props;
    const [isOpen, setIsOpen] = useState(true);
    const history = useHistory();

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (Cookie.get("user")) {
            loginAction(JSON.parse(Cookie.get("user")));
        } else {
            logoutAction();
        }
    }, [loginAction, logoutAction]);

    return (
        <div>
            <Navbar color="light" light expand="md">
                <Link className="navbar-brand" to="/">
                    <div className="row darkDiv">
                        <ReactLogo className="ml-2 my-auto"/>
                        <p className="d-inline my-auto ml-2">Personal Blog</p>
                    </div>
                </Link>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={!isOpen} navbar>
                    {loggedInNav()}
                </Collapse>
            </Navbar>
        </div>
    );

    function logout() {
        Cookie.remove("token");
        Cookie.remove("user");
        Cookie.remove("username");
        logoutAction();
        history.push("/");
    }

    function loggedInNav() {
        if (isLoggedIn) {
            return (
                <Nav className=" ml-auto" navbar>
                    <NavItem className="my-auto text-white mx-2">
                        <p className="d-inline"> Welcome {`${Cookie.get("username")}`}! </p>
                    </NavItem>
                    <NavItem>
                        <Link className="nav-link" to={`/blogs/${user._id}`}>
                            <p className="d-inline">Your Blogs</p>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link className="nav-link" to="/addBlog">
                            <p className="d-inline">Add Blog</p>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <button className="nav-link button-link" onClick={logout}>
                            <p className="d-inline">Logout</p>
                        </button>
                    </NavItem>
                </Nav>
            );
        }
        return (
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <Link className="nav-link" to="/login">
                        <p className="d-inline">Login</p>
                    </Link>
                </NavItem>
                <NavItem>
                    <Link className="nav-link" to="/signup">
                        <p className="d-inline">Register</p>
                    </Link>
                </NavItem>
            </Nav>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
});

export default connect(mapStateToProps, {logoutAction, loginAction})(NavComponent);

import React from "react";
import "./App.css";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import NavBar from "./components/navbar";
import Login from "./components/login";
import Home from "./components/home";
import AddBlog from "./components/addBlog";
import Register from "./components/register";
import UserBlogs from "./components/userBlogs";
import Blog from "./components/blog";
import "bootstrap/dist/css/bootstrap.min.css";

const routing = props => {
    return (
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/addBlog" exact component={AddBlog}/>
            <Route path="/blogs/:id" exact component={UserBlogs}/>
            <Route path="/blog/:blog_id" exact component={Blog}/>
            <Route path="/login" exact component={Login}/>
            <Route path="/signup" exact component={Register}/>
            <Redirect to="/"/>
        </Switch>
    );
};

const App = props => (
    <BrowserRouter>
        <NavBar/>
        {routing(props)}
    </BrowserRouter>
);

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(App);

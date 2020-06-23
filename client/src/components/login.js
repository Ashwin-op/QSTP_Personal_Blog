import React, {useEffect, useState} from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import Cookie from "js-cookie";
import {connect} from "react-redux";
import {clearAlertAction, errorAlertAction, loginAction} from "../redux/actions.js";
import Alert from "./alert";

const axios = require("axios");

function Login(props) {
    let {clearAlertAction, errorAlertAction, loginAction, history} = props;
    // {clearAlertAction} = props
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const onUserNameChange = e => setUserName(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);

    useEffect(() => {
        clearAlertAction();
        if (Cookie.get("user")) history.push("/");
    }, [clearAlertAction, history]);

    const signIn = async () => {
        await axios({
            method: "post",
            url: "/api/users/login",
            data: {
                username,
                password,
            },
        })
            .then(response => {
                Cookie.set("token", response.data.token);
                Cookie.set("user", JSON.stringify(response.data.user));
                Cookie.set("username", response.data.user.username);
                loginAction(response.data.user);
                history.push("/");
            })
            .catch(err => errorAlertAction(err.response.data));
    };

    const onSubmit = e => {
        e.preventDefault();
        signIn();
    };

    return (
        <div className="container p-5">
            <h3 className="text-center mb-4">Login</h3>
            <Alert/>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label className="mr-sm-2">Username</Label>
                    <Input type="text" onChange={onUserNameChange} value={username} placeholder="username"/>
                </FormGroup>
                <FormGroup>
                    <Label className="mr-sm-2">Password</Label>
                    <Input type="password" onChange={onPasswordChange} value={password} placeholder="don't tell!"/>
                </FormGroup>
                <Button color="primary" onClick={onSubmit}> Sign-In </Button>
            </Form>
        </div>
    );
}

export default connect(null, {loginAction, errorAlertAction, clearAlertAction,})(Login);

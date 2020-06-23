import React, {useEffect, useState} from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {connect} from "react-redux";
import Cookie from "js-cookie";
import {clearAlertAction, errorAlertAction, successAlertAction} from "../redux/actions.js";
import Alert from "./alert";

const axios = require("axios");

function Register(props) {
    let {successAlertAction, errorAlertAction, clearAlertAction, history} = props;
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const onUserNameChange = e => setUserName(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);
    const onNameChange = e => setName(e.target.value);
    const onEmailChange = e => setEmail(e.target.value);

    useEffect(() => {
        clearAlertAction();
        if (Cookie.get("user")) history.push("/");
    }, [clearAlertAction, history]);

    const register = async () => {
        await axios({
            method: "post",
            url: "/api/users",
            data: {
                username,
                password,
                name,
                email,
            },
        })
            .then(response => successAlertAction(response.data))
            .catch(err => errorAlertAction(err.response.data));
    };

    const onSubmit = e => {
        e.preventDefault();
        register();
    };

    return (
        <div className="container p-5">
            <h3 className="text-center mb-4">Register</h3>
            <Alert/>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label className="mr-sm-2">Name</Label>
                    <Input type="text" placeholder="name" onChange={onNameChange} value={name}/>
                </FormGroup>
                <FormGroup>
                    <Label className="mr-sm-2">Email</Label>
                    <Input type="email" placeholder="email" onChange={onEmailChange} value={email}/>
                </FormGroup>
                <FormGroup>
                    <Label className="mr-sm-2">Username</Label>
                    <Input type="text" placeholder="username" onChange={onUserNameChange} value={username}/>
                </FormGroup>
                <FormGroup>
                    <Label className="mr-sm-2">Password</Label>
                    <Input type="password" onChange={onPasswordChange} value={password} placeholder="don't tell!"/>
                </FormGroup>
                <Button color="primary">Sign-Up</Button>
            </Form>
        </div>
    );
}

export default connect(null, {successAlertAction, errorAlertAction, clearAlertAction,})(Register);

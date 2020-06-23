import React, {useEffect, useState} from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {connect} from "react-redux";
import Cookie from "js-cookie";
import {clearAlertAction, successAlertAction} from "../redux/actions.js";
import Alert from "./alert";

const axios = require("axios");

function AddBlog(props) {
    let {successAlertAction, clearAlertAction, history} = props;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const onTitleChange = e => setTitle(e.target.value);
    const onBodyChange = e => setBody(e.target.value);

    useEffect(() => {
        if (!Cookie.get("user")) history.push("/");
        clearAlertAction();
    }, [history, clearAlertAction]);

    const createBlog = async () => {
        const user_id = JSON.parse(Cookie.get("user"));

        await axios({
            method: "post",
            url: "/api/blogs",
            data: {
                blogTitle: title,
                blogBody: body,
                user: user_id._id,
            },
            headers: {
                Authorization: "Bearer " + Cookie.get("token"),
            },
        })
            .then(response => {
                console.log(response.data);
                successAlertAction("Blog created");
            })
            .catch(err => console.log("Error", err.response));
    };

    const onSubmit = e => {
        e.preventDefault();
        createBlog();
    };

    return (
        <div className="container">
            <h3 className="text-center m-4">Create a new article</h3>
            <Alert/>
            <Form onSubmit={onSubmit} className="m-4" autoComplete="off">
                <FormGroup>
                    <Label>Article Title</Label>
                    <Input type="text" onChange={onTitleChange} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleText">Article Content</Label>
                    <Input type="textarea" rows="12" onChange={onBodyChange} required/>
                </FormGroup>
                <Button color="primary" className="">Submit</Button>
            </Form>
        </div>
    );
}

const mapStateToProps = state => ({user: state.auth.user});

export default connect(mapStateToProps, {successAlertAction, clearAlertAction,})(AddBlog);

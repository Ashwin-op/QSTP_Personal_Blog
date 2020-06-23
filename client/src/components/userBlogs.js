import React, {useEffect, useState} from "react";
import {Button, Modal, ModalFooter, ModalHeader, Spinner} from "reactstrap";
import Cookie from "js-cookie";
import {Link} from "react-router-dom";
import {ReactComponent as LikeIcon} from "./svgs/heart.svg";

const axios = require("axios");
const moment = require("moment");

function UserBlogs(props) {
    const [modal, setModal] = useState(false);
    const [blogID, setBlogId] = useState(0);
    const [blogs, setBlogs] = useState([]);
    const [fetched, setFetched] = useState(false);

    const toggle = () => setModal(!modal);

    const deleteBlog = () => {
        axios({
            method: "delete",
            url: `/api/blogs/delete/${blogID}`,
            headers: {
                Authorization: "Bearer " + Cookie.get("token"),
            },
        })
            .then(response => {
                const fetchUserBlogs = async () => {
                    await axios({
                        method: "get",
                        url: `/api/blogs/${props.match.params.id}`,
                        headers: {
                            Authorization: "Bearer " + Cookie.get("token"),
                        },
                    })
                        .then(response => {
                            setBlogs(response.data);
                            setFetched(true);
                        })
                        .catch(err => console.log(err.response));
                };

                fetchUserBlogs();
            })
            .catch(err => console.log("Error", err.response));
    };

    const setIDtoDelete = id => {
        setBlogId(id);
        setModal(!modal);
    };

    const confirmDelete = () => {
        setModal(!modal);
        deleteBlog();
    };

    useEffect(() => {
        if (!Cookie.get("user")) props.history.push("/");

        const fetchUserBlogs = async () => {
            await axios({
                method: "get",
                url: `/api/blogs/${props.match.params.id}`,
                headers: {
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
                .then(response => {
                    setBlogs(response.data);
                    setFetched(true);
                })
                .catch(err => console.log(err.response));
        };

        fetchUserBlogs();
    }, [props.history, props.match.params.id]);

    const showBlogs = () => {
        if (blogs.length === 0 && fetched)
            return <p className="text-center">You have currently no blogs</p>;

        if (blogs.length > 0) {
            return (
                <div>
                    {blogs.map(blog => (
                        <div className="card my-4" key={blog._id}>
                            <div className="card-body">
                                <Link to={`/blog/${blog._id}`}>
                                    <h5 className="card-title m-0">{blog.title}</h5>
                                </Link>
                            </div>
                            <div className="card-body">
                                {blog.body}
                                <br/>
                                <br/>
                                <br/>
                                <button type="button" className="btn btn-outline-danger"> Delete</button>
                            </div>
                            <div className="card-footer">
                                <small className="text-muted">
                                    {moment(blog.date).format("Do MMMM, YYYY")}
                                </small>
                                <span style={{float: "right", fontSize: "0.9rem"}}>
                                    <LikeIcon/> {blog.likes.length}
                                </span>
                            </div>
                        </div>
                        // <div className="container border border-dark m-2 p-2" key={blog._id}>
                        //     <h4 className="text-primary text-monospace font-weight-bold">
                        //         {blog.title}
                        //     </h4>
                        //     <p>{blog.body}</p>
                        //     <div className="container row justify-content-between">
                        //         <p className="badge badge-dark">
                        //             {moment(blog.date).format("Do MMMM, YYYY")}
                        //         </p>
                        //         <button type="button" className="btn btn-danger btn-sm"
                        //                 onClick={() => setIDtoDelete(blog._id)}>
                        //             Delete
                        //         </button>
                        //     </div>
                        // </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center spin my-5">
                <Spinner color="primary"/>
            </div>
        );
    };

    return (
        <div className="container">
            {showBlogs()}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Are You Sure?</ModalHeader>
                <ModalFooter>
                    <Button color="danger" onClick={confirmDelete}> Yes </Button>
                    <Button color="secondary" onClick={toggle}> Cancel </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default UserBlogs;

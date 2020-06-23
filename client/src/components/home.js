import React, {useEffect, useState} from "react";
import {Spinner} from "reactstrap";
import {ReactComponent as LikeIcon} from "./svgs/heart.svg";
import {Link} from "react-router-dom";

const axios = require("axios");
const moment = require("moment");

function Home() {
    const [blogs, setBlogs] = useState([]);
    const [fetched, setFetched] = useState(false);

    const fetchAllBlogs = async () => {
        await axios({
            method: "get",
            url: "/api/blogs",
        })
            .then(response => {
                console.log(response.data);
                setBlogs(response.data);
                setFetched(true);
            })
            .catch(err => {
                setFetched(true);
                console.log(err.response);
            });
    };

    useEffect(() => fetchAllBlogs(), []);

    const showBlogs = () => {
        if (blogs.length === 0 && fetched)
            return <p className="text-center my-5">Currently no blogs</p>;

        if (blogs.length > 0) {
            return (
                <div className="container my-5">
                    <div className="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1">
                        {blogs.map(blog => (
                            <div className="col p-0" key={blog._id}>
                                <div className="card m-2">
                                    <img src="https://picsum.photos/200" alt="Random" className="card-img-top"/>
                                    <div className="card-body">
                                        <Link to={`/blog/${blog._id}`}>
                                            <h5 className="card-title m-0">{blog.title}</h5>
                                        </Link>
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
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return (
            <div className="text-center spin my-5">
                <Spinner color="primary"/>
            </div>
        );
    };

    return <div>{showBlogs()}</div>;
}

export default Home;

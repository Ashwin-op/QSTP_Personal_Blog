import React, {useEffect, useState} from "react";
import Cookie from "js-cookie";
import {ReactComponent as LikeIcon} from "./svgs/liked.svg";
import {ReactComponent as DisLikeIcon} from "./svgs/not-liked.svg";
import {Button, ListGroup, ListGroupItem} from "reactstrap";

const moment = require("moment");
const axios = require("axios");

function Blog(props) {
    const [userBlog, setBlog] = useState({});
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [comment, setComment] = useState("");

    const commentChange = e => setComment(e.target.value);

    const submitComment = e => {
        e.preventDefault();
        axios({
            method: "post",
            url: `/api/blog/addComment/${userBlog._id}`,
            headers: {
                Authorization: "Bearer " + Cookie.get("token"),
            },
            data: {
                comment,
                user_name: JSON.parse(Cookie.get("user")).username,
            },
        })
            .then(response => setComments(response.data))
            .catch(err => console.log(err.response.data));
    };

    useEffect(() => {
        const fetchUserBlog = async () => {
            await axios({
                method: "get",
                url: `/api/blog/${props.match.params.blog_id}`,
                headers: {
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
                .then(response => {
                    setBlog(response.data);
                    setComments(response.data.comments);
                    setLikes(response.data.likes);
                })
                .catch(err => console.log(err.response));
        };

        fetchUserBlog();
    }, [props.match.params.blog_id]);

    const renderComments = () => {
        const renderedComments = comments.map(comment => (
            <ListGroupItem className="bg-light" key={comment._id}>
                {comment.comment}
                <p style={{fontSize: "0.8rem"}}>
                    <img src="https://img.icons8.com/material-outlined/14/000000/user-male-circle.png"
                         alt="user-img"/>
                    {" "}{comment.user} | {" "} {moment(comment.date).format(" Do MMMM, YYYY")}{" "}
                </p>
            </ListGroupItem>
        ));

        return renderedComments.length ? (
            <>
                <h5 className="my-3">Comments</h5>
                <ListGroup>{renderedComments}</ListGroup>
            </>
        ) : <p> No comments yet</p>;

    };

    const commentBox = () => {
        if (Cookie.get("user")) {
            return (
                <>
                    <form onSubmit={submitComment} className="my-3">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Enter a comment!"
                                   aria-describedby="comment" onChange={commentChange} value={comment} required/>
                            <div className="input-group-append">
                                <Button color="secondary" type="submit" id="comment"> Comment </Button>
                            </div>
                        </div>
                    </form>
                </>
            );
        }
    };

    const likeBlog = () => {
        if (Cookie.get("user")) {
            axios({
                method: "put",
                url: `/api/blog/like/${userBlog._id}`,
                headers: {
                    Authorization: "Bearer " + Cookie.get("token"),
                },
                data: {
                    user_id: JSON.parse(Cookie.get("user"))._id,
                },
            })
                .then(response => {
                    console.log(response.data);
                    setLikes(response.data);
                })
                .catch(err => console.log(err));
        }
    };

    const disLikeBlog = () => {
        if (Cookie.get("user")) {
            axios({
                method: "put",
                url: `/api/blog/disLike/${userBlog._id}`,
                headers: {
                    Authorization: "Bearer " + Cookie.get("token"),
                },
                data: {
                    user_id: JSON.parse(Cookie.get("user"))._id,
                },
            })
                .then(response => {
                    console.log(response.data);
                    setLikes(response.data);
                    renderLike();
                })
                .catch(err => console.log(err));
        }
    };

    const currentUserLiked = x => likes.find(like => like.user === x);

    const renderLike = () => {
        let likeIcon = null;

        likeIcon = Cookie.get("user") &&
        currentUserLiked(JSON.parse(Cookie.get("user"))._id) ? (
            <LikeIcon className="mr-2 pointer" onClick={disLikeBlog}/>
        ) : (
            <DisLikeIcon className="mr-2 pointer" onClick={likeBlog}/>
        );

        return (
            <div className="container my-4 row">
                {likeIcon}
                {likes.length}
            </div>
        );
    };

    return (
        <div className="container">
            <h3 className="text-center m-4">{userBlog.title}</h3>
            <p className="text-secondary" style={{fontSize: "0.9rem"}}>
                <img src="https://img.icons8.com/material-outlined/18/000000/user-male-circle.png"
                     alt="user-img"/>{" "}
                {userBlog.user ? <strong>{userBlog.user.username}</strong> : ""}{" "}
                | {moment(userBlog.date).format(" Do MMMM, YYYY")}{" "}
            </p>
            <hr/>
            <p style={{fontSize: "1.1rem"}} className="mb-5">{userBlog.body}</p>
            {Cookie.get("user") ? null : (<p className="lead mt-2"> Login to comment or like articles. </p>
            )}

            {renderLike()}
            {renderComments()}
            {commentBox()}
        </div>
    );
}

export default Blog;

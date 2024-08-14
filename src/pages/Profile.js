import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function Profile(){
    const { id } = useParams();
    const navigate = useNavigate()
    const {authState} = useContext(AuthContext)
    const [userName, setUserName]= useState("");
    const [userPost, setUserPost]=useState([])
    useEffect( () => {
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                }
            }) 
        .then((res)=>{
            setUserName(res.data.username)
        })
        .catch((res)=>{
            console.log(res)
        })
    }, [id])
    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byUserId/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
    })
    .then((res) => {
        console.log(res.data)
        setUserPost(res.data)
    })
    .catch((err) =>{
        console.log(err)
    })

},[id])
console.log("authState:"+ authState.username)
    console.log("username:" + userName)
    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1> Username: {userName} </h1>
                {authState.username === userName && (
                    <button onClick={()=> {
                        navigate("/changepassword")
                    }}>
                        Change Password
                        </button>
                )}
            </div>
            <div className="listOfPosts">
                {userPost.map((post, key) => {
                    return (
                        <div key={key} className="post">
                            <div className="title"> {post.title} </div>
                            <div
                                className="body"
                                onClick={() => {
                                    navigate(`/post/${post.id}`);
                                }}
                            >
                                {post.postText}
                            </div>
                            <div className="footer">
                                <div className="username">{post.username}</div>
                                <div className="buttons">
                                    <label> {post.Likes.length}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}
export default Profile;
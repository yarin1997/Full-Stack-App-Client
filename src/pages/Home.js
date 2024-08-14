import React, { useContext } from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from '../helpers/AuthContext';

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const { authState } = useContext(AuthContext)
    const [error, setError] = useState("")
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate("/login")
        }
        else
        {
        axios
            .get("http://localhost:3001/posts", {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                setListOfPosts(response.data.listOfPosts);
                setLikedPosts(
                    response.data.likedPosts.map((like) => {
                        return like.PostId;
                    })
                )
            })
            .catch((error) => {
                if (error.response) {
                    // Server responded with a status other than 200 range
                    console.log('Response error:', error.response.status);
                } else if (error.request) {
                    // Request was made but no response received
                    console.log('Request error:', error.request);
                } else {
                    // Something else happened
                    console.log('Error:', error.message);
                }
                setError(error.message)
            })
        }

    }, [])
    const likeAPost = (postId) => {
        axios
            .post(
                "http://localhost:3001/likes",
                { PostId: postId },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
            .then((response) => {
                setListOfPosts(
                    listOfPosts.map((post) => {
                        if (post.id === postId) {
                            if (response.data.liked) {
                                return { ...post, Likes: [...post.Likes, 0] };
                            } else {
                                const likesArray = post.Likes;
                                likesArray.pop();
                                return { ...post, Likes: likesArray };
                            }
                        } else {
                            return post;
                        }
                    })
                );

                if (likedPosts.includes(postId)) {
                    setLikedPosts(
                        likedPosts.filter((id) => {
                            return id !== postId;
                        })
                    );
                } else {
                    setLikedPosts([...likedPosts, postId]);
                }
            });
    };
    const profile = (id) => {
        navigate(`/Profile/${id}`)
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="App">
            {listOfPosts.map((value, key) => {
                return (
                    <div key={key} className="post">
                        <div className="title"> {value.title} </div>
                        <div className="body" onClick={() => { console.log(value)
                            navigate(`/Post/${value.id}`) }}>
                        {value.postText}
                        </div>
                        <div className="footer">
                            <h1 onClick={()=> profile(value.UserId)}>{value.username}</h1>
                            <ThumbUpAltIcon className={
                                likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                            } onClick={() => {
                                likeAPost(value.id)}} />
                                <label>{value.Likes.length}</label>
                            </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Home
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
function Post() {
    let {id} = useParams()
    console.log(id);
    const [postObject, setPostObject] = useState({})
    const [comments, setComments]=useState([])
    const [newComment, setNewComment] = useState("")
    const {authState} = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {

        axios.get(`http://localhost:3001/posts/byId/${id}`)
          .then((response) => {
             setPostObject(response.data)                
            })
      axios.get(`http://localhost:3001/comments/${id}`)
        .then((response) => {
          setComments(response.data)
        })
     
          },[])
          
    const addComment = () => {
      axios.post(`http://localhost:3001/comments`,
         { commentBody : newComment,
           PostId: id,
           },
        { headers: 
        { accessToken:  localStorage.getItem("accessToken"),

         }})
       .then((response) => {
        if( response.data.error){
          alert(response.data.error)
        }
        else { 
          const commentToAdd= {commentBody: newComment, username: response.data.username}
         setComments([...comments, commentToAdd])
          setNewComment("")
        }
        })
        .catch((error) => {
          console.log(error);
        });
      }
      const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`,
        { headers: 
        { accessToken:  localStorage.getItem("accessToken"),
         }})
       .then(() => {
        setComments(comments.filter((val)=> {
          return val.id!==id;
        }))

       })
      }
      const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`,{
          headers:{ 
            accessToken:  localStorage.getItem("accessToken"),
         }
        })
        .then(()=>{
          alert("Post deleted successfully");
          navigate('/');
        })
      }
      
      const editPost = (option) => {
        if(option==='title')
        {
          let newTitle = prompt("Enter new title:");
          if(newTitle)
          {
            axios.put(`http://localhost:3001/posts/title`,
            {
              newTitle: newTitle,
               id: id
              },
            {
              headers: {accessToken: localStorage.getItem("accessToken")},
            })
          setPostObject({...postObject, title: newTitle})
        }
        }
        else{
          let newText = prompt("Enter new text:")
          if(newText)
         {
           axios.put(`http://localhost:3001/posts/postText`,
            {
              newText: newText,
              id: id
            },
            {
              headers: { accessToken: localStorage.getItem("accessToken") },
            })
          setPostObject({ ...postObject, postText: newText })}
        }
      }
  return (
    <div className='postPage'>
      <div className='leftSide'>
        <div className='post' id='individual'>
        <div className='title' onClick={()=> {
            if (authState.username === postObject.username)
            { 
          editPost("title")
            }
          }}
          >
            {postObject.title}
            </div>
        <div className='body' onClick={() => {
            if (authState.username === postObject.username) {
              editPost("body")
            }
        }}
        >
          {postObject.postText}
          </div>
        <div className='footer'>
          By: {postObject.username}
           {authState.username === postObject.username
               && 
           <DeleteIcon onClick={()=>{
            deletePost(postObject.id);
           }} />}
          </div>
        </div>
      </div>
      <div className='rightSide'>
        <div className='addCommentContainer'>
          <input type='text'
           value={newComment}
           placeholder='Write a comment...'
           autoComplete='off'
           onChange={(event)=> setNewComment(event.target.value)}
           />
          <button onClick={addComment}>Add Comment</button>
          </div>
          <div className='listOfComments'>
           {comments.map((comment, index) => {
             return <div key={index} className='comment'>
              {comment.commentBody}
              <label>Comment: {comment.username}</label>
               {authState.username===comment.username && <button onClick={() => deleteComment(comment.id)
               }> X</button>}
              </div> 
           })}
    
        </div>
        </div>
    </div>
  )
}

export default Post
import React, {useContext, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import axios from 'axios';

const CreatePost = () => {

    const { authState } = useContext(AuthContext)
    const initialValues = {
        title: '',
        postText: '',
       
    }
useEffect(() => {

    if(!authState.status){
        navigate('/login')
    }
},[])
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'), 
        postText: Yup.string().required('Post is required'),

    })
    
    const navigate = useNavigate();
    const onSubmit =(data) =>{
        axios.post('http://localhost:3001/posts', data,
            {
                headers: {
                   accessToken: localStorage.getItem("accessToken")
                }
            }
        )
        .then((res) =>{
            console.log(res.data, "success")
            navigate('/')
        })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    
  return (
    <div className='createPostPage'>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
              <Form className='formContainer'>
                <label>Title: </label>
                <ErrorMessage name="title" component="span"/>
                  <Field
                  autocomplete="off"
                  id="inputCreatePost"
                  name="title"
                  placeholder="(Ex. Title...)"
                />
                  <label>Post: </label>
                  <ErrorMessage name="post" component="span" />

                  <Field
                      autocomplete="off"
                      id="inputCreatePost"
                      name="postText"
                      placeholder="(Ex. Post...)"
                  />
                
                  <button type='submit'>CreatePost</button>
              </Form>
         </Formik>
    </div>
  )
}

export default CreatePost
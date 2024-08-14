import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';

function Registration() {

    const navigate = useNavigate();
    const initialValues = {
        username: "",
        password: "",
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required('Username must be between 3 and 15 characters long'),
        password: Yup.string().min(4).max(20).required('Password must be between 4 and 20 characters long'),

    })
    const onSubmit = (data) => {
        axios.post('http://localhost:3001/auth', data)
        .then(response => {
            console.log(response+'Success');
            navigate('/login');
        })  
        .catch(error => {
            console.log(error+'Error');
        })
    }
  return (
    <div>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
              <Form className='formContainer'>
                  <label>UserName: </label>
                  <ErrorMessage name="username" component="span" />

                  <Field
                      autoComplete="off"
                      id=""
                      name="username"
                      placeholder="(Ex. Jhon...)"
                  />

                  <label>Password</label>

                  <ErrorMessage name="password" component="span" />
                  <Field
                      autoComplete="off"
                      type="password"
                      id="inputCreatePost"
                      name="password"
                      placeholder="Your password"
                  />
                  <button type='submit'>Register</button>
              </Form>
          </Formik>
    </div>
  )
}

export default Registration
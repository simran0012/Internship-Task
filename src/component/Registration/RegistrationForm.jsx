import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Define validation schema using Yup
const registrationSchema = Yup.object().shape({
  name: Yup.string().min(5).max(25).required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  c_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),

});

export default function Registration() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post("http://localhost:3000/api/users/registration", values);

      if (response.data.status === "success") {
        navigate("/profile");
        // Optionally reset the form
        resetForm();
      } else if (response.data.status === "failed") {
        alert(response.data.message);
      }
    } catch (error) {
      // Handle the error correctly
      console.error("There was an error!", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          c_password: '',
          tc: ''
        }}
        validationSchema={registrationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
            
          <Form>
            <div>
              <label htmlFor="name">Name:</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>
            <div>
              <label htmlFor="c_password">Confirm Password:</label>
              <Field type="password" name="c_password" />
              <ErrorMessage name="c_password" component="div" className="error-message" />
            </div>
            <div>
              <label htmlFor="tc">Terms and Conditions:</label>
              <Field type="text" name="tc" />
              <ErrorMessage name="tc" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting}>Sign Up</button>
            <button type="reset">Reset</button>
          </Form>
          
        )}
      </Formik>
   </div>
 
  );
}

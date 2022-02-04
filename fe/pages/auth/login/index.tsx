import React, { useEffect } from "react"
import Auth from '../../../layouts/Auth'
import Head from 'next/head'
import Link from 'next/link'
import Swal from "sweetalert2"
import axios from "../../../configs/axios"
import { setCookies } from 'cookies-next'
// import jwt from 'jsonwebtoken'
import { useRouter } from 'next/router'


class Login extends React.Component {
    state = {
        email: '',
        password: '',

        error_email: '',
        error_password: ''
    }

    handleClear = () => {
        this.setState({
            email: '',
            password: ''
        })
    }

    handleReset = () => {
        this.setState({
            error_email: '',
            error_password: ''
        })
    }

    handleChange = (e: { target: { name: any; value: any } }) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLogin = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        axios.post(`/auth/login`, this.state)
            .then(res => {
                if (res.data.status === 'success') {
                    // this.props.signIn(res.data)
                    // let user = jwt.decode(res.data.token)
                    
                    this.handleClear()
                    this.handleReset()

                    setCookies('token', res.data.token)
                    window.location.href = '/dashboard'
                }
            })
            .catch(error => {
                if (error && error.response && error.response.data) {
                    let errors = error.response.data.errors

                    if (errors && errors.length) {
                        this.handleReset()
                        errors.forEach((err: { param: string; msg: any }) => {
                            if (err.param === 'email') {
                                this.setState({
                                    error_email: err.msg
                                })
                            }
                            if (err.param === 'password') {
                                this.setState({
                                    error_password: err.msg
                                })
                            }
                        })
                    }
                    
                    if (error.response.data.error) {
                        Swal.fire(
                            'Failed',
                            `${error.response.data.error}`,
                            'error'
                        )
                        this.handleClear()
                        this.handleReset()
                    }
                }
            })
    }

    render() {
        return(
            <Auth>
                <Head>
                    <title>MERN | Login</title>
                </Head>
                <div className="login-box">
                    <div className="card card-outline card-primary">
                        <div className="card-header text-center">
                            <a href="#" className="h1"><b>Admin</b>LTE</a>
                        </div>
                        <div className="card-body">
                            <p className="login-box-msg">Sign in to start your session</p>
                                <div className="input-group mb-3">
                                    <input onChange={this.handleChange} value={this.state.email} type="email" id="email" name="email" className={`form-control ${this.state.error_email ? "is-invalid":""}`} placeholder="Email"/>
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope"></span>
                                        </div>
                                    </div>
                                    <span className="invalid-feedback" role="alert">
                                        <strong>{ this.state.error_email }</strong>
                                    </span>
                                </div>
                                <div className="input-group mb-3">
                                    <input onChange={this.handleChange} value={this.state.password} type="password" id="password" name="password" className={`form-control ${this.state.error_password ? "is-invalid":""}`} placeholder="Password"/>
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock"></span>
                                        </div>
                                    </div>
                                    <span className="invalid-feedback" role="alert">
                                        <strong>{ this.state.error_password }</strong>
                                    </span>
                                </div>
                                <div className="row">
                                    <div className="col-8">
                                        <div className="icheck-primary">
                                            <input type="checkbox" id="remember"/>
                                            <label htmlFor="remember">
                                                Remember Me
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <button onClick={this.handleLogin} type="submit" className="btn btn-primary btn-block">Sign In</button>
                                    </div>
                                </div>

                            <div className="social-auth-links text-center mt-2 mb-3">
                                <a href="#" className="btn btn-block btn-primary">
                                    <i className="fab fa-facebook mr-2"></i> Sign in using Facebook
                                </a>
                                <a href="#" className="btn btn-block btn-danger">
                                    <i className="fab fa-google-plus mr-2"></i> Sign in using Google+
                                </a>
                            </div>

                            <p className="mb-1">
                                <Link href="/auth/forgot">
                                    <a>I forgot my password</a>
                                </Link>
                            </p>
                            <p className="mb-0">
                                <Link href="/auth/register">
                                    <a className="text-center">
                                        Register a new membership
                                    </a>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Auth>
        )
    }
}

export default Login
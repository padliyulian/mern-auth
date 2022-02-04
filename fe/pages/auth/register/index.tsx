import React from "react"
import Auth from '../../../layouts/Auth'
import Head from 'next/head'
import Link from 'next/link'
import Swal from "sweetalert2"
import axios from "../../../configs/axios"
import { withRouter, NextRouter } from 'next/router'


interface WithRouterProps {
    router: NextRouter
}

interface RegisterProps extends WithRouterProps {
}

class Register extends React.Component<RegisterProps> {
    state = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',

        error_name: '',
        error_email: '',
        error_password: '',
        error_password2: ''
    }

    handleClear = () => {
        this.setState({
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
        })
    }

    handleReset = () => {
        this.setState({
            error_name: '',
            error_email: '',
            error_password: '',
            error_password2: ''
        })
    }

    handleChange = (e: { target: { name: any; value: any } }) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleRegister = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        
        axios.post(`/auth/register`, this.state)
            .then(res => {
                if (res.data.status === 'success') {
                    this.handleClear()
                    this.handleReset()

                    Swal.fire(
                        'Success',
                        `Register success`,
                        'success'
                    )

                    this.props.router.push('/auth/login')
                }
            })
            .catch(error => {
                if (error && error.response && error.response.data) {
                    let errors = error.response.data.errors
                    
                    if (errors && errors.length) {
                        this.handleReset()
                        errors.forEach((err: { param: string; msg: any }) => {
                            if (err.param === 'name') {
                                this.setState({
                                    error_name: err.msg
                                })
                            }
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
                            if (err.param === 'password_confirmation') {
                                this.setState({
                                    error_password2: err.msg
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
                    <title>MERN | Register</title>
                </Head>
                <div className="register-box">
                    <div className="card card-outline card-primary">
                        <div className="card-header text-center">
                            <a href="#" className="h1"><b>Admin</b>LTE</a>
                        </div>
                        <div className="card-body">
                            <p className="login-box-msg">Register a new membership</p>
                
                            <form action="/auth/register" method="post">
                                <div className="input-group mb-3">
                                    <input onChange={this.handleChange} value={this.state.name} type="text" name="name" className={`form-control ${this.state.error_name ? "is-invalid":""}`} placeholder="Full name"/>
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user"></span>
                                        </div>
                                    </div>
                                    <span className="invalid-feedback" role="alert">
                                        <strong>{ this.state.error_name }</strong>
                                    </span>
                                </div>
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
                                    <input onChange={this.handleChange} value={this.state.password} type="password" name="password" className={`form-control ${this.state.error_password ? "is-invalid":""}`} placeholder="Password"/>
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock"></span>
                                        </div>
                                    </div>
                                    <span className="invalid-feedback" role="alert">
                                        <strong>{ this.state.error_password }</strong>
                                    </span>
                                </div>
                                <div className="input-group mb-3">
                                    <input onChange={this.handleChange} value={this.state.password_confirmation} type="password" name="password_confirmation" className={`form-control ${this.state.error_password2 ? "is-invalid":""}`} placeholder="Retype password"/>
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock"></span>
                                        </div>
                                    </div>
                                    <span className="invalid-feedback" role="alert">
                                        <strong>{ this.state.error_password2 }</strong>
                                    </span>
                                </div>
                                <div className="row">
                                    <div className="col-8">
                                        <div className="icheck-primary">
                                            <input type="checkbox" id="agreeTerms" name="terms" value="agree"/>
                                            <label htmlFor="agreeTerms">
                                                I agree to the <a href="#">terms</a>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <button onClick={this.handleRegister} type="submit" className="btn btn-primary btn-block">Register</button>
                                    </div>
                                </div>
                            </form>
                
                            <div className="social-auth-links text-center">
                                <a href="#" className="btn btn-block btn-primary">
                                    <i className="fab fa-facebook mr-2"></i>
                                    Sign up using Facebook
                                </a>
                                <a href="#" className="btn btn-block btn-danger">
                                    <i className="fab fa-google-plus mr-2"></i>
                                    Sign up using Google+
                                </a>
                            </div>
                
                            <Link href="/auth/login">
                                <a className="text-center">I already have a membership</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </Auth>
        )
    }
}

export default withRouter(Register)
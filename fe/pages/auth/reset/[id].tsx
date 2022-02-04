import React from "react"
import Head from 'next/head'
import Swal from "sweetalert2"
import axios from "../../../configs/axios"
import { withRouter, NextRouter } from 'next/router'
import Auth from '../../../layouts/Auth'
import Link from 'next/link'


interface WithRouterProps {
    router: NextRouter
}

interface ResetProps extends WithRouterProps {
}

class Reset extends React.Component<ResetProps> {
    state = {
        email: '',
        token: '',
        password: '',
        password_confirmation: '',

        error_password: '',
        error_password2: ''
    }

    componentDidMount() {
        setTimeout(() => this.handleLoad(), 1000)
    }

    handleLoad = () => {
        axios.get(`/auth/reset/${this.props.router.query.id}`)
            .then(res => {
                if (res.data.status === 'success') {
                    Swal.fire(
                        'Success',
                        `${res.data.msg}`,
                        'success'
                    )

                    this.setState({
                        email: res.data.email,
                        token: this.props.router.query.id
                    })
                }
            })
            .catch(error => {
                if (error.response.data.error) {
                    Swal.fire(
                        'Failed',
                        `${error.response.data.error}`,
                        'error'
                    )
                    this.props.router.push('/auth/login')
                }
            })
    }

    handleClear = () => {
        this.setState({
            email: '',
            token: '',
            password: '',
            password_confirmation: '',
        })
    }

    handleReset = () => {
        this.setState({
            error_password: '',
            error_password2: ''
        })
    }

    handleChange = (e: { target: { name: any; value: any } }) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        axios.post(`/auth/reset`, this.state)
            .then(res => {
                if (res.data.status === 'success') {
                    this.handleClear()
                    this.handleReset()
                    Swal.fire(
                        'Success',
                        `${res.data.msg}`,
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
                    <title>MERN | Reset</title>
                </Head>
                <div className="login-box">
                    <div className="card card-outline card-primary">
                        <div className="card-header text-center">
                            <a href=".#" className="h1"><b>Admin</b>LTE</a>
                        </div>
                        <div className="card-body">
                            <p className="login-box-msg">You are only one step a way from your new password, recover your password now.</p>
                            <form action="#" method="post">
                                <div className="input-group mb-3">
                                    <input defaultValue={this.state.email} type="email" name="email" className="form-control" placeholder="Email" readOnly/>
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope"></span>
                                        </div>
                                    </div>
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
                                    <input onChange={this.handleChange} value={this.state.password_confirmation} type="password" name="password_confirmation" className={`form-control ${this.state.error_password2 ? "is-invalid":""}`} placeholder="Confirm Password"/>
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
                                    <div className="col-12">
                                        <button onClick={this.handleSubmit} type="submit" className="btn btn-primary btn-block">Change password</button>
                                    </div>
                                </div>
                            </form>

                            <p className="mt-3 mb-1">
                                <Link href="/auth/login">
                                    <a>Login</a>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Auth>
        )
    }
}

export default withRouter(Reset)
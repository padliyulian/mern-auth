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

interface ForgotProps extends WithRouterProps {
}

class Forgot extends React.Component<ForgotProps> {
    state = {
        email: '',
        error_email: ''
    }

    handleClear = () => {
        this.setState({
            email: '',
            error_email: ''
        })
    }

    handleChange = (e: { target: { name: any; value: any } }) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        axios.post(`/auth/forgot`, this.state)
            .then(res => {
                if (res.data.status === 'success') {
                    this.handleClear()
                    Swal.fire(
                        'Success',
                        `${res.data.msg}`,
                        'success'
                    )
                    // this.props.router.push('/auth/login')
                }
            })
            .catch(error => {
                if (error && error.response && error.response.data) {
                    let errors = error.response.data.errors
                    
                    if (errors && errors.length) {
                        this.handleClear()
                        errors.forEach((err: { param: string; msg: any }) => {
                            if (err.param === 'email') {
                                this.setState({
                                    error_email: err.msg
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
                    }
                }
            })
    }

    render() {
        return(
            <Auth>
                <Head>
                    <title>MERN | Forgot</title>
                </Head>
                <div className="login-box">
                    <div className="card card-outline card-primary">
                        <div className="card-header text-center">
                            <a href="#" className="h1"><b>Admin</b>LTE</a>
                        </div>
                        <div className="card-body">
                            <p className="login-box-msg">
                                You forgot your password? Here you can easily retrieve a new password.
                            </p>
                            <form action="/auth/forgot" method="post">
                                <div className="input-group mb-3">
                                    <input onChange={this.handleChange} value={this.state.email} type="email" name="email" className={`form-control ${this.state.error_email ? "is-invalid":""}`} placeholder="Email"/>
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope"></span>
                                        </div>
                                    </div>
                                    <span className="invalid-feedback" role="alert">
                                        <strong>{ this.state.error_email }</strong>
                                    </span>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <button onClick={this.handleSubmit} type="submit" className="btn btn-primary btn-block">
                                            Request new password
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <p className="mt-3 mb-1">
                                <Link href="/auth/login"><a>Login</a></Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Auth>
        )
    }
}

export default withRouter(Forgot)
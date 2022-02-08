import Dashboard from '../../../layouts/Dashboard'
import React from "react"
import Head from 'next/head'
import Link from 'next/link'
import Swal from "sweetalert2"
import axios from "../../../configs/axios"
import { withRouter, NextRouter } from 'next/router'


interface WithRouterProps {
    router: NextRouter
}

interface CreateUserProps extends WithRouterProps {
}

class CreateUser extends React.Component<CreateUserProps> {
    state = {
        roles: [],

        name: '',
        email: '',
        phone: '',
        address: 'address ...',
        photo: '',
        password: '',
        password_confirmation: '',
        role: '',
        status: '',

        error_name: '',
        error_email: '',
        error_phone: '',
        error_address: '',
        error_photo: '',
        error_password: '',
        error_password2: '',
        error_role: '',
        error_status: '',
    }

    componentDidMount(){
        axios.get(`/auth/roles`)
            .then(res => {
                this.setState({
                    roles: res.data.roles
                })
            })
    }

    handleClear = () => {
        this.setState({
            name: '',
            email: '',
            phone: '',
            address: 'address ...',
            photo: '',
            password: '',
            password_confirmation: '',
            role: '',
            status: ''
        })
    }

    handleReset = () => {
        this.setState({
            error_name: '',
            error_email: '',
            error_phone: '',
            error_address: '',
            error_photo: '',
            error_password: '',
            error_password2: '',
            error_role: '',
            error_status: ''
        })
    }

    handleChange = (e: { target: { name: any; value: any } }) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleImage = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            this.setState({
                photo: e.target.files[0],
            })
        }
    }

    handleSave = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', this.state.name)
        formData.append('email', this.state.email)
        formData.append('phone', this.state.phone)
        formData.append('address', this.state.address)
        formData.append('photo', this.state.photo)
        formData.append('password', this.state.password)
        formData.append('password_confirmation', this.state.password_confirmation)
        formData.append('role', this.state.role)
        formData.append('status', this.state.status)

        axios.post(`/auth/users`, formData)
            .then(res => {
                if (res.data.status === 'success') {
                    this.handleClear()
                    this.handleReset()

                    Swal.fire(
                        'Success',
                        `${res.data.msg}`,
                        'success'
                    )

                    this.props.router.push('/dashboard/users')
                }
            })
            .catch(error => {
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
                        if (err.param === 'phone') {
                            this.setState({
                                error_phone: err.msg
                            })
                        }
                        if (err.param === 'address') {
                            this.setState({
                                error_address: err.msg
                            })
                        }
                        if (err.param === 'photo') {
                            this.setState({
                                error_photo: err.msg
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
                        if (err.param === 'role') {
                            this.setState({
                                error_role: err.msg
                            })
                        }
                        if (err.param === 'status') {
                            this.setState({
                                error_status: err.msg
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
            })
    }

    render() {
        return(
            <Dashboard>
                <Head>
                    <title>MERN | Role</title>
                </Head>
                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Users</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item">
                                            <Link href="/dashboard/users">
                                                <a>Users</a>
                                            </Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Create
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <button type="button" className="btn btn-tool" data-card-widget="remove" data-toggle="tooltip" title="Remove">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">             
                                        <form action="/auth/users" method="POST" encType="multipart/form-data">
                                            <div className="row">
                                                <div className="form-group col-lg-12">
                                                    <input onChange={this.handleChange} value={this.state.name} type="text" name="name" className={`form-control ${this.state.error_name ? "is-invalid":""}`} placeholder="Name"/>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_name }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <input onChange={this.handleChange} value={this.state.email} type="email" name="email" className={`form-control ${this.state.error_email ? "is-invalid":""}`} placeholder="Email"/>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_email }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <input onChange={this.handleChange} value={this.state.phone} type="text" name="phone" className={`form-control ${this.state.error_phone ? "is-invalid":""}`} placeholder="Phone"/>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_phone }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <textarea onChange={this.handleChange} value={this.state.address} name="address" className={`form-control ${this.state.error_address ? "is-invalid":""}`} cols={30} rows={10}></textarea>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_address }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <div className="custom-file">
                                                        <input onChange={this.handleImage} name="photo" type="file" className={`custom-file-input ${this.state.error_photo ? "is-invalid":""}`} id="photo"/>
                                                        <label className="custom-file-label" htmlFor="photo">Choose photo...</label>

                                                        <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_photo }</strong>
                                                    </span>
                                                    </div>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <input onChange={this.handleChange} value={this.state.password} type="password" name="password" className={`form-control ${this.state.error_password ? "is-invalid":""}`} placeholder="Password"/>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_password }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <input onChange={this.handleChange} value={this.state.password_confirmation} type="password" name="password_confirmation" className={`form-control ${this.state.error_password2 ? "is-invalid":""}`} placeholder="Retype Password"/>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_password2 }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <select onChange={this.handleChange} value={this.state.role} name="role" className={`form-control ${this.state.error_role ? "is-invalid":""}`}>
                                                        <option value="" disabled>Role</option>
                                                        {
                                                            this.state.roles.map((role: any) => {
                                                                return <option key={role._id} value={role._id}>
                                                                    { role.name }
                                                                </option>
                                                            })
                                                        }
                                                    </select>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_role }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <select onChange={this.handleChange} value={this.state.status} name="status" className={`form-control ${this.state.error_status ? "is-invalid":""}`}>
                                                        <option value="" disabled>Status</option>
                                                        <option value="1">Created</option>
                                                        <option value="2">Active</option>
                                                    </select>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_status }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <button onClick={this.handleSave} type="submit" className="btn btn-primary">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Dashboard>
        )
    }
}

export default withRouter(CreateUser)
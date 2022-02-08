import Dashboard from '../../../../layouts/Dashboard'
import React from "react"
import Head from 'next/head'
import Link from 'next/link'
import Swal from "sweetalert2"
import axios from "../../../../configs/axios"
import { withRouter, NextRouter } from 'next/router'


interface WithRouterProps {
    router: NextRouter
}

interface EditRoleProps extends WithRouterProps {
}

class EditRole extends React.Component<EditRoleProps> {
    state = {
        name: '',
        guardName: '',

        error_name: '',
        error_guardName: ''
    }

    componentDidMount() {
        this.handleLoad()
    }

    handleLoad = () => {
        axios.get(`/auth/roles/${this.props.router.query.id}`)
            .then(res => {
                if (res.data.status === 'success') {
                    this.setState({
                        name: res.data.role.name,
                        guardName: res.data.role.guardName
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
                    this.props.router.push('/dashboard/roles')
                }
            })
    }

    handleClear = () => {
        this.setState({
            name: '',
            guardName: ''
        })
    }

    handleReset = () => {
        this.setState({
            error_name: '',
            error_guardName: ''
        })
    }

    handleChange = (e: { target: { name: any; value: any } }) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleUpdate = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        axios.patch(`/auth/roles/${this.props.router.query.id}`, this.state)
            .then(res => {
                if (res.data.status === 'success') {
                    this.handleClear()
                    this.handleReset()

                    Swal.fire(
                        'Success',
                        `${res.data.msg}`,
                        'success'
                    )

                    this.props.router.push('/dashboard/roles')
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
                        if (err.param === 'guardName') {
                            this.setState({
                                error_guardName: err.msg
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
                                    <h1>Roles</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item">
                                            <Link href="/dashboard/roles">
                                                <a>Roles</a>
                                            </Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Edit
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
                                        <form action="/auth/roles" method="POST">
                                            <div className="row">
                                                <div className="form-group col-lg-12">
                                                    <input onChange={this.handleChange} value={this.state.name} type="text" name="name" className={`form-control ${this.state.error_name ? "is-invalid":""}`} placeholder="Name"/>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_name }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <select onChange={this.handleChange} value={this.state.guardName} name="guardName" className={`form-control ${this.state.error_guardName ? "is-invalid":""}`}>
                                                        <option value="" disabled>Guard Name</option>
                                                        <option value="web">WEB</option>
                                                        <option value="api">API</option>
                                                    </select>

                                                    <span className="invalid-feedback" role="alert">
                                                        <strong>{ this.state.error_guardName }</strong>
                                                    </span>
                                                </div>
                                                <div className="form-group col-lg-12">
                                                    <button onClick={this.handleUpdate} type="submit" className="btn btn-primary">Update</button>
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

export default withRouter(EditRole)
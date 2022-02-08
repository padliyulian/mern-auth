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

interface RolePermissionProps extends WithRouterProps {
}

class RolePermission extends React.Component<RolePermissionProps> {
    state: any = {
        role: {
            name: '',
            permissions: []
        },
        permissions: []
    }

    componentDidMount() {
        setTimeout(() => this.handleLoad(), 1000)
    }

    handleChange = (e: { target: { checked: boolean; value: any } }) => {
        if (e.target.checked === true) {
            this.setState((prevState: any) => ({
                role: {
                    ...prevState.role, 
                    permissions: [...prevState.role.permissions, e.target.value]
                }
            }))
        }

        if (e.target.checked === false) {
            this.setState((prevState: any) => ({
                role: {
                    ...prevState.role, 
                    permissions: prevState.role.permissions.filter((item: any) => item !== e.target.value)
                }
            }))
        }  
    }

    handleUpdate = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        axios.patch(`/auth/roles/permissions/${this.props.router.query.id}`, {
            permissions: this.state.role.permissions
        })
            .then(res => {
                if (res.data.status === 'success') {
                    Swal.fire(
                        'Success',
                        `${res.data.msg}`,
                        'success'
                    )
                    this.props.router.push('/dashboard/roles')
                }
            })
            .catch(error => {
                if (error.response.data.error) {
                    Swal.fire(
                        'Failed',
                        `${error.response.data.error}`,
                        'error'
                    )
                }
            })
    }

    handleLoad = () => {
        axios.get(`/auth/roles/permissions/${this.props.router.query.id}`)
            .then(res => {
                if (res.data.status === 'success') {
                    this.setState({
                        role: res.data.role,
                        permissions: res.data.permissions
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
                                            Permission
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    { this.state.role.name } Role
                                </div>
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
                                <form action="/auth/roles/permissions/<%= role._id %>?_method=patch" method="post">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Menu</th>
                                                <th>View</th>
                                                <th>Add</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Users</td>
                                                {
                                                    this.state.permissions.map((item: any) => {
                                                        return (
                                                            item.name === 'view users' &&
                                                            <td key={item._id}>
                                                                <div className="form-check">
                                                                    <input onChange={this.handleChange} className="form-check-input" type="checkbox" name="permissions[]" value={item._id} defaultChecked={this.state.role.permissions && this.state.role.permissions.includes(item._id)}/>
                                                                </div>
                                                            </td>
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.permissions.map((item: any) => {
                                                        return (
                                                            item.name === 'add users' &&
                                                            <td key={item._id}>
                                                                <div className="form-check">
                                                                    <input onChange={this.handleChange} className="form-check-input" type="checkbox" name="permissions[]" value={item._id} defaultChecked={this.state.role.permissions && this.state.role.permissions.includes(item._id)}/>
                                                                </div>
                                                            </td>
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.permissions.map((item: any) => {
                                                        return (
                                                            item.name === 'edit users' &&
                                                            <td key={item._id}>
                                                                <div className="form-check">
                                                                    <input onChange={this.handleChange} className="form-check-input" type="checkbox" name="permissions[]" value={item._id} defaultChecked={this.state.role.permissions && this.state.role.permissions.includes(item._id)}/>
                                                                </div>
                                                            </td>
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.permissions.map((item: any) => {
                                                        return (
                                                            item.name === 'delete users' &&
                                                            <td key={item._id}>
                                                                <div className="form-check">
                                                                    <input onChange={this.handleChange} className="form-check-input" type="checkbox" name="permissions[]" value={item._id} defaultChecked={this.state.role.permissions && this.state.role.permissions.includes(item._id)}/>
                                                                </div>
                                                            </td>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button onClick={this.handleUpdate} type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </div>
                            <div className="card-footer">
                            </div>
                        </div>

                    </section>
                </div>
            </Dashboard>
        )
    }
}

export default withRouter(RolePermission)
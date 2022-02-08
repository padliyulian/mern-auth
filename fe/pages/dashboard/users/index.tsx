import Dashboard from '../../../layouts/Dashboard'
import React from "react"
import Head from 'next/head'
import Link from 'next/link'
import Swal from "sweetalert2"
import axios from "../../../configs/axios"
import moment from "moment"


class User extends React.Component {
    state = {
        isLoading: true,
        data : {
            users : [],
            totalItems : 0,
            totalPages : 0,
            currentPage : 1
        },

        limit : 10,
        sort_by: 'createdAt',
        sort_dir: '-1',
        search_by : '',
        keyword : ''
    }

    componentDidMount() {
        this.loadData()
    }

    handlePrevPage = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        this.setState({
            data: {
                currentPage: this.state.data.currentPage - 1
            }
        }, () => {
            this.loadData()
        })
    }

    handleNumberPage = (e: any, val: any) => {
        e.preventDefault()

        this.setState({
            data: {
                currentPage: val
            }
        }, () => {
            this.loadData()
        })
    }

    handleNextPage = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        this.setState({
            data: {
                currentPage: this.state.data.currentPage + 1
            }
        }, () => {
            this.loadData()
        })
    }

    handleChangeLimit = (e: { target: { value: any } }) => {
        this.setState({
            limit: e.target.value
        }, () => {
            this.loadData()
        })
    }

    handleSearch = (e: { target: { value: any } }) => {
        this.setState({
            search_by : 'name',
            keyword: e.target.value
        }, () => {
            this.loadData()
        })
    }

    handleSort = (val: string) => {
        this.setState({
            sort_by: val,
            sort_dir: this.state.sort_dir === '-1' ? '1':'-1',
        }, () => {
            this.loadData()
        })
    }

    handleDelete = (e: any, id: any) => {
        e.preventDefault()
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/auth/users/${id}`)
                    .then(res => {
                        if (res.data.status === 'success') {
                            Swal.fire(
                                'Success',
                                `${res.data.msg}`,
                                'success'
                            )

                            this.handleResetPage('delete')
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
    }

    handleResetPage = (e: any) => {
        if (e && e !== 'delete') e.preventDefault()
        this.setState({
            data : {
                users : [],
                totalItems : 0,
                totalPages : 0,
                currentPage : 1,
                query : {}
            },

            limit: 10,
            sort_by: 'createdAt',
            sort_dir: '-1',
            search_by : '',
            keyword : ''
        }, () => {
            this.loadData()
        })
    }

    loadData = () => {
        let url = `/auth/users?page=${this.state.data.currentPage}&limit=${this.state.limit}&sortBy=${this.state.sort_by}:${this.state.sort_dir}&searchBy=${this.state.search_by}&searchKey=${this.state.keyword}`
        axios.get(url)
            .then(res => {
                this.setState({
                    data: res.data
                })
            })
            .catch()
    }

    render() {
        return(
            <Dashboard>
                <Head>
                    <title>MERN | User</title>
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
                                        <li className="breadcrumb-item active">Users</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content">
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
                                <div className="row">
                                    <div className="form-group col-lg-2">
                                        <Link href="/dashboard/users/create">
                                            <a className="btn btn-primary btn-block">
                                                Tambah
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="form-group col-lg-2">
                                        <a onClick={this.handleResetPage} href="!#" className="btn btn-success btn-block">Reset</a>
                                    </div>
                                    <div className="form-group col-lg-2">
                                        <select onChange={this.handleChangeLimit} value={this.state.limit} name="limit" id="limit" className="custom-select">
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-lg-6">
                                        <input onChange={this.handleSearch} value={this.state.keyword} type="text" name="searchKey" id="searchKey" className="form-control" placeholder="Cari data by name ..."/>
                                    </div>
                                </div>
                                <div>
                                    <table className="table table-striped table-responsive-sm">
                                        <thead>
                                            <tr>
                                                <th className="c--pointer" onClick={ () => this.handleSort('name')}>
                                                    <i className="fas fa-sort"></i>
                                                    Name
                                                </th>
                                                <th>Email</th>
                                                <th>Photo</th>
                                                <th>Role</th>
                                                <th className="c--pointer" onClick={ () => this.handleSort('status')}>
                                                    <i className="fas fa-sort"></i>
                                                    Status
                                                </th>
                                                <th className="c--pointer" onClick={ () => this.handleSort('createdAt')}>
                                                    <i className="fas fa-sort"></i>
                                                    Created
                                                </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.data.users && this.state.data.users.length > 0 ?
                                                    this.state.data.users.map((item: any) => {
                                                        return(
                                                            <tr key={item._id}>
                                                                <td>{ item.name }</td>
                                                                <td>{ item.email }</td>
                                                                <td>
                                                                    {
                                                                        item.photo ?
                                                                        <img src={`${process.env.REACT_APP_ASSETS_URL}/images/${item.photo}`} alt="avatar" className="img-circle elevation-2" width="40" />
                                                                        :
                                                                        <img src={`${process.env.REACT_APP_ASSETS_URL}/images/default.png`} alt="avatar" className="img-circle elevation-2" width="40" />
                                                                    }
                                                                </td>
                                                                <td>{ item.role ? item.role.name : '-' }</td>
                                                                <td>
                                                                    { 
                                                                        item.status === 1 ?
                                                                        <span className="badge px-2 py-1 badge-pill badge-warning">
                                                                            Created
                                                                        </span>
                                                                        :
                                                                        <span className="badge px-2 py-1 badge-pill badge-success">
                                                                            Active
                                                                        </span>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    { moment(item.createdAt).format('DD/MM/Y') }
                                                                </td>
                                                                <td>
                                                                    <Link href={`/dashboard/users/edit/${item._id}`} >
                                                                        <a title="Edit">
                                                                            <span className="text-warning">
                                                                                <i className="fa fa-edit" aria-hidden="true"></i>
                                                                            </span>
                                                                        </a>
                                                                    </Link>
                                                                    <a href="#" title="Delete" onClick={(e) => this.handleDelete(e, item._id)}>
                                                                        <span className="text-danger">
                                                                            <i className="fa fa-trash" aria-hidden="true"></i>
                                                                        </span>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                :
                                                    <tr>
                                                        <td colSpan={7} className="text-center">Belum ada data ...</td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>

                                    {
                                        this.state.data.totalPages > 1 &&
                                        <div className="row mt-2">
                                            <div className="col-12 col-md-2 pt-2">
                                                Show { ((this.state.data.currentPage - 1) * this.state.limit) + this.state.data.users.length } Of { this.state.data.totalItems }
                                            </div>
                                            <div className="col-12 col-md-10">
                                                <nav aria-label="Page navigation example">
                                                    <ul className="pagination">
                                                        {
                                                            this.state.data.currentPage !== 1 &&
                                                            <li className="page-item">
                                                                <a onClick={(e) => this.handleNumberPage(e, 1)} className="page-link" href="#">
                                                                    First
                                                                </a>
                                                            </li>
                                                        }
                                                        {
                                                            this.state.data.currentPage === 1 ?
                                                            <li className="page-item disabled">
                                                                <a className="page-link" href="#" aria-label="Previous">
                                                                    <span aria-hidden="true">&laquo;</span>
                                                                </a>
                                                            </li>
                                                            :
                                                            <li className="page-item">
                                                                <a onClick={this.handlePrevPage} className="page-link" href="#" aria-label="Previous">
                                                                    <span aria-hidden="true">&laquo;</span>
                                                                </a>
                                                            </li>
                                                        }

                                                        {
                                                            this.state.data.currentPage !== 1 &&
                                                            <li className="page-item">
                                                                <a onClick={(e) => this.handleNumberPage(e, (this.state.data.currentPage - 1))} className="page-link" href="#">
                                                                    { this.state.data.currentPage - 1 }
                                                                </a>
                                                            </li>
                                                        }
                                                        <li className="page-item active">
                                                            <a className="page-link" href="#">
                                                                { this.state.data.currentPage }
                                                            </a>
                                                        </li>
                                                        {
                                                            this.state.data.currentPage !== this.state.data.totalPages &&
                                                            <li className="page-item">
                                                                <a onClick={(e) => this.handleNumberPage(e, (this.state.data.currentPage + 1))} className="page-link" href="#">
                                                                    { this.state.data.currentPage + 1 }
                                                                </a>
                                                            </li>
                                                        }

                                                        {
                                                            this.state.data.currentPage === this.state.data.totalPages ?
                                                            <li className="page-item disabled">
                                                                <a className="page-link" href="#" aria-label="Next">
                                                                    <span aria-hidden="true">&raquo;</span>
                                                                </a>
                                                            </li>
                                                            :
                                                            <li className="page-item">
                                                                <a onClick={this.handleNextPage} className="page-link" href="#" aria-label="Next">
                                                                    <span aria-hidden="true">&raquo;</span>
                                                                </a>
                                                            </li>
                                                        }
                                                        {
                                                            this.state.data.currentPage !== this.state.data.totalPages &&
                                                            <li className="page-item">
                                                                <a onClick={(e) => this.handleNumberPage(e, this.state.data.totalPages)} className="page-link" href="#">
                                                                    Last
                                                                </a>
                                                            </li>
                                                        }
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    }


                                </div>
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

export default User
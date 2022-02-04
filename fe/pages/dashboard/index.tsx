import Dashboard from '../../layouts/Dashboard'
import Head from "next/head"

export default function Dash() {
    return(
        <Dashboard>
            <Head>
                <title>MERN | Dashboard</title>
            </Head>
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Dashboard</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item active">Dashboard</li>
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
                            <div className="alert alert-success" role="alert">
                                Success ...
                            </div>

                            You are logged in!
                        </div>
                        <div className="card-footer">
                        </div>
                    </div>

                </section>
            </div>
        </Dashboard>
    )
}
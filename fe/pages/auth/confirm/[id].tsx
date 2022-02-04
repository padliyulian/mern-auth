import React from "react"
import Head from 'next/head'
import Swal from "sweetalert2"
import axios from "../../../configs/axios"
import { withRouter, NextRouter } from 'next/router'


interface WithRouterProps {
    router: NextRouter
}

interface ConfirmProps extends WithRouterProps {
}

class Confirm extends React.Component<ConfirmProps> {
    componentDidMount() {
        this.handleConfirm()
    }

    handleConfirm = () => {
        axios.get(`/auth/confirm/${this.props.router.query.id}`)
            .then(res => {
                if (res.data.status === 'success') {
                    Swal.fire(
                        'Success',
                        `${res.data.msg}`,
                        'success'
                    )
                    // this.props.router.push('/auth/login')
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

    render() {
        return(
            <Head>
                <title>MERN | Confirm</title>
            </Head>
        )
    }
}

export default withRouter(Confirm)
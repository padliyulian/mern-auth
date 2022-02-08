import React from "react"
import Head from 'next/head'
import { withRouter, NextRouter } from 'next/router'
import { removeCookies } from 'cookies-next'


interface WithRouterProps {
    router: NextRouter
}

interface LogoutProps extends WithRouterProps {
}

class Logout extends React.Component<LogoutProps> {
    componentDidMount() {
        this.handleLogout()
    }

    handleLogout = () => {
        removeCookies('token')
        setTimeout(() => window.location.href = '/', 1000)
    }

    render() {
        return(
            <Head>
                <title>MERN | Logout</title>
            </Head>
        )
    }
}

export default withRouter(Logout)
import React, { useEffect } from "react"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"

const Auth = (props) => {
    let navigate = useNavigate()

    useEffect(() => {
        if (!props.user) return navigate('/')
    }, [])

    return props.render
}

const mapStateToProps = state => ({
    user: state.auth.user
})

export default connect(mapStateToProps)(Auth)
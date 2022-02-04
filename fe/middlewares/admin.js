import React, { useEffect } from "react"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"

const Admin = (props) => {
    let navigate = useNavigate()

    useEffect(() => {
        if (props.user && props.user.role !== 'admin') navigate(-1)
    }, [])

    return props.render
}

const mapStateToProps = state => ({
    user: state.auth.user
})

export default connect(mapStateToProps)(Admin)
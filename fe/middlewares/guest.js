import React, { useEffect } from "react"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"

const Guest = (props) => {
    let navigate = useNavigate()

    useEffect(() => {
        if (props.user) navigate('/auth/dashboard')
    }, [])

    return props.render
}

const mapStateToProps = state => ({
    user: state.auth.user
})

export default connect(mapStateToProps)(Guest)
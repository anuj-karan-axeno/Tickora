import React, { useContext } from 'react'
import {AuthContext} from '../hooks/AuthContext'
export const Login = () => {

    const {loginUser} = useContext(AuthContext)
    const onSubmitHandler = (e)=>{
        e.preventDefault()
        console.log("logged In")
    }
    return (
        <form action="" onSubmit={onSubmitHandler}>
            <input type="text" />
            <button>Login</button>
        </form>
    )
}

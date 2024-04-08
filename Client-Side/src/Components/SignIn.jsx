import { Fragment } from "react"
import { Link } from "react-router-dom";
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setToken } from "../Redux-Store/TokenSlice";

export function SignIn () {

        const dispatch = useDispatch()

        const fieldsRequired = () => toast.warn("Please, All fields are required", {
            theme: "light",
            autoClose: 2000,
            transition: Zoom,
        });
        const WentWrong = (message) => toast.error(message, {
            theme: "light",
            autoClose: 2000,
            transition: Zoom,
        });

        const handleSubmit = () => {
            
            const pseudo = document.getElementById('pseudo')
            const email = document.getElementById('email')
            const password = document.getElementById('password')
            localStorage.setItem('User', pseudo.value)
            const Welcome = () => toast.success(`Welcome ${pseudo.value}`, {
                theme: "light",
                autoClose: 2000,
                transition: Zoom,
            });

            if(pseudo.value === "" || email.value === "" || password.value === "") {
                fieldsRequired()
            } else{ 
                const Register = async () => {
                    try {
                        const url = "http://localhost:9001/auth/login"
                        const signingIn = await fetch(url, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                pseudo: pseudo.value,
                                email: email.value,
                                password: password.value
                            })
                        })
                        const res = await signingIn.json()

                        if(signingIn.ok){
                            const token = res.token
                            localStorage.setItem('token', token)
                            dispatch(setToken(token))
                            Welcome()
                            window.location.replace("/items")
                        } else{
                            const noPseudo = res.mesPseudo
                            const noEmail = res.mesEmail
                            const noPass = res.mesPass
                            
                            if(noPseudo){
                                WentWrong(noPseudo)
                            } else if (noEmail){
                                WentWrong(noEmail)
                            } else if(noPass) {
                                WentWrong(noPass)
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                Register()
            }
        }
    
    return <Fragment>
        <div style={{backgroundColor: "beige", minHeight: "100vh"}}>

        <div className="container-fluid pt-2">
        <ul className="nav nav-tabs position-sticky top-0">
            <li className="nav-item">
                <Link className='nav-link' to={"/signup"}>Sign Up</Link>
            </li>
            <li className="nav-item">
                <Link className='nav-link active' aria-current="page" to={"/"}>Sign in</Link>
            </li>
        </ul>
    </div>

        <h1 className="login-page"><em>Welcome to the Login page !</em></h1>
        
        <hr />
        <div className="Input-Wraper">
            <div className="Input-fields">
                <input type="text" id="pseudo" placeholder="Your Pseudo" autoComplete="null"/>
                <input type="email" id="email" placeholder="Your Email" autoComplete="null" />
                <input type="password" placeholder="Your Password" id="password" />
                <button type="button" onClick={handleSubmit} id="Sign-Up">Sign In</button>
            </div>
        </div>
        </div>
    </Fragment>
}
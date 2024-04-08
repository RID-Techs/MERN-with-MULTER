import { Fragment } from "react"
import { Link, useNavigate } from "react-router-dom";
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SignUp () {
    // const [canSubmit, setCanSubmit] = useState(null)
        const navigate = useNavigate();

        const fieldsRequired = () => toast.warn("Please, All fields are required", {
            theme: "light",
            autoClose: 2000,
            transition: Zoom,
        });
        const WentWrong = () => toast.error("Sorry, something went wrong. Try Again !", {
            theme: "light",
            autoClose: 2000,
            transition: Zoom,
        });

        const handleSubmit = () => {
            
            const pseudo = document.getElementById('pseudo')
            const email = document.getElementById('email')
            const password = document.getElementById('password')

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
                        const url = "http://localhost:9001/auth/signup"
                        const signingUp = await fetch(url, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                pseudo: pseudo.value,
                                email: email.value,
                                password: password.value
                            })
                        })

                        if(signingUp.ok){
                            Welcome()
                            navigate("/")
                        } else{
                            WentWrong()
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
                <Link className='nav-link active' aria-current="page" to={"/signup"}>Sign Up</Link>
            </li>
            <li className="nav-item">
                <Link className='nav-link' to={"/"}>Sign in</Link>
            </li>
            <li className="nav-item">
                <Link className='nav-link' to={"/items"}>Get All Items</Link>
            </li>
        </ul>
    </div>

        <h1 className="login-page"><em>Welcome to the Sign Up page !</em></h1>
        
        <hr />
        <div className="Input-Wraper">
            <div className="Input-fields">
                <input type="text" id="pseudo" placeholder="Your Pseudo" autoComplete="null"/>
                <input type="email" id="email" placeholder="Your Email" autoComplete="null" />
                <input type="password" placeholder="Your Password" id="password" />
                <button type="button" onClick={handleSubmit} id="Sign-Up">Sign up</button>
            </div>
        </div>
        </div>
    </Fragment>
}
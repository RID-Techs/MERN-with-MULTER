import { useRouteError } from "react-router-dom";
import logo from '../assets/Oups.png'
export function ErrorPage () {
    const onError = useRouteError()
    
    return <>
        <div className='error-page-wraper' style={{backgroundColor: "aliceblue", minHeight: "100vh"}}>
            <div className='error-page'>
                <h3>{onError.status} {onError.statusText || onError.message} !</h3>
                <img src={logo} alt="Oups" />
                <h1>Sorry, you are not on the right place, check the link !</h1>
            </div>
        </div>
    </>
}
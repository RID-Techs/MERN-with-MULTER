import logo from '../assets/Oups.png'
export function Error () {
    return <>
        <div className='error-page-wraper' style={{backgroundColor: "aliceblue", minHeight: "100vh"}}>
            <div className='error-page'>
                <img src={logo} alt="Oups" />
                <h1>Oups, Something went wrong !</h1>
            </div>
        </div>
    </>
}
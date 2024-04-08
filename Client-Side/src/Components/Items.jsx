import { Link, useLoaderData, useNavigate, } from "react-router-dom"

export function Items () {
    const data = useLoaderData()
    const  navigate = useNavigate()
     // Include token in request headers
    // const storedToken = localStorage.getItem('token');
    // console.log('Token from local storage:', storedToken);
    

    const logOut = () => {
        localStorage.removeItem('token')
        navigate("/")
    }

    return <>
        <div style={{backgroundColor: "beige", minHeight: "100vh"}}>
            <div className="container-fluid pt-2">
                <ul className="nav nav-tabs position-sticky top-0">
                    <li className="nav-item">
                        <Link className='nav-link' to={"/signup"}>Sign Up</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to={"/"}>Sign in</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link active' aria-current="page" to={"/items"}>Get All Items</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to={"/items/sell"}>Sell an Item</Link>
                    </li>
                    <li className="nav-item ms-3 mt-2">
                        <button id="log-out" type="button" onClick={logOut}>Log out</button>
                    </li>
                </ul>
            </div>

            <h1 className="mt-2" style={{textAlign: "center"}}>Items</h1>
            <hr />
            <div className="container mt-2">
                <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-5">
                    { data.map((item) => (
                        <div className="col" key={item._id}>
                            <div className="card">
                                <img className="items-display-img" src={item.image} alt={item.name + "'s image"} />
                                    <div className="mt-2 items-display" style={{backgroundColor: "aliceblue", padding: "1em"}}>
                                        <p><strong><em>• {item.name}</em></strong></p>
                                        <hr />
                                            <p><strong><em>Description :</em></strong> {item.description}</p>
                                                <p>${item.price}</p>
                                                    <Link to={`/items/details/${item._id}`}>
                                                        <button className="item-button mt-2" type="button">
                                                            Get the item
                                                        </button>
                                                    </Link>
                                    </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        <hr />
        <div className="pb-2">
            <em>
                <h6 className="text-center">
                    2024 | Made with <span style={{color: 'red'}}>&hearts;</span> By @RID
                </h6>
            </em>
        </div>
        </div>
    </>
}
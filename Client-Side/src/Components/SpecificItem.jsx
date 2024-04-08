import { useState } from "react"
import { Link, useLoaderData, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { SelectToken } from '../Redux-Store/TokenSlice';
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SpecificItem () {
    const Item = useLoaderData()
    const token = useSelector(SelectToken);
    const User = localStorage.getItem('User')
    const navigate = useNavigate()
    const [showModification, setShowModification] = useState(false)
    const [showItem, setShowItem] = useState(true)

    const [pseudoVal, setPseudoVal] = useState(Item.pseudo)
    const handlePseudoVal = (e) => {
        setPseudoVal(e.target.value)
    }
    const [contactVal, setContactVal] = useState(Item.contact)
    const handleContactVal = (e) =>{
        setContactVal(e.target.value)
    }

    const [nameVal, setNameVal] = useState(Item.name)
    const handleNameVal = (e) => {
        setNameVal(e.target.value)
    }
    const [descripVal, setDescripVal] = useState(Item.description)
    const handleDescripVal = (e) => {
        setDescripVal(e.target.value)
    }
    const [priceVal, setPriceVal] = useState(Item.price)
    const handlePriceVal = (e) => {
        setPriceVal(e.target.value)
    }
    const [image, setImage] = useState(Item.image);

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleModification = () => {
        setShowModification(true)
        setShowItem(false)
    }

    const DeleteMessage = () => toast.success(`The item ${Item.name} 
    has been deleted successfully !`, 
    {
        theme: "light",
        autoClose: 2000,
        transition: Zoom,
    });

    const handleDeletion = () => {
        const DeleteItem = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                console.log('Token from local storage:', storedToken);

                const headers = {
                    "Authorization": `Bearer ${storedToken || token}`
                };

                const url = `http://localhost:9001/items/delete/${Item._id}`
                const ItemToDelete = await fetch(url, {
                        method: "DELETE",
                        headers: headers    
                })

                if(ItemToDelete.ok){
                    DeleteMessage()
                    setTimeout(() => {
                        navigate("/items")
                    }, 2000)
                }

            } catch (error) {
                console.log(error)
            }
        }
        DeleteItem()
    }

    const fieldsRequired = () => toast.warn("Please, All fields are required", {
        theme: "light",
        autoClose: 2000,
        transition: Zoom,
    });

    const LoginBefore = () => toast.warn("Please, Login first", {
        theme: "light",
        autoClose: 2000,
        transition: Zoom,
    });

    const successItem = () => toast.success("Item add successfully !", {
        theme: "light",
        autoClose: 2000,
        transition: Zoom,
    });
    const failItem = () => toast.error("Failed to add the item !", {
        theme: "light",
        autoClose: 2000,
        transition: Zoom,
    });

    const handleModifiedData = () => {
        const pseudo = document.getElementById('pseudo')
        const contact = document.getElementById('contact')
        const name = document.getElementById('name')
        const image = document.getElementById('image')
        const description = document.getElementById('description')
        const price = document.getElementById('price')

        if(name.value === "" || description.value === "" || price.value === "") {
            fieldsRequired()
        } else{
            const ModifyItem = async () => {
                try {
                    const formData = new FormData();
                    formData.append('pseudo', pseudo.value);
                    formData.append('contact', contact.value);
                    formData.append('name', name.value);
                    formData.append('image', image.files[0]);
                    formData.append('description', description.value);
                    formData.append('price', price.value);

                    // Include token in request headers
                const storedToken = localStorage.getItem('token');
                console.log('Token from local storage:', storedToken);

                    const headers = {
                        "Authorization": `Bearer ${storedToken || token}`
                    };

                if(!token && !storedToken){
                    LoginBefore()
                    navigate("/");
                }

                const url = `http://localhost:9001/items/modify/${Item._id}`
                    const sendItem = await fetch(url, {
                        method: "PUT",
                        headers: headers,
                        body: formData
                    })

                    if(sendItem.ok){
                        successItem();
                        setShowItem(true)
                        setShowModification(false)
                        window.location.reload()
                    } else{
                        failItem()
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            ModifyItem()
        }

    }
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
                        <Link className='nav-link' to={"/items"}>Get All Items</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link active' aria-current="page" to={"/items/details/:id"}>{Item.name}</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='nav-link' to={"/items/sell"}>Sell an Item</Link>
                    </li>
                    <li className="nav-item ms-3 mt-2">
                        <button id="log-out" type="button" onClick={logOut}>Log out</button>
                    </li>
                </ul>
            </div>

            <h1 className="mt-2" style={{textAlign: "center"}}>Welcome</h1>
            <hr />
            <div className="container mt-2">
                
            {showItem && 
            
            <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-5">
                    {
                        
                        <div className="col" key={Item._id}>
                            <h1 className="mt-2" style={{textAlign: "center"}}>Item published by @{Item.pseudo}</h1>

                            <div className="card">
                                <img className="items-display-img" src={Item.image} alt={Item.name + "'s image"} />
                                    <div className="mt-2 items-display" style={{backgroundColor: "aliceblue", padding: "1em"}}>
                                        <p>{Item.name}</p>
                                            <p>{Item.description}</p>
                                                <p>${Item.price} </p>
                                                    {User === Item.pseudo ? 
                                                    <div className="btns">
                                                    <button onClick={handleModification} className="mt-2" id="modify-button" type="button">
                                                        Modify
                                                    </button>
                                                    <button data-bs-toggle="modal"
                                                        data-bs-target="#exampleModal" 
                                                    className="item-button mt-2" 
                                                    id="delete-button" type="button">
                                                        Delete
                                                    </button>
                                                </div> : null
                                                }
                                                {User !== Item.pseudo ? 
                                                <a href={"https://wa.me/" + Item.contact + "?text=Hello, I lik the image you published ! Dear " + Item.pseudo} target="_blank">
                                                    <button id="like-button" type="button">Talk to the poster</button>
                                                </a> : null
                                            }
                                    </div>
                            </div>
                        </div>
                    }
                </div>
            }

<div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Delete My Account !
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">Are you sure ?</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  No
                </button>
                <button
                  onClick={handleDeletion}
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>


            {showModification && 
            <div className="items-wraper">
                <button id="back-button" onClick={() => {
                    setShowModification(false)
                    setShowItem(true)
                }} type="button">Back to the Item</button>
            <div className="Input-Wraper mt-3">
                <form className="Input-fields" encType="multipart/form-data">
                <input value={pseudoVal} onChange={handlePseudoVal} type="text" id="pseudo" />
                <input value={contactVal} onChange={handleContactVal} type="number" id="contact" />
                <input value={nameVal} onChange={handleNameVal} type="text" id="name" placeholder="name"/>
                <input type="file" onChange={onImageChange} id="image" accept=".jpg, .jpeg, .png" />
                {image ? <img height={200} alt="preview image" src={image} /> : null}
                <textarea value={descripVal} onChange={handleDescripVal} id="description" placeholder="Description"/>
                <input value={priceVal} onChange={handlePriceVal} type="number" id="price" placeholder="Price"/>
                <button type="button" onClick={handleModifiedData} id="sendItem">Submit</button>
                </form>
            </div>
            </div>

            }
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
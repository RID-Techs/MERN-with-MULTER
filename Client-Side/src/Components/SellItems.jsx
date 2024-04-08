import { useSelector } from 'react-redux';
import { SelectToken } from '../Redux-Store/TokenSlice';
import { Link, useNavigate } from "react-router-dom"
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

export function SellItem () {
    const navigate = useNavigate()
    const token = useSelector(SelectToken)
    const [image, setImage] = useState(null);

    const logOut = () => {
        localStorage.removeItem('token')
        navigate("/")
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    };

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

    const handleSubmit = () =>{
        
        const pseudo = document.getElementById('pseudo')
        const contact = document.getElementById('contact')
        const name = document.getElementById('name')
        const image = document.getElementById('image')
        const description = document.getElementById('description')
        const price = document.getElementById('price')

        if(name.value === "" || description.value === "" 
            || price.value === "" || pseudo.value === "" || contact.value === "") {
            fieldsRequired()
        } else{
            const AddingItem = async () => {
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

                const url = "http://localhost:9001/items/sell"
                    const sendItem = await fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: formData
                    })

                    if(sendItem.ok){
                        successItem();
                        navigate("/items")
                    } else{
                        failItem()
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            AddingItem()
        }
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
                <Link className='nav-link active' aria-current="page" to={"/items/sell"}>Sell an Item</Link>
            </li>
            <li className="nav-item ms-3">
                <button id="log-out" type="button" onClick={logOut}>Log out</button>
            </li>
        </ul>
    </div>
            
            <div className="Input-Wraper mt-3">
                <form className="Input-fields" encType="multipart/form-data">
                <input type="text" id="pseudo" placeholder="Your Pseudo"/>
                <input type="number" id="contact" placeholder="Your WhatsApp contact"/>
                <input type="text" id="name" placeholder="Item name"/>
                <input type="file" onChange={onImageChange} id="image" accept=".jpg, .jpeg, .png" />
                {image ? <img height={200} alt="preview image" src={image} /> : null}
                <textarea id="description" placeholder="Description"/>
                <input type="number" id="price" placeholder="Price"/>
                <button type="button" onClick={handleSubmit} id="sendItem">Submit</button>
                </form>
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
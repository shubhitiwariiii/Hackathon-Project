//axios for connection between backend and frontend...

import axios from "axios";

const API = axios.create({
    baseURL : "http://localhost:3000/api",
});

// attach token automatically for protected routes!!

API.interceptors.request.use((req) =>{
    const token = localStorage.getItem("token");

    if(token){
        req.headers.Authorization = `Bearer ${token}`
    }

    return req;
});

export default API;
import { useState, useEffect, Suspense } from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Emails from "../components/Emails";
import { MailOutlineOutlined } from "@mui/icons-material";
import { Box } from '@mui/material'
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import SuspenseLoader from "../components/common/SuspenseLoader";

const Main = () => {
    const [openDrawer, setOpenDrawer] = useState(true);
    const [userName, setUserName] = useState(""); // State to store the user's name
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the user's name from sessionStorage
        const storedUserName = sessionStorage.getItem('userName');
        setUserName(storedUserName);
    }, []); // Run this effect only once on component mount

    const toggleDrawer = () => {
        setOpenDrawer(prevState => !prevState);
    }

    return(
        <>  
            <Header toggleDrawer={toggleDrawer} />
            <Box>
                <SideBar openDrawer={openDrawer}/> 
                <Suspense fallback={<SuspenseLoader/>}>
                    <Outlet context={{ openDrawer }}/>
                </Suspense>
            </Box>          
        </>
    );
}

export default Main;

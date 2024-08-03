import React, { useState, useEffect } from 'react'
import { Sidebar } from "flowbite-react";
import { FaUser } from "react-icons/fa";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from'react-redux';

function DashSidebar() {

    const location = useLocation();
    const [tab, setTab] = useState("")

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])

    const handleSignout = async () => {
        console.log("asd");
        
        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST'
          })
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            dispatch(signoutSuccess(data));
          }
          navigate('/sign-in');
        } catch (error) {
          console.log(error.message);
        }
      }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === "profile"} icon={FaUser} label={"User"} labelColor="dark" as="div">
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item icon={HiArrowRightOnRectangle} className="cursor-pointer" onClick={handleSignout} >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar
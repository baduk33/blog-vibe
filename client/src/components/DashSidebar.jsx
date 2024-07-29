import React, { useState, useEffect } from 'react'
import { Sidebar } from "flowbite-react";
import { FaUser } from "react-icons/fa";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function DashSidebar() {

    const location = useLocation();
    const [tab, setTab] = useState("")

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])


    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === "profile"} icon={FaUser} label={"User"} labelColor="dark" >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item icon={HiArrowRightOnRectangle} className="cursor-pointer" >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar
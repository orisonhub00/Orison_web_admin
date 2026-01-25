"use client";
import Navbar from "../Navbar/Navbar"
import Herobanner from "./Herobanner";

export default function Homepage() {
    return(
        <div className="text-center bg-white">
            <div className="p-4">
                <Navbar/>
            </div>
            <div>
                <Herobanner/>
            </div>
        </div>
    )
}
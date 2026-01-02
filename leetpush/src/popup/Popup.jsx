import { useState } from "react";

export deafult function Popup(){

    const[status , useStatus] = useState("";


        const pushSolution = async () =>{
            setStatus("Extracting code ......... thank you for using this ");


            const[tab] = await chrome.tabs.query({
                active : true,
                currentWindow : true
            });



            
        }
    )
}
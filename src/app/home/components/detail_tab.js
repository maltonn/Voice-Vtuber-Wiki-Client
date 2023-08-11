"use client"
import React, { useState } from 'react';
import '../css/detail_tab.css';
export default function DetailTab(props) {
    if (props.data == undefined) return (<div></div>)
    return (
        <div className="absolute mt-32 m-6 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center p-10">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={props.data.channel_thumbnail || ""} alt="Bonnie image" />
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{props.data.channel_title}</h5>
                <div className="flex mt-4 space-x-3 md:mt-6 mb-6">
                    <a href={`https://www.youtube.com/channel/${props.data.id}`} target='_blank' className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">YouTube</a>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400"> {props.data.channel_description.slice(0, 140) + ((props.data.channel_description.length > 140) ? "..." : "")}</p>
                <span className="mt-5">θ={props.data.theta.toString().slice(0,5)} φ={props.data.phi.toString().slice(0,5)}</span>
            </div>
        </div>

    )
}
// export default function DetailTab(props) {
//     if (props.data == undefined) return (<div></div>)
//     return (<a href={`https://www.youtube.com/channel/${props.data.id}`} target='_blank'>
//         <div className="detail-tab">
//             <div className="detail-tab-image">
//                 <img src={props.data.channel_thumbnail || ""} />
//             </div>

//             <div className="detail-tab-text">
//                 <div className="detail-tab-text-title">
//                     {props.data.channel_title}
//                 </div>
//                 <div className="detail-tab-text-description">
//                     {props.data.channel_description}
//                     {/* {props.data.channel_description.slice(0, 300) + ((props.data.channel_description.length > 300) ? "..." : "")} */}
//                 </div>
//             </div>
//         </div>
//     </a>
//     );
// }
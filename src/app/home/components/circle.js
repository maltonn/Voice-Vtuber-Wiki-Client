"use client"
import React, { useState } from 'react';
import '../css/circle.css';

export default function Circle(props) {
    const onClickFunc=()=>{
        props.onCircleClick(props.index)
    }

    // 0<r<1 の範囲内で赤→青へ
    const tmp=(Math.tanh(4*props.r-2)+1)/2
    const col = `rgb(${255*(1-tmp)},0,${255*tmp})`

    if (props.data.id == undefined) return (<div></div>)
    return (
        // <a href={`https://www.youtube.com/channel/${props.data.id}`} target='_blank'>
            <div             
                onClick={onClickFunc} className="circle" 
                style={{
                    transform:`translate(${props.traX}px,${props.traY}px)`,
                    borderColor:col,
                    }}
                    >
                <img src={props.data.channel_thumbnail} />
            </div>
        // </a>
    );
}
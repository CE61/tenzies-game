import React from "react";

export default function Dice(props){
    const styles = props.isHeld ? {backgroundColor: "#59E391"} : {backgroundColor: "whitesmoke"};
    return (
        <div style={styles} className="dice" onClick={()=>props.toggleHeld(props.id)}>
            <p>{props.value}</p>
        </div>
    );
}
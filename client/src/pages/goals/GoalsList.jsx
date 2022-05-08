import React from "react";
import GoalsRow from "./GoalsRow.jsx";

const GoalsList = (props) => {
    let tarr = props.val1<props.jsonData.values.length-1?props.jsonData.values.slice(props.val1, props.val1+1)
        :props.jsonData.values.slice(props.val1, props.jsonData.values.length);

    return ( 
        tarr.map((obj, index)=>{
            return (
                <GoalsRow key={props.val1+index} enabled={props.enabled} lastItem={props.jsonData.values.length===Number(props.val1+1)}
                    changeHandler={(tdata)=>props.changeHandler(tdata, props.val1+index)} data={obj} textSelected = {props.textSelected}
                    prevFeedback={props.prevFeedback.arr[props.val1]} showModel={(val, dindex)=>props.showModel(val, props.val1+index, dindex)} 
                    extraFeedback={props.extraFeedback} />
            )
        })
    )
}

export default GoalsList;
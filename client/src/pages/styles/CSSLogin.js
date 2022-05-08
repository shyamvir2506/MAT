import { makeStyles } from '@material-ui/core/styles';

export const CSSLogin = makeStyles({
    root: {
        flexGrow: 1,
        height:window.innerHeight-60
    },
    card:{
        width:500,
        height:330
    },
    label:{
        width:120,
        height:30,
        paddingTop:10,
        display:'inline-block'
    },
    input:{
        height:30,
        width:400,
        display:'inline-block'
    },
    content:{
        padding:40
    },
    btn:{
        marginTop:20,
        width:150
    },
    btnHolder : {
        display:'flex',
        width:400,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    placeholder:{
        fontSize:9.7,
        color:'grey'
    },
    alert:{
        marginTop:10
    },
    fpass:{
        textAlign:'center',
        margin:'15px 0px'
    }
})
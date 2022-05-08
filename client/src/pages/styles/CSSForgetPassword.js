import { makeStyles } from '@material-ui/core/styles';

export const CSSForgetPassword = makeStyles({
    root: {
        flexGrow: 1,
        height:window.innerHeight-60
    },
    card:{
        width:500,
        height:360
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
    btnHolder:{
        marginTop:30,
        textAlign:'center'
    },
    btn:{
        width:200
    }
})
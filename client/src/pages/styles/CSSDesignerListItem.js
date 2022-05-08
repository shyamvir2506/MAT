import { makeStyles } from '@material-ui/core/styles';

export const CSSDesignerListItem = makeStyles({
    root:{
        cursor:assigned=>assigned.zone?'auto':'move',
        width:'100%',
        height:40,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:4,
        backgroundColor:assigned=>assigned.zone ? '#efefef' : '#ffffff',
        '&:hover':{
            backgroundColor:assigned=>!assigned.zone && '#c9efff'
        }
    },
    titleHolder:{
        display:'flex',
        flexDirection:'column',
        width:'100%',
        marginLeft:10,
    },
    title:{
        fontSize:14,
        color:'black',
        pointerEvents:'none',
        userSelect:"none"
    },
    subTitle:{
        fontSize:10,
        color:'grey',
        pointerEvents:'none'
    }
});
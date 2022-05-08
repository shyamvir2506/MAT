import { makeStyles } from '@material-ui/core/styles';

export const CSSAdminLeftPanel = makeStyles({
    root: {
        maxWidth:635,
        height:270
    },
    leftPanel:{
        height:50
    },
    listHolder:{
        width:325
    },
    list:{
        width:'100%'
    },

    btn:{
        
    },
    listHeader:{
        backgroundColor:'#EEEEEE',
        height:30,
        display:'flex',
        alignItems:'center',
        paddingLeft:5,
        paddingRight:5,
        justifyContent:'space-between'
    },
    listScroller:{
        minHeight:165,
        overflowX:'hidden',
        overflowY:'auto'
    },
    noMsg:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height:100,
        pointerEvents:'none'
    }
});
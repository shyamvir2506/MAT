import { makeStyles } from '@material-ui/core/styles';

export const CSSAdminRightPanel = makeStyles({
    root: {
        maxWidth:450,
        minWidth:300
    },
    header:{
        display: 'flex',
        alignItems: 'center',
        justifyContent:'space-between',
        height:50,
        paddingLeft:10
    },
    divider: {
      height: 28,
    },
    listHolder:{
        width:'100%',
        marginTop:10
    },
    list:{
        width:'100%',
        height:615
    },
    listHeader:{
        backgroundColor:'#EEEEEE',
        height:50,
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between'
    },
    listScroller:{
        height:565,
        overflowX:'hidden',
        overflowY:'auto'
    },
    noMsg:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height:200
    }
});
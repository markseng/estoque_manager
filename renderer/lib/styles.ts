import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      minHeight: "100%",
      minWidth: "100%",
     width: '600px',
      textAlign: "center",
      padding: "10px",
    },
    buutonStyle: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
    list: {
    //   borderStyle: "solid",
    //   borderWidth: '1px',
    //   borderRadius: "5px",
      width: "100%",
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      
    },
    buttonSelect:{
      backgroundColor: '#e6e600',
      color: "white",
    },
    buttonSelectDone:{
      backgroundColor: '#00cc00',
      color: "white",
    },
    button: {
        marginRight: theme.spacing(1),
      },
      instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
  })
);

export default useStyles;

import { Button, FormGroup, Grid, Typography } from "@material-ui/core";
import React, {useEffect} from "react";
import useStyles from "../lib/styles";
import router, { useRouter } from "next/router";
import { ipcRenderer } from "electron";
export default function Menu() {
useEffect(()=>{

}, [])

 const saveDirectoryBase = ()=>{
  const pathBase = ipcRenderer.sendSync("setupBase")
 }

  const toCreacteQrCod = () => {
    router.push("/RegisteProduct");
  };



  const classes = useStyles();
  return (
    <div className={classes.root} style={{ padding: "50px" }}>
      <Grid
        spacing={3}
        container
        direction="column"
        alignContent="center"
        alignItems="center"
        onKeyPress={(ev)=> console.log(ev.key)}
      >
        <Grid style={{ marginBottom: "100px" }}>
          <Typography variant="h2">Menu</Typography>
        </Grid>

        <Grid item>
          <Button
            onClick={() => toCreacteQrCod()}
            className={classes.buutonStyle}
          >
            Registrar Produtos
          </Button>
        </Grid>
        {/* <Grid item>
          <Button
            onClick={() => router.push("/ConsumeStock")}
          className={classes.buutonStyle}>Consumir Estoque</Button>
        </Grid> */}
         <Grid item>
          <Button
            onClick={() => saveDirectoryBase()}
            className={classes.buutonStyle}
          >
            Configurar Caminho da Base de Dados
          </Button>
        </Grid>
        <Grid item> 
          <Button
            onClick={() => router.push("/FeedStock")}
            className={classes.buutonStyle}
          >
            Alimentar Estoque
          </Button>
        </Grid>
        <Grid item> 
          <Button
            onClick={() => router.push("/FixStock")}
            className={classes.buutonStyle}
          >
            Ajustar Estoque
          </Button>
        </Grid>
        <Grid item> 
          <Button
            onClick={() => router.push("/Remove_products")}
            className={classes.buutonStyle}
          >
            Remover Produtos
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

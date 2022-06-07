import {
  Button,
  FormGroup,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  IconButton,
  ListItemText,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStyles from "../lib/styles";
import router, { useRouter } from "next/router";
import { SelectText, StandartInput } from "../components/Inpusts";
import { ipcRenderer } from "electron";
import { AiFillDelete } from "react-icons/ai";
import { FixedSizeList } from "react-window";

export default function RegisteProduct() {
  const [idProduct, setIdProduct] = useState("");
  const [listProduct, setListProducts] = useState([]);
  useEffect(() => {
    const getAllFeed = ipcRenderer.sendSync("getAllData", "ESTOQUE_ATUAL");
    console.log(getAllFeed);
    setListProducts([...getAllFeed]);
  }, []);

  const classes = useStyles();
  const onChange = (ev) => {
    const { value } = ev;
  };
  const removeItem = (id) => {
    ipcRenderer.sendSync("deleteData", ["ESTOQUE_ATUAL", { id_db: id }]);
    const getAllFeed = ipcRenderer.sendSync("getAllData", "ESTOQUE_ATUAL");
    setListProducts([...getAllFeed]);
  };

  return (
    <div
      className={classes.root}
      style={{ paddingRight: "100px", paddingLeft: "100px" }}
    >
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={6}>
          <Button className={classes.buutonStyle} onClick={() => router.back()}>
            Retornar
          </Button>
        </Grid>
        <Grid item xs={6}>
          <img style={{ width: "200px" }} src="/images/resute2.png" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">Remover Entrada</Typography>
        </Grid>

        {/* <Grid item xs={12}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"

                    >
                        <Grid item xs={4}>
                            <StandartInput
                                label="Código do Produto"
                                onChange={onChange}
                                value={idProduct}
                                name='idProduct'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                className={classes.buutonStyle}
                            //   onClick={() => handleSelectPlanilhaProducts()}
                            >
                                {" "}
                                Buscar
                            </Button>
                        </Grid>
                    </Grid>

                 

                </Grid> */}
        <Grid item xs={12}>
          <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
            {/* <List> */}
              {listProduct.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`ID PRODUTO: ${item.ID_PRODUTO}`}
                    secondary={`ID ETIQUETA: ${item.id_db}`}
                  />

                  <ListItemIcon>
                    <IconButton onClick={() => removeItem(item.id_db)}>
                      <AiFillDelete />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              ))}
            {/* </List> */}
          </FixedSizeList>
        </Grid>
      </Grid>
    </div>
  );
}

import {
  Button,
  FormGroup,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";
import React, { useState } from "react";
import useStyles from "../lib/styles";
import router, { useRouter } from "next/router";
import { SelectText, StandartInput } from "../components/Inpusts";
import { ipcRenderer } from "electron";
export default function Menu() {
  const toCreacteQrCod = () => {
    const classes = useStyles();
    router.push("/CreateQrCode");
  };
  const classes = useStyles();
  const [dataProduct, setDataProduct] = useState({
    id: "",
    amount: 0,
    DESCRICAO: "",
  });
  const getPoduct = () => {
    const newProduct = ipcRenderer.sendSync("getRow", [
      "feedstock",
      { CODIGO: parseInt(dataProduct.id) },
    ]);
    if (!!newProduct) {
      setDataProduct({ ...dataProduct, DESCRICAO: newProduct.DESCRICAO });
    }
    console.log(newProduct);
  };
  const onChange = ({ target }) => {
    const { name, value } = target;
    let actualData = dataProduct;
    actualData[name] = value;
    setDataProduct({ ...actualData });
  };
  const onSave = () => {
    if (dataProduct.DESCRICAO !== "") {
      ipcRenderer.sendSync("saveRow", [
        "balance_stock",
        {
          ID_PRODUTO: dataProduct.id,
          QUANIDADE_ENTRADA: dataProduct.amount,
          DATE: new Date(),
        },
      ]);

      setDataProduct({
        id: "",
        amount: 0,
        DESCRICAO: "",
      });
    }
  };

  const handleSelectPlanilha = () => {
    const collunsRequired = [
      "ID_PRODUTO",
      "QUANTIDADE_ENTRADA",
      "CD_FORNECEDOR",
      "key_save",
      "id_db",
      "key_save",
      "DATA_SAVE",
      "QUANTIDADE_AJUSTADA",
    ];
    const pathXlsx = ipcRenderer.sendSync("getPathFile");
    const getNewProducts = ipcRenderer.sendSync("readXlsx", [
      pathXlsx,
      "ESTOQUE_ATUAL",
      collunsRequired,
    ]);

    if (!!getNewProducts) {
      ipcRenderer.sendSync("fixStock", getNewProducts);
    }
    console.log(getNewProducts);

    //   if (!!getNewProducts) {
    //     const keySave = ipcRenderer.sendSync("saveRowArray", [
    //       "ESTOQUE_ATUAL",
    //       getNewProducts,
    //     ]);

    //     const getAllSave = ipcRenderer.sendSync("getRows", [
    //       "ESTOQUE_ATUAL",
    //       { key_save: keySave },
    //     ]);

    //     const descProducts = getAllSave.map(
    //       (item) => `CD_PRD: ${item.ID_PRODUTO} CD_FOR: ${item.CD_FORNECEDOR}`
    //     );
    //     const QrCode = getAllSave.map((item) => item.id_db);

    //     ipcRenderer.send('createQrCode', [QrCode, descProducts])
    //     console.log(getAllSave);
    //   }
  };

  return (
    <div
      className={classes.root}
      style={{ paddingRight: "100px", paddingLeft: "100px" }}
    >
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item xs={6}>
          <Button className={classes.buutonStyle} onClick={() => router.back()}>
            Retornar
          </Button>
        </Grid>
        <Grid item xs={6}>
          <img style={{ width: "200px" }} src="/images/resute2.png" />
        </Grid>
        {/* <Grid xs={12}>
            <Typography variant="h4">Produto: {dataProduct.DESCRICAO}</Typography>
          </Grid>
          <Grid item xs={8}>
            <StandartInput
              label="Código do Produto"
              name="id"
              onChange={onChange}
              value={dataProduct.id}
            />
          </Grid>
  
          <Grid item xs={4}>
            <Button
              type="submit"
              className={classes.buutonStyle}
              onClick={() => getPoduct()}
            >
              Buscar
            </Button>
          </Grid>
  
          <Grid item xs={8}>
            <StandartInput
              type="number"
              label="Quandiade a ser inserido"
              name="amount"
              onChange={onChange}
              value={dataProduct.amount}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              type="submit"
              className={classes.buutonStyle}
              onClick={() => onSave()}
            >
              Salvar
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider></Divider> 
    </Grid>*/}
        <Grid item xs={12}>
          <Typography variant="h4">Ajustar Estoque Por Planilha</Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            className={classes.buutonStyle}
            onClick={() => handleSelectPlanilha()}
          >
            {" "}
            Escolher Planilha
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

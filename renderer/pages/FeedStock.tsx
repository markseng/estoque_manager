import {
  Button,
  FormGroup,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";
import React, { useState, useRef } from "react";
import useStyles from "../lib/styles";
import router, { useRouter } from "next/router";
import { SelectText, StandartInput } from "../components/Inpusts";
import { SimpleDialog } from "../components/dialog";
import { ipcRenderer } from "electron";
export default function Menu() {
  const toCreacteQrCod = () => {
    const classes = useStyles();
    router.push("/CreateQrCode");
  };

  const mensagem = useRef("");
  const [openDialog, setOpenDialog] = useState(false);
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
    ];
    const pathXlsx = ipcRenderer.sendSync("getPathFile");
    const getNewProducts = ipcRenderer.sendSync("readXlsx", [
      pathXlsx,
      "ENTRADA_ESTOQUE",
      collunsRequired,
    ]);

    const itens_not_register = [];
    const getAllDescripion = getNewProducts
      .map((item) => {
        const desc = ipcRenderer.sendSync("getRow", [
          "PRODUCTS",
          { CODIGO: item.ID_PRODUTO },
        ]);
        if (!!desc) {
          return { ...item, desc: desc.DESCRICAO };
        } else {
          console.log(item.ID_PRODUTO);
          itens_not_register.push(item.ID_PRODUTO);
          return null;
        }
      })
      .filter((item) => item !== null);

    if (itens_not_register.length === 0 && !!getNewProducts) {
      const keySave = ipcRenderer.sendSync("saveRowArray", [
        "ESTOQUE_ATUAL",
        getNewProducts,
      ]);

      const getAllSave = ipcRenderer.sendSync("getRows", [
        "ESTOQUE_ATUAL",
        { key_save: keySave },
      ]);

      const descProducts = getAllDescripion.map(
        (item) =>
          `CD_PRD: ${item.ID_PRODUTO} CD_FOR: ${item.CD_FORNECEDOR} \n${item.desc}`
      );
      const QrCode = getAllSave.map((item) => item.id_db);
      console.log(itens_not_register);
      ipcRenderer.send("createQrCode", [QrCode, descProducts]);
    } else if(itens_not_register.length > 0) {
      mensagem.current = `O iten(s): ${itens_not_register.join(
        ", "
      )} não está na base de dados, adicione este(s) para está gerando os QR Code's!`;
      setOpenDialog(true);
    }else{
      mensagem.current = `Algo errado com a planilha, tente novamente!`;
      setOpenDialog(true);
    }


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
          <Typography variant="h4">Alimentar Estoque Por Planilha</Typography>
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
      <SimpleDialog
        body={mensagem.current}
        onClose={() => setOpenDialog(false)}
        open={openDialog}
      />
    </div>
  );
}

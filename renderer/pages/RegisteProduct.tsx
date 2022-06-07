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
export default function RegisteProduct() {
  const classes = useStyles();
  const handleSelectPlanilhaProducts = () => {
    const collunsRequired = [
      "CODIGO",
      "DESCRICAO",
      "UNIDADE_DE_MEDIDA",
      "SAIDA_PADRAO",
      "ESTOQUE_MINIMO",
      "ESTOQUE_MAXIMO",
      "CATEGORIA",
    ];
    const pathXlsx = ipcRenderer.sendSync("getPathFile");
    const getNewProducts = ipcRenderer.sendSync("readXlsx", [
      pathXlsx,
      "PRODUTO",
      collunsRequired,
    ]);
    if (!!getNewProducts) {
      ipcRenderer.sendSync("clearAll", "PRODUCTS");
      const succSave = ipcRenderer.sendSync("saveRowArray", [
        "PRODUCTS",
        getNewProducts,
      ]);
      console.log(succSave);
    }

    console.log(getNewProducts);
  };

  const handleSelectPlanilhaFornecedores = () => {
    const collunsRequired = [
      "CD_FORNECEDOR",
      "DESCRICAO",
      "ENDERECO",
      "TELEFONE",
    ];
    const pathXlsx = ipcRenderer.sendSync("getPathFile");
    const getNewProducts = ipcRenderer.sendSync("readXlsx", [
      pathXlsx,
      "BASE_FORNECEDOR",
      collunsRequired,
    ]);
    if (!!getNewProducts) {
      ipcRenderer.sendSync("clearAll", "FORNECEDORES");
      const succSave = ipcRenderer.sendSync("saveRowArray", [
        "FORNECEDORES",
        getNewProducts,
      ]);
      console.log(succSave);
    }

    console.log(getNewProducts);
  };
  const handleSelectPalcProd_Forn = () => {
    const collunsRequired = [
      "CD_PRODUTO",
      "CD_FORNCEDOR",
      "DS_PRODUTO_FORNECEDOR",
      "VALOR_UNITARIO",
    ];
    const pathXlsx = ipcRenderer.sendSync("getPathFile");
    const getNewProducts = ipcRenderer.sendSync("readXlsx", [
      pathXlsx,
      "PRODUTO_FORNECEDOR",
      collunsRequired,
    ]);
    if (!!getNewProducts) {
      ipcRenderer.sendSync("clearAll", "PRD_FOR");
      const succSave = ipcRenderer.sendSync("saveRowArray", [
        "PRD_FOR",
        getNewProducts,
      ]);
      console.log(succSave);
    }

    console.log(getNewProducts);
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
        <Grid item xs={12}>
          <Typography variant="h4">Cadastrar Produto Por Planilha</Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            className={classes.buutonStyle}
            onClick={() => handleSelectPlanilhaProducts()}
          >
            {" "}
            Escolher Planilha de Produtos
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            className={classes.buutonStyle}
            onClick={() => handleSelectPlanilhaFornecedores()}
          >
            {" "}
            Escolher Planilha de Fornecedores
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            className={classes.buutonStyle}
            onClick={() => handleSelectPalcProd_Forn()}
          >
            {" "}
            Produto / Forncedor
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

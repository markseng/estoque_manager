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
    total_amont: 0,
  });
  const getPoduct = () => {
    const newProduct = ipcRenderer.sendSync("getRow", [
      "feedstock",
      { CODIGO: parseInt(dataProduct.id) },
    ]);

    const newProductSaldo = ipcRenderer.sendSync("getRows", [
      "balance_stock",
      { ID_PRODUTO: parseInt(dataProduct.id) },
    ]);
    if (!!newProduct) {
      const new_total_amount = newProductSaldo.reduce(
        (a, b) => a + parseInt(b.QUANTIDADE_ENTRADA),
        0
      );
      console.log(new_total_amount);
      setDataProduct({
        ...dataProduct,
        DESCRICAO: newProduct.DESCRICAO,
        total_amont: new_total_amount,
      });
    }
    console.log(newProductSaldo);
  };
  const onChange = ({ target }) => {
    const { name, value } = target;
    let actualData = dataProduct;
    actualData[name] = value;
    setDataProduct({ ...actualData });
  };
  const onSave = () => {
    if (
      dataProduct.DESCRICAO !== "" &&
      dataProduct.amount <= dataProduct.total_amont
    ) {
      let saldo = dataProduct.total_amont;
      let finish = false;
      const newProductSaldo = ipcRenderer.sendSync("getRows", [
        "balance_stock",
        { ID_PRODUTO: parseInt(dataProduct.id) },
      ]);
      const toDecrease = newProductSaldo.map((item, i) => {
        const saldoAtual = i === 0 ? dataProduct.amount : saldo;
        const result =
          saldo != 0 ? saldoAtual - parseFloat(item.QUANTIDADE_ENTRADA) : 0;
        console.log(saldo, 0);
        if (result < 0) {
          saldo = 0;
          finish = true;
          return { ...item, QUANTIDADE_ENTRADA: result * -1 };
        } else if (result > 0 && saldo !== 0) {
          saldo = result;
          return { ...item, QUANTIDADE_ENTRADA: 0 };
        } else if (result === 0 && !finish) {
          console.log(finish);
          finish = true;
          return { ...item, QUANTIDADE_ENTRADA: 0 };
        } else if (result === 0) {
          return item;
        }
      });

      toDecrease.map((item) => {
        console.log(item.id)
        ipcRenderer.sendSync("updateData", [
          "balance_stock",
          { id_db: item.id_db },
          item,
        ]);
        ipcRenderer.sendSync("saveRow", ["history_consume", item]);
       });

      console.log(toDecrease);
      // console.log(toDecrease)

      setDataProduct({
        id: "",
        amount: 0,
        DESCRICAO: "",
        total_amont: 0,
      });
    }
  };

  const handleSelectPlanilha = () => {
    const succ = ipcRenderer.sendSync("getFeedStockXlsx");
    console.log(succ);
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
        <Grid xs={12}>
          <Typography variant="h4">Produto: {dataProduct.DESCRICAO}</Typography>
        </Grid>
        <Grid xs={12}>
          <Typography variant="h4">Saldo: {dataProduct.total_amont}</Typography>
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
            label="Quandiade a ser Consumida  "
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
      </Grid>
    </div>
  );
}

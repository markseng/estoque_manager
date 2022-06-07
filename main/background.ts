import {
  app,
  ipcMain,
  dialog,
  nativeImage,
  BrowserWindow,
  globalShortcut,
  Notification,
} from "electron";
import execeljs from "exceljs";
import path from "path";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import xlsx from "xlsx";
import CreatePFD from "./helpers/createPdf";
import StartFireBase from "./helpers/fireBase";
import { autoUpdater } from "electron-updater";
import ReadXlsx from "./helpers/readXlsx";
import fs from "fs/promises";
import log from "electron-log";
import {
  getAllData,
  updateData,
  insertData,
  clearAll,
  getRow,
  deleteRow,
  getRows,
  cretateTable,
  setupNewSetup,
} from "./helpers/database";
import { v4 as uuidv4 } from "uuid";

// import PDFDocument from 'pdfkit'

// import { autoUpdater } from "electron-updater"

// autoUpdater.requestHeaders = { "PRIVATE-TOKEN": "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" };
// autoUpdater.autoDownload = true;
// keypress(process.stdin);
// autoUpdater.logger = log
// process.stdin.on("keypress", function (ch, key) {
//   console.log('got "keypress"', key);
//   if (key && key.ctrl && key.name == "c") {
//     process.stdin.pause();
//   }
// });
let firstEnter = true;
let onDelay = true;
log.info("App starting...");
const pathHtmlCode = path.join(__dirname, "../code_scanner/index.html");
const icon = nativeImage.createFromPath(
  path.join(__dirname, "../resources/icon.png")
);

const pathSound = path.join(__dirname, "../resources/sucess.mp3");
const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}
let mainWindow: BrowserWindow | null;
let mainWindow_2: BrowserWindow | null;
(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    icon,
  });

  if (isProd) {
    await mainWindow.loadURL(`app://./home.html#v${app.getVersion()}`);
    await autoUpdater.checkForUpdatesAndNotify();
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    await autoUpdater.checkForUpdatesAndNotify();
  }

  // mainWindow_2 = createWindow("code", {
  //   width: 100,
  //   height: 100,
  //   show: true,
  // });
  // mainWindow_2.setMenu(null);
  // await mainWindow_2.loadFile(pathHtmlCode);
})();

app.whenReady().then(() => {
  globalShortcut.register("#", async () => {
    // if (firstEnter && onDelay && mainWindow_2 == null) {
    if (mainWindow_2 == null || mainWindow_2.isDestroyed()) {
      onDelay = false;

      // mainWindow_2.webContents.openDevTools();
      setTimeout(async () => {
        mainWindow_2 = createWindow("code", {
          width: 100,
          height: 100,
          show: true,
        });
        mainWindow_2.setMenu(null);

        await mainWindow_2.loadFile(pathHtmlCode);
        mainWindow_2.focus();
      }, 2000);
      setTimeout(() => {
        onDelay = true;
      }, 3000);
      firstEnter = false;
      // setTimeout(()=>{
      //   firstEnter = true
      // }, 10000)
    } else if (mainWindow_2 !== null && !mainWindow_2.isDestroyed()) {
      mainWindow_2.focus();
    }
  });
});

ipcMain.on("setupBase", async (ev, data) => {
  const openDirectory = dialog.showOpenDialogSync(mainWindow, {
    properties: ["openDirectory"],
  });

  const files = await fs.readdir(openDirectory[0]);
  const fileName = files.map((item) => path.basename(item));
  const tablesRequires = [
    "ESTOQUE_ATUAL",
    "FORNECEDORES",
    "PRD_FOR",
    "PRODUCTS",
    "SETUP",
    "HISTORICO_CONSUMO",
  ];

  console.log(fileName);
  const createTables = tablesRequires.map(async (file) => {
    console.log(fileName.indexOf(file));
    if (fileName.indexOf(file) === -1) {
      await cretateTable(openDirectory[0], file);
    }
  });

  await Promise.all(createTables);
  try {
    await setupNewSetup(openDirectory[0]);
  } catch (err) {
    console.log(err);
  }

  await insertData("SETUP", { pathDirectory: openDirectory[0] });
  console.log(files);
  ev.returnValue = true;
});

ipcMain.on("testeCode", async (ev, data) => {
  console.log("teste ", data);

  mainWindow_2.focus;
  if (mainWindow_2 !== null) {
    const product = await getRow("ESTOQUE_ATUAL", { id_db: data });
    const { SAIDA_PADRAO } = await getRow("PRODUCTS", {
      CODIGO: product.ID_PRODUTO,
    });
    console.log(SAIDA_PADRAO);
    const isCurret = SAIDA_PADRAO <= product.QUANTIDADE_ENTRADA;
    if (isCurret) {
      const lessAmount = product.QUANTIDADE_ENTRADA - SAIDA_PADRAO;
      updateData(
        "ESTOQUE_ATUAL",
        { id_db: data },
        { ...product, QUANTIDADE_ENTRADA: lessAmount }
      );

      insertData("HISTORICO_CONSUMO", {
        ...product,
        ESTOQUE_ATUAL: lessAmount,
        DATA_CONSUMO: new Date(),
        QUANTIDADE_SAIDA: SAIDA_PADRAO
      });
    }
    const msg = isCurret
      ? "Arquivo Salvo Com Sucesso"
      : "Há algo errado, não foi posssível dar baixa no estoque";

    console.log(data);
    const not = new Notification({
      title: msg,
      sound: pathSound,
    });

    not.show();

    mainWindow_2.destroy();

    setTimeout(() => {
      firstEnter = true;
    }, 1000);
    mainWindow_2 = null;
  }
});
ipcMain.on("getPathFile", (ev, data) => {
  try {
    const di = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openFile"],
    });

    ev.returnValue = di[0];
  } catch (err) {
    ev.returnValue = null;
  }
});

ipcMain.on("createNewProducts", async (ev, pathFile: string) => {
  const collunsRequired = [
    "CODIGO",
    "DESCRICAO",
    "UNIDADE_DE_MEDIDA",
    "SAIDA_PADRAO",
    "ESTOQUE_MINIMO",
    "ESTOQUE_MAXIMO",
  ];

  const dataXlsx = await ReadXlsx(pathFile, "DADOS_ESTOQUES", collunsRequired);

  await clearAll("PRODUCTS");

  if (dataXlsx.succ) {
    const saveData = dataXlsx.data.map(
      async (row: object) => await insertData("PRODUCTS", row)
    );
    await Promise.all(saveData);
    ev.returnValue = true;
  } else {
    ev.returnValue = false;
  }
});
ipcMain.on("readXlsx", async (ev, [pathFile, nameSheet, collunsRequired]) => {
  // const collunsRequired = [
  //   "CODIGO",
  //   "DESCRICAO",
  //   "UNIDADE_DE_MEDIDA",
  //   "SAIDA_PADRAO",
  //   "ESTOQUE_MINIMO",
  //   "ESTOQUE_MAXIMO",
  // ];

  const dataXlsx = await ReadXlsx(pathFile, nameSheet, collunsRequired);

  if (dataXlsx.succ) {
    ev.returnValue = dataXlsx.data;
  } else {
    ev.returnValue = null;
  }
});

ipcMain.on("fixStock", async (ev, data: [any]) => {
  const saveFix = data.map(async ({ QUANTIDADE_AJUSTADA, key_save, id_db }) => {
    if (!!QUANTIDADE_AJUSTADA || QUANTIDADE_AJUSTADA === 0) {
      console.log(QUANTIDADE_AJUSTADA);
      try {
        await updateData(
          "ESTOQUE_ATUAL",
          { id_db },
          { QUANTIDADE_ENTRADA: QUANTIDADE_AJUSTADA }
        );
      } catch {
        return null;
      }
    }
  });

  await Promise.all(saveFix);
  ev.returnValue = true;
});

ipcMain.on("saveRowArray", async (ev, [nameTable, data]) => {
  const key_save = uuidv4();
  const DATA_SAVE = new Date();
  const saveData = data.map(
    async (row: object) =>
      await insertData(nameTable, { ...row, key_save, DATA_SAVE })
  );
  await Promise.all(saveData);
  ev.returnValue = key_save;
});

const appFireBase = StartFireBase();

app.on("window-all-closed", () => {
  app.quit();
});
ipcMain.on("getPlan", async (ev, data) => {
  const ColumnsReferencia = [
    "CODIGO",
    "DESCRICAO",
    "GRUPO",
    "UNIDADE_DE_MEDIDA",
    "ORIGEM",
    "PERECIVEL",
    "PESO_ITEM",
    "IMPERMIALVEL",
    "PRAZO_DE_VALIDADE_(DIAS)",
    "TEMPERATURA_MAXIMA_SUPORTADA",
    "ESTOUE_MAXIMO",
    "LOTE_ECONOMICO",
    "ESTOQUE_MINIMO",
    "TEMPO_RESSUPRIMENTO",
    "ALTURA_(M)",
    "LARGURA_(M)",
    "PROFUNDIDADE_(M)",
    "CUSTO",
    "EMPILHAMENTO_MAXIMO",
    "LOCALIZAÇÃO_PADRAO_DE_ENTRADA",
    "LOCALIZAÇÃO_REAL",
    "NIVEL_1",
    "NIVEL_3",
    "NIVEL_4",
    "NIVEL_5",
    "FORNECEDOR",
  ];
  const ColumnsQrCode = [
    "CODIGO",
    "DESCRICAO",
    "QUANTIDADE",
    "COLABORADOR",
    "ALMOXARIFE",
  ];
  const unit = [
    "m",
    "cm",
    "mm",
    "kg",
    "g",
    "mg",
    "L",
    "ml",
    "“",
    "m2",
    "m3",
    "ml",
    "un",
  ];

  try {
    const di = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openFile"],
    });
    const workbook = xlsx.readFile(di[0]);
    const Dados_Stock = xlsx.utils.sheet_to_json(
      workbook.Sheets["DADOS_ESTOQUES"]
    );
    const Requesters = xlsx.utils.sheet_to_json(
      workbook.Sheets["DADOS_REQUESITANTE"]
    );
    const DADOS_FORNECEDORES = xlsx.utils.sheet_to_json(
      workbook.Sheets["DADOS_FORNECEDORES"]
    );

    let CheckUnidade = true;
    // Dados_Stock.forEach(({ UNIDADE_DE_MEDIDA }) => {
    //   console.log(UNIDADE_DE_MEDIDA)
    //   if (CheckUnidade) {
    //     CheckUnidade = unit.indexOf(UNIDADE_DE_MEDIDA) !== -1 ? true : false
    //   }
    // })
    if (CheckUnidade) {
      const DataQRCode = Dados_Stock.map(
        ({
          CODIGO,
          DESCRICAO,
          UNIDADE_DE_MEDIDA,
          LOCALIZAÇÃO_PADRAO_DE_ENTRADA,
        }) => ({
          CODIGO,
          DESCRICAO,
          UNIDADE_DE_MEDIDA,
          LOCALIZAÇÃO_PADRAO_DE_ENTRADA,
          QUANTIDADE: "",
          REQUISITANTE: "",
          ALMOXARIFE: "",
        })
      );

      await clearAll("feedstock");
      const saveData = Dados_Stock.map(
        async (item: object) => await insertData("feedstock", item)
      );

      await Promise.all(saveData);

      ev.returnValue = {
        DataQRCode: DataQRCode,
        Dados_Stock: Dados_Stock,
        Requesters: Requesters,
        DADOS_FORNECEDORES: DADOS_FORNECEDORES,
      };
    } else {
      ev.returnValue = "Há unidade não reconhecida";
    }
  } catch {
    ev.returnValue = "";
  }
});

interface dataQrCode {
  description: string;
  inputs: [];
  staticValues: object;
}

ipcMain.on("CeckProd", (ev, data) => {
  ev.returnValue = isProd;
});

ipcMain.on("auth", async (ev, { email, password }) => {
  try {
    const resolve = await appFireBase
      .auth()
      .signInWithEmailAndPassword(email, password);
    console.log(resolve);
    ev.returnValue = JSON.stringify(resolve.user);
    // ev.reply('teste', JSON.stringify(resolve))
  } catch (err) {
    ev.returnValue = JSON.stringify(err);
    console.log(err);
  }
});

ipcMain.on("createQrCode", async (ev, data) => {
  const [valuesQrCode, desCriptionLabel] = data;
  const openDirectory = dialog.showOpenDialogSync(mainWindow, {
    properties: ["openDirectory"],
  });
  await CreatePFD(
    valuesQrCode,

    desCriptionLabel,
    openDirectory[0],
    "qrCode"
  );
  // await CreatePFD(Requesters, "Requisitantes_QrCode", "NOME", openDirectory[0]);
  // ev.reply("setProgress", 100);
});

ipcMain.on("getCloudData", async (ev, company) => {
  try {
    const responseConsume = await appFireBase
      .firestore()
      .collection(`${company}_apt_consumo`)
      .get();
    const responseFeed = await appFireBase
      .firestore()
      .collection(`${company}_apt_feed`)
      .get();

    let DataConsume = [];
    responseConsume.forEach((doc) => {
      DataConsume.push({ ...doc.data(), idFireStone: doc.id });
    });
    let DataFeed = [];
    responseFeed.forEach((doc) => {
      DataFeed.push({ ...doc.data(), idFireStone: doc.id });
    });
    ev.returnValue = {
      succ: true,
      data: [DataConsume, DataFeed],
    };
  } catch (err) {
    ev.returnValue = {
      succ: false,
      msg: err,
    };
  }
});

ipcMain.on("deleteFireStone", (ev, idFireStone, company, table) => {
  if (table === "comsume") {
    appFireBase
      .firestore()
      .collection(`${company}_apt_consumo`)
      .doc(idFireStone)
      .delete()
      .then(() => {
        ev.returnValue = true;
      })
      .catch(() => {
        ev.returnValue = false;
      });
  } else {
    appFireBase
      .firestore()
      .collection(`${company}_apt_feed`)
      .doc(idFireStone)
      .delete()
      .then(() => {
        ev.returnValue = true;
      })
      .catch(() => {
        ev.returnValue = false;
      });
  }
});

ipcMain.on("exportXlsx", (ev, data) => {
  const newWB = xlsx.utils.book_new();
  const newWS = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(newWB, newWS, "dados");
  try {
    const di = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openDirectory"],
    });
    xlsx.writeFile(newWB, `${di[0]}\\${"apontamento"}.xlsx`);
    ev.returnValue = "ok";
  } catch {
    ev.returnValue = "err";
  }
});
app.on("ready", (ev, data) => {});

function sendStatusToWindow(text) {
  log.info(text);
  console.log("testeste");
  mainWindow.webContents.send("message", text);
}

ipcMain.on("checkUpdate", async (ev, data) => {
  await autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded");
});

ipcMain.on("updateData", async (ev, data) => {
  const [tableName, key, newData] = data;
  try {
    const resolve = await updateData(tableName, key, newData);
    // console.log(resolve);
    ev.returnValue = resolve;
  } catch (err) {
    ev.returnValue = err;
    // console.log(err);
  }
});
ipcMain.on("saveData", async (ev, data) => {
  const currentPath = (ev.returnValue = await insertData("Group", data));
});
ipcMain.on("saveRow", async (ev, [nameTable, data]) => {
  ev.returnValue = await insertData(nameTable, data);
});

ipcMain.on("getAllData", async (ev, data) => {
  ev.returnValue = await getAllData(data);
});
ipcMain.on("clearAll", async (ev, data) => {
  await clearAll(data);
  ev.returnValue = true;
});
ipcMain.on("deleteData", async (ev, [tableName, key]) => {
  try {
    ev.returnValue = await deleteRow(tableName, key);
  } catch (err) {
    ev.returnValue = err;
  }
});

ipcMain.on("getRow", async (ev, [nameTable, key]) => {
  ev.returnValue = await getRow(nameTable, key);
});
ipcMain.on("getRows", async (ev, [nameTable, key]) => {
  ev.returnValue = await getRows(nameTable, key);
});

ipcMain.on("getFeedStockXlsx", async (ev, data) => {
  const di = dialog.showOpenDialogSync(mainWindow, {
    properties: ["openFile"],
  });
  console.log(di[0]);
  const collunsRequired = ["ID_PRODUTO", "QUANTIDADE_ENTRADA"];
  if (!!di[0]) {
    const dataXlsx = await ReadXlsx(di[0], "ENTRADA_ESTOQUE", collunsRequired);
    console.log(dataXlsx);
    console.log(dataXlsx);

    const saveData = dataXlsx.data.map(async (item: object) => {
      await insertData("balance_stock", { ...item, DATE: new Date() });
      await insertData("history_consume", { ...item, DATE: new Date() });
    });
    await Promise.all(saveData);

    ev.returnValue = dataXlsx;
  } else {
    ev.returnValue = false;
  }
});

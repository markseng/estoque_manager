import xlsx from "xlsx";

export default async function ReadXlsx(
  pathXlsx: string,
  nameSheet: string,
  requiredColumns: Array<string>
) {
  try {
    const workbook = xlsx.readFile(pathXlsx);
    const ws = xlsx.utils.sheet_to_json(workbook.Sheets[nameSheet]);
    const columsXlsx = Object.keys(ws[0]);
    const CHECK = columsXlsx.reduce((a: boolean, b) => {
      if (a) {
        return requiredColumns.indexOf(b) !== -1;
      } else {
        return false;
      }
    }, true);

    if (CHECK) {
      return {
        succ: true,
        msg: "",
        data: ws,
      };
    } else {
      return {
        succ: false,
        msg: "Planilha não está dendtro da especificação",
      };
    }
  } catch (err) {
      console.log(err)
    return {
      succ: false,
      msg: "Planilha não está dendtro da especificação",
    };
  }
}

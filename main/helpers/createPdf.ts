import qrcode from "qrcode";
import { PDFDocument } from "pdf-lib";
import fsPromises from "fs/promises";
import LZUTF8 from "lzutf8";

const CreatePFD = async (
  newDataRrCode,
  desciption: Array<string>,
  openDirectory,
  nameFile: string
) => {
  const pdfDoc = await PDFDocument.create();


  console.log(newDataRrCode);
  for (const [i, row] of newDataRrCode.entries()) {
    let page = pdfDoc.addPage([340.15748031, 113.38582677]);
   
    try {
      const byteQrCode = await qrcode.toBuffer(`#${row}`);
      const pngImage = await pdfDoc.embedPng(byteQrCode);

      page.drawImage(pngImage, {
        x: 10,
        y: 5,
        width: 100,
        height: 100,
      });

      page.drawText(desciption[i], {
        size: 10,
        x: 101,
        y: 80,
      });

      // if (alternative) {
      //   page.drawImage(pngImage, {
      //     x: page.getWidth() * x,
      //     y: page.getHeight() * y,
      //     width: 150,
      //     height: 150,
      //   });

      //   if (desciption[i].length < 30) {
      //     page.drawText(desciption[i], {
      //       size: 10,
      //       x: page.getWidth() * x,
      //       y: page.getHeight() * y - page.getHeight() * 0.005,
      //     });
      //   } else {
      //     const lastIndex =
      //       desciption[i].length < 60 ? desciption[i].length : 60;
      //     console.log(lastIndex);
      //     const word_1 = desciption[i].slice(0, 30);
      //     const word_2 = desciption[i].slice(30, lastIndex);
      //     page.drawText(`${word_1}-`, {
      //       size: 10,
      //       x: page.getWidth() * x,
      //       y: page.getHeight() * y - page.getHeight() * 0.005,
      //     });
      //     page.drawText(`${word_2}`, {
      //       size: 10,
      //       x: page.getWidth() * x,
      //       y: page.getHeight() * y - page.getHeight() * 0.015,
      //     });
      //   }

      //   x = 0.5;

      //   alternative = false;
      // } else {
      //   page.drawImage(pngImage, {
      //     x: page.getWidth() * x,
      //     y: page.getHeight() * y,
      //     width: 150,
      //     height: 150,
      //   });
      //   if (desciption[i].length < 24) {
      //     page.drawText(`${desciption[i]}`, {
      //       size: 10,
      //       x: page.getWidth() * x,
      //       y: page.getHeight() * y - page.getHeight() * 0.005,
      //     });
      //   } else {
      //     const word_1 = desciption[i].slice(0, 30);
      //     const word_2 = desciption[i].slice(30, 60);
      //     page.drawText(`${word_1}-`, {
      //       size: 10,
      //       x: page.getWidth() * x,
      //       y: page.getHeight() * y - page.getHeight() * 0.005,
      //     });
      //     page.drawText(`${word_2}`, {
      //       size: 10,
      //       x: page.getWidth() * x,
      //       y: page.getHeight() * y - page.getHeight() * 0.015,
      //     });
      //   }
      //   x = 0.1;
      //   y = y - 0.2;
      //   alternative = true;
      // }

      // if (i === nuberQrCode) {
      //   page = pdfDoc.addPage([340.15748031, 113.38582677]);
      //   nuberQrCode = nuberQrCode + 1;
      //   y = 0.8;
    } catch (errr) {
      // ev.returnValue = errr
    }

  }
  const pdfBytes = await pdfDoc.save();
  await fsPromises.writeFile(`${openDirectory}/${nameFile}.pdf`, pdfBytes);
};
export default CreatePFD;

import db from "electron-db";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const locationStart = path.join(__dirname, "../database");
import fs from "fs";
import os from "os";


const clearTableMain = ()=> new Promise<any>((resolve, reject)=>{
  db.clearTable("SETUP", locationStart, (succ, msg) => {
    if (succ) {
      resolve(succ);
    } else {
      reject(msg);
    }
  });

  
})
export const setupNewSetup = (new_location: string)=> new Promise<any>(async(resolve, reject)=>{
  await clearTableMain()
  db.insertTableContent("SETUP", locationStart, {pathDirectory:  new_location}, (succ, msg) => {
    if (succ) {
      resolve(succ);
    } else {
      reject(msg);
    }
  });

  
})




const getCurretLocation = () =>
  new Promise<any>((resolve, reject) => {
    db.getAll("SETUP", locationStart, (succ: boolean, data: [any]) => {

      if (succ && data.length > 0) {
        resolve(data[0].pathDirectory);
      } else if (succ) {
        resolve(locationStart);
      } else {
        reject("erro");
      }
    });
  });

export const cretateTable = (pathDirectory: string, nameTable: string) =>
  new Promise<any>(async (resolve, reject) => {
    db.createTable(nameTable, pathDirectory, (succ, msg) => {
      if (succ) {
        resolve(succ);
      } else {
        resolve(false);
      }
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    });
  });

const getAllData = (nameTable: string) =>
  new Promise<any>(async (resolve, reject) => {
    const getLocation = await getCurretLocation();
    const location = !getLocation ? locationStart : getLocation;
    db.getAll(nameTable, location, (succ: boolean, data: []) => {
      if (succ) {
        resolve(data);
      } else {
        reject("err");
      }
    });
  });

const updateData = (nameTable: string, key: object, data: object) =>
  new Promise(async (resolve, reject) => {
    console.log(key)
    const getLocation = await getCurretLocation();
    const location = !getLocation ? locationStart : getLocation;
    console.log(location)
    db.updateRow(nameTable, location, key, data, (succ, msg) => {
      if (succ) {
        resolve(succ);
      } else {
        console.log(msg);
        reject(msg);
      }
    });
  });

export const insertData = (nameTable: string, data: object) =>
  new Promise(async (resolve, reject) => {
    const getLocation = await getCurretLocation();
    const location = !getLocation ? locationStart : getLocation;
    const newDate = { ...data, id_db: uuidv4() };

    db.insertTableContent(nameTable, location, newDate, (succ, msg) => {
      if (succ) {
        resolve(succ);
      } else {
        reject(msg);
      }
    });
  });

export const clearAll = (nameTable: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const getLocation = await getCurretLocation();

      const location = !getLocation ? locationStart : getLocation;
      console.log(location);
      db.clearTable(nameTable, location, (succ, msg) => {
        if (succ) {
          resolve(succ);
        } else {
          reject(msg);
        }
      });

      console.log(getLocation);
    } catch (err) {
      console.log("erro na data base");
      reject(err);
    }
  });

export const getRow = (nameTable: string, key: object) =>
  new Promise<any>(async (resolve, reject) => {
    const getLocation = await getCurretLocation();
    const location = !getLocation ? locationStart : getLocation;
    db.getRows(nameTable, location, key, (succ, result) => {
      if (succ) {
        resolve(result[0]);
      } else {
        reject("err");
      }
    });
  });

export const deleteRow = (nameTable: string, key: object) =>
  new Promise<any>(async (resolve, reject) => {
    const getLocation = await getCurretLocation();
    const location = !getLocation ? locationStart : getLocation;
    db.deleteRow(nameTable, location, key, (succ, msg) => {
      if (succ) {
        resolve(succ);
      } else {
        reject(msg);
      }
    });
  });

export const getRows = (nameTable: string, key: object) =>
  new Promise<any>(async (resolve, reject) => {
    const getLocation = await getCurretLocation();
    const location = !getLocation ? locationStart : getLocation;
    db.getRows(nameTable, location, key, (succ, result) => {
      if (succ) {
        resolve(result);
      } else {
        reject("err");
      }
    });
  });

export { getAllData, updateData };

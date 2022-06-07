import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC2DhoZcxmSXC7EGNFUJv4Qza__DinW39A",
    authDomain: "electron-teste-fe12e.firebaseapp.com",
    databaseURL: "https://electron-teste-fe12e.firebaseio.com",
    projectId: "electron-teste-fe12e",
    storageBucket: "electron-teste-fe12e.appspot.com",
    messagingSenderId: "315431251835",
    appId: "1:315431251835:web:c8670d6a56ee3a3997d7de",
};
export default function StartFireBase() {
    const appFireBase = firebase.initializeApp(firebaseConfig)


    return appFireBase

}
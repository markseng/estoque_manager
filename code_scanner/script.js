const {ipcRenderer} = require('electron')
const path = require('path')
path.join(__dirname, "../resources/icon.png")
let buffer = ''
document.addEventListener('keypress', event => {
  let data = buffer || '';
  data += event.key;
  buffer = data;
data = data.replaceAll('Enter', "")


console.log(data.length)

  if (data.length === 36){
    buffer = ''
    console.log(data)
    ipcRenderer.send('testeCode', data)



   
    
  }

  // if (event.key !== 'Enter') { // barcode ends with enter -key
  //   data += event.key;
  //   buffer = data;
  // } else {
  //   buffer = '';
  //   console.log(data); // ready barcode ready for a use
  //   ipcRenderer.send('testeCode', data)
  // }

  // ipcRenderer.send('testeCode', data)
});
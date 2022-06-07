import { ipcRenderer } from "electron";
interface porpsStepTwo {
  listInputs: Array<object>;
}
//// pegar informações da planilha
export const StepOne = () => {
  const newPath = <string>ipcRenderer.sendSync("getPlan");
  return newPath;
};
const Check = ()=>{
    return true
}

export function StepTwo(props: porpsStepTwo) {
  const { listInputs } = props;
  const innitialValues = { name: "", type: "", label: "", value: "" };
  return {
    addInput: () => {
      return [...listInputs, innitialValues];
    },
    removeInputs: () => {
      listInputs.splice(listInputs.length - 1, 1);
      return listInputs;
    },
    handleOnChange: (e: {value: string, name: string, index: number })=>{
        const {value, name, index} = e
        return listInputs[index][name] = value
 
    }, 
    allowNextStep: ()=>{
        return Check()
    }
    
  };
}

// export  default function handleNextStep ({step}){

// switch(step){
//     case 1:
//         return StepOne()
//     case 2:
// }

// }

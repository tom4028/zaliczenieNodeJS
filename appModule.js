const fs = require('fs');
const axios = require('axios');

const file = 'zadania.json';

const app = {};

app.init=async ()=>{
    let res = await[
        "Co chcesz zrobić:??",
        "Wyświetl listę zadań np(--zad list)",
        "Dodaj nowe zadanie np(--zad add --kat zakupy --cel 'kupić masło')",
        "Zmień status: np(--zad changeStatus --id id --wykonanie true)",
        "Usun zadanie np(--zad usun --id id)",
        "Wyśwetl kategorię zadań np(--kat 'zakupy')",
        "Wyśwetl zadania zrobione np(--status true or false)",
        "Wyślij lub pobierz dane na/z server np(app.js --upload)"];
    return res;
}
app.upload = async (url)=>{
    app.aktualizacjaZadan(file).then(res=>{
            listaZadan = JSON.parse(res);
            axios.post(url,listaZadan);      
    })
    return "Uploaded."
}
app.download = async()=>{
    let result = await axios(url);
    return result.data;

}

app.aktualizacjaZadan =  async (fileName)=>{
     return new Promise((resolve,reject)=>{
         fs.readFile(fileName,'utf8',(err,data)=>{
             if(err) reject(err); else resolve(data);
         })
     })
    
}

app.zapisDoPliku = async (fileName,data)=>{
    return new Promise((reject)=>{
        fs.writeFile(fileName,data,(err)=>{
            if(err) reject(err);
        })
    })
}


app.lista = async (fileName)=>{
    return new Promise((resolve,reject)=>{
        fs.readFile(fileName,'utf8',(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
    
}


app.dodaj = async (newZad)=>{
    await app.aktualizacjaZadan(file).then(res=>{
        listaZadan = JSON.parse(res);
        newZad.id = listaZadan.length+1;
        listaZadan.push(newZad);
        app.zapisDoPliku(file,JSON.stringify(listaZadan)).catch(err=>console.log(err));
    });
    return 'Zadanie dodane';
}

app.zmienStatus = async (id,status)=>{

   await app.aktualizacjaZadan(file).then(res=>{
        listaZadan = JSON.parse(res);
        let zadDoZmiany = listaZadan.filter(z=>z.id === id);
        let indexZad = listaZadan.map(z=>z.id).indexOf(id);
        listaZadan[indexZad] = {
            id:zadDoZmiany[0].id,
            kategoria:zadDoZmiany[0].kategoria,
            wykonanie:Boolean(status),
            cel:zadDoZmiany[0].cel
        }
        app.zapisDoPliku(file,JSON.stringify(listaZadan)).catch(err=>console.log(err));
    })
        return 'Status zmieniony';
        
}

app.usun = async(id) =>{

    await app.aktualizacjaZadan(file).then(res=>{
        
        listaZadan = JSON.parse(res);
        let indexZad = listaZadan.map(z=>z.id).indexOf(id);
        if(indexZad >0){
        listaZadan.splice(indexZad,1);
        }
        app.zapisDoPliku(file,JSON.stringify(listaZadan)).catch(err=>console.log(err));
    });
    return "zadanie usunięte.";
    
}

module.exports = app;
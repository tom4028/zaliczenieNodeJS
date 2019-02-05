
const yargs =require('yargs').argv;


const app = require('./appModule');

const file = 'zadania.json';
const url = `http://api.quuu.linuxpl.eu/todo/sqinxxti`;



try {
    //Wyśwetla listę zadań
    if (yargs.zad === "list") {
        if (yargs.zad === undefined) {

        } else {
            app.lista(file).then(res => {
                console.log(JSON.parse(res));
            });
        }
        //Dodaje nowe zadanie
    } else if (yargs.zad === 'add') {

        let newZad = {
            kategoria: yargs.kat,
            cel: yargs.cel,
            wykonanie: false
        }
        app.dodaj(newZad)
            .then(res => {
                if (res === undefined) {
                    app.init().then(res => {
                        res.forEach(r => {
                            console.log(r, '\r\n');
                        })
                    });
                } else {
                    console.log(res);
                }

            });
            //Zmienia status zadania 
    } else if (yargs.zad === 'changeStatus') {
        let id = yargs.id;
        let status = yargs.wykonanie;
        app.zmienStatus(id, status).then(res => console.log(res));
        //Usuwa zadanie
    } else if (yargs.zad === 'delete') {
        let id = yargs.id;
        app.usun(id).then(res => console.log(res));
        //Aktualizuje id zadań
        app.aktualizacjaZadan(file).then(res=>{
            listaZadan = JSON.parse(res);
            for(let i=0;i<listaZadan.length;i++){
                listaZadan[i].id = i+1;
            }
            app.zapisDoPliku(file,JSON.stringify(listaZadan)).catch(err=>console.log(err));
        })

        //Wyśwetla zdania wg kategorii
    } else if (yargs.kat) {
        app.aktualizacjaZadan(file).then(res => {
            listaZadan = JSON.parse(res);
            let filteredList = listaZadan.filter(z => z.kategoria === yargs.kat);

            filteredList.forEach(f => console.log(f));
        })
    }
    //Wyśwetla zadania wg wykonania
    else if (yargs.wykonanie) {
        app.aktualizacjaZadan(file).then(res => {
            listaZadan = JSON.parse(res);
            if (yargs.wykonanie === 'false') {
                let filteredList = listaZadan.filter(zad => !zad.wykonanie);
                //console.log(filteredList);

                filteredList.forEach(f => console.log(f));
            } else {
                let filteredList = listaZadan.filter(zad => zad.wykonanie);
                //console.log(filteredList);
                filteredList.forEach(f => console.log(f));
            }

        })
        //Wyśwetla pomoc
    } else if (yargs.help === 'help') {
        app.init().then(res => {
            res.forEach(r => console.log(r, '\r\n'));
        });
        //Przesyła dane na server
    } else if (yargs.upload) {
        app.upload(url).then(res => console.log(res));
    }
    //aktualizuje zdania.js z servera na dysk
    else if (yargs.download) {
        app.download().then(res => {
            app.zapisDoPliku(file, JSON.stringify(res)).catch(err => console.log(err));
        });
    }
    //jak coś pójdzie nie tak to to się wyświetli
    else {
        app.init().then(res => {
            res.forEach(r => console.log(r, '\r\n'));
        });
    }
} catch (err) {
    console.log(err.message);
    app.init().then(res => {
        res.forEach(r => console.log(r, '\r\n'));
    });
}
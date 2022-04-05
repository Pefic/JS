  //Funzione per aggiungere un nuovo ristorante all'elenco
  function salvaRistorante(form, risultato){
    let clientHttp = new HttpClient();
    //creazione di un nuovo ristorante
    if (form.elements["id"] === null || form.elements["id"] === undefined){
        clientHttp.post('https://ifts.adriasonline.com/ristoranti', formToJson(form))
        .then((result) => {
          risultato.innerHTML = "Ristorante aggiunto correttamente!";
          risultato.className = "alert alert-success";
          form.reset();
        })
        .catch((error) => stampaMessaggio(error, risultato));
        //modifica di un ristorante gia esistente
     } else {
         clientHttp.put('https://ifts.adriasonline.com/'+form.elements["id"].value+'/ristoranti', formToJson(form))
         .then((result) => {
           risultato.innerHTML = "Ristorante modificato correttamente!";
          risultato.className = "alert alert-success";
        })
         .catch((error) => stampaMessaggio(error, risultato));
     }
  }

  // //funzione per la modifica del ristorante
  //   function modificaRistorante(form,risultato){
  //   let clientHttp = new HttpClient();
  //   clientHttp.put('https://ifts.adriasonline.com/ristoranti/'+form.elements["id"], formToJson(form))
  //     .then((result)=>{
  //       risultato.innerHTML="Ristorante modificato correttamente!";
  //       risultato.className = "alert alert-success";
  //     })
  //     .catch((error)=>stampaMessaggio(error,risultato));
  // }

  //Funzione per caricare il ristorante per la visualizzazione
  function caricaRistorante(id, risultato){
    let client = new HttpClient();
    client.get('https://ifts.adriasonline.com/ristoranti/' + id)
        .then((result) => {
            for(let attr in result){
              if(result[attr] != null){
                document.getElementById(attr).value = result[attr];
              } else document.getElementById(attr).value = '';
            }
        })
        .catch((error) => stampaMessaggio(error, risultato));
  }

  //funzione per caricare i stistorante nell'html
  function caricaRistoranti(risultato){
    let client = new HttpClient();
    //document.getElementById("spinner").className = "spinner-border";
    client.get('https://ifts.adriasonline.com/ristoranti')
        .then((result) => stampaRistoranti(result, risultato))
        .catch((error) => stampaMessaggio(error, risultato));
        //.finally(() => document.getElementById("spinner").className = "d-none");
  }

  function stampaRistoranti(ristoranti, risultato) {
    var rubrica = document.getElementById("ristoranti");
    rubrica.innerHTML = "<div class='row text-light bg-dark'><div class='col h4'>Nome</div><div class='col h4'>Indirizzo</div><div class='col h4'>Citta</div><div class='col h4'>Numero di telefono</div><div class='col h4'>Sito Web</div></div><div class='col h4'>Azioni</div></div>";
    for (var i = 0; i < ristoranti.length; i++) {
      var ristorante = ristoranti[i];
      var divRow = document.createElement("div");
      if (i % 2 == 0) {
        divRow.className = "row text-light bg-secondary";
      } else {
        divRow.className = "row bg-light";
      }
      var numeroTel = "--";
      if (ristorante.numeroDiTelefono !== null){
        numeroTel = ristorante.numeroDiTelefono;
      }
      var media = 0;
      var numero = 0;
      for(var x = 0;x<ristorante.recensioni.length; x++){
        var recensione = ristorante.recensioni[x];
          media += recensione.voto;
          numero ++;
      }
      media = (media/numero);
      if(numero == 0){
        media = 0;
      }
      divRow.innerHTML = "<div class='col-md border'>" + ristorante.nome + "</div>" 
      + "<div class='col-md border'>" + ristorante.indirizzo + "</div>" 
      + "<div class='col-md border'>" + ristorante.citta + "</div>" 
      + "<div class='col-md border'>" + numeroTel + "</div>"
      +"<div class='col-md border'>" + ristorante.sitoWeb + "</div>"
      +"<div class='col-md border'> voto medio del ristorante: " + Math.floor(media) + "</div>"
      +"<div class='col-md border'>numero di recensione/i del ristorante: " + numero + "</div>";

      var divButton = document.createElement("div");
      divButton.className = "col-md border";
      var deleteIcon = document.createElement("button");
      deleteIcon.className = "btn btn-danger";
      deleteIcon["data-id"] = ristorante.id;
      deleteIcon.onclick = function(e){
        e.preventDefault();
        let client = new HttpClient();
        client.delete("https://ifts.adriasonline.com/ristorante/"+ this["data-id"])
            .then((result) => caricaRistoranti(risultato))
            .catch((error) => stampaMessaggio(error, risultato));
      }
      deleteIcon.innerHTML = "Elimina";
      // pulsante per mostrare a schermo le recensioni
      var mostraRec = document.createElement('button');
      mostraRec.className= "btn btn-dark";//cambiare colore pulsante
      mostraRec['rec-id']=ristorante.id;
      mostraRec.onclick = function(e){
          e.preventDefault();
          var tasto = 0;
          let tap = new HttpClient();
          tap.get('https://ifts.adriasonline.com/ristoranti/'+this['rec-id'])
          .then((result)=>stampaRecensioni(result))
          .catch((error)=>stampaMessaggio(error,risultato));
          tasto ++;
      }
      // pulsante aggiungi recensione
      var aggRec = document.createElement('button');
      aggRec.className = "btn btn-info";
      aggRec['aggRec-id'] = ristorante.id;
      aggRec.onclick = function(e){
        e.preventDefault();
        let client = new HttpClient();
        client.post("https://ifts.adriasonline.com/ristorante/"+ this["data-id"])
            .then((result) => caricaRistoranti(risultato))
            .catch((error) => stampaMessaggio(error, risultato));
      }
      //
      var editLink = document.createElement("a");
      editLink.href = "aggiungi-recensione.html?id=" + ristorante.id;
      editLink.className = "btn btn-warning";
      editLink.innerHTML = "Aggiungi Recensione";

      divButton.append(editLink);
      divButton.append(deleteIcon);
      //
      mostraRec.innerHTML='Recensioni';
      var recensioni = document.createElement('div');
      recensioni.className= '.col d-none bg-secondary';//cambiare sfondo
      recensioni.id= 'rec-'+ristorante.id;
      divRow.append(divButton);
      rubrica.append(divRow);
      //
      divButton.append(mostraRec);
      rubrica.append(recensioni);
    }
  }

  //Funzione per aggiungere una Nuova recensione al ristorante
   function salvaRecensione(recensione,risultato,id){
    var rec = new HttpClient();
        rec.post('https://ifts.adriasonline.com/ristoranti/'+id+'/recensioni',formToJson(recensione))
        .then((result)=>{
          risultato.innerHTML='recensione caricata con successo';
          risultato.className = "alert alert-success";
        })
        .catch((error)=>stampaMessaggio(error, risultato));
   }

  //Funzione per caricare le recensioni sotto al ristorante
  function stampaRecensioni(ristorante){
      var spazio = document.getElementById('rec-'+ristorante.id);
      for(var i =0;i<ristorante.recensioni.length;i++){
          var contenitore = document.createElement('div');
          contenitore.className='"col align-items-center"';
          contenitore.style='margin: 2px 2px';
          var recensione = ristorante.recensioni[i];
          contenitore.innerHTML= "<div class='border'>Recensione n: "+ (i+1) +"</div>" +"<div class='col border'>" + recensione['testo'] + "</div>" +
          "<div class=' col border'>" +recensione['nomeUtente']+ "</div>"
          +"<div class='col border'>" +recensione['dataCreazione']+ "</div>"
          +"<div class='col border'>" +recensione['voto']+ "</div>";
          if(i%2==0){
            contenitore.className='column bg-primary';
          } else {
            contenitore.className='column bg-light';
          }
          spazio.append(contenitore);
          if(i%2==0){
            spazio.className='col bg-primary inline';
          } else {
            spazio.className='col bg-light inline';
          }
        }
  }

  //Funzione che stampa il messaggio in caso di errore durante il caricamento
  function stampaMessaggio(error, risultato){
    risultato.innerHTML = "Si è verificato un errore: " + error.message;
    risultato.className = "alert alert-danger";
  }

  //Funzione che converte i dati del form in file json da caricare nel database
  function formToJson(form){
    var formData = new FormData(form);
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    var json = JSON.stringify(object);
    return json;
  }
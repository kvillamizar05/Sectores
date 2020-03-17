

function showWindow() {
  var fileInput = document.querySelector("#file-input")
  fileInput.click()
}

function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }

  $('#Excel').prop('disabled', false);
  $('#restart').prop('disabled', false);

  var lector = new FileReader();
  lector.onload = function(e) {
    var data = e.target.result;  
    var datos = data.split(/\r?\n|\r/); 

    //console.log(datos)
    var title = datos[0].split(";");

    title.forEach(e => {
        document.querySelector("#encabezado").innerHTML += "<th>"+e+"</th>";
    });
    document.querySelector("#encabezado").innerHTML += "<th>Sector Concatenado</th>";

    for (let i = 1; i < (datos.length-1); i++) {
        var row = document.createElement('tr');
        var rowE = datos[i].split(";");
        var sectors = rowE[3].split(",");
        //console.log(sectors);
        for (let j = 0; j < rowE .length; j++) {
            var column = document.createElement("td")
            column.innerHTML = rowE[j]
            row.append(column)
        }

        var rowClone = row.cloneNode(true)
        //console.log(rowClone)

        for (let k = 0; k < sectors.length; k++) {
            rowClone.innerHTML += "<td>"+rowE[0]+"_"+sectors[k]+"</td>";
            document.querySelector("#elementos").append(rowClone);
            rowClone = row.cloneNode(true)
        }
        
    }

    var wb = XLSX.utils.table_to_book(document.getElementById('tablas'), {sheet:"Sectores"});
    wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'}); 
    
  };
  lector.readAsText(archivo);
}

document.getElementById('file-input').addEventListener('change', leerArchivo, false);

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;                     
}
function botonexcel(){
  saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Sectores.xlsx');
};

function Limpiar(){
  location.reload();
}
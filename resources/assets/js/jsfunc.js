
function buildDropdowns(tableName, menu, jsTable="Form",octothorp=false){
    if (!(menu)){
        menu='measurement'
    }
    const myTBody = document.getElementById(menu+"TBody"+jsTable)
    const selectList = document.createElement("select");
    selectList.id = menu+tableName+jsTable;
    selectList.name = "select"+tableName;
    selectList.className='form-control';
    const newTR = document.createElement("tr");
    newTR.id="row"+tableName;

    const dataLabel = document.createElement("LABEL");
    dataLabel.setAttribute("for",menu+tableName+jsTable)
    const lowerCaseTitle=tableName.split("_").join(" ")
    if (octothorp){
        dataLabel.textContent='#';
    }else{
        dataLabel.textContent=lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1);
    }
    dataLabel.className="dropDownTitles";

    const dataSelect = document.createElement("td");
    dataSelect.appendChild(selectList);
    
    newTR.appendChild(dataLabel)
    newTR.appendChild(dataSelect);

    if (jsTable==="Form"){
        
        const myCols = tabletoColumns[tableName];
        const newColRows = createRows (tableName,menu,myCols, 0)
        const spacer1 = document.createElement("td");
        spacer1.innerHTML="&nbsp;";
        const spacer2 = document.createElement("td");
        spacer2.innerHTML="&nbsp;";
        const spacer3 = document.createElement("td");
        spacer3.innerHTML="&nbsp;";
        const spacer4 = document.createElement("td");
        spacer4.innerHTML="&nbsp;";
        newColRows[0].prepend(spacer1)
        newColRows[0].prepend(spacer2)
        newColRows[1].prepend(spacer3)
        newColRows[1].prepend(spacer4)

        const spacerTR1 =document.createElement("tr");
        spacerTR1.className="myspacer";
        for(let i=0;i<9;i++){
            spacerTR1.appendChild(spacer1.cloneNode(true));
        }
        const spacerTR2 =document.createElement("tr");
        spacerTR2.appendChild(spacer1.cloneNode(true));

        newColRows[1].id=tableName+"inputrow"
        newColRows[0].id=tableName+"columnsrow"
        newColRows[1].className=newColRows[1].className+" hiddenrows"
        newColRows[0].className=newColRows[0].className+" hiddenrows"

        myTBody.prepend(spacerTR2);
        myTBody.prepend(spacerTR1);
        myTBody.prepend(newColRows[1]);
        myTBody.prepend(newColRows[0]);
        myTBody.prepend(newTR);
    }else{
        const spacerTR =document.createElement("tr");
        spacerTR.id="spacer"+tableName;
        const spacer1 = document.createElement("td");
        spacer1.innerHTML="&nbsp;";
        spacerTR.appendChild(spacer1);
        myTBody.prepend(spacerTR);
        if (tableName=='datos'){
            myTBody.append(newTR);
        }else{
            myTBody.prepend(newTR);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////                
 
function selectOptionsCreate(tableName, menu, preApproved=true, jsTable="Form",approvedList=[], withRows=false, withNuevo=true) {
    let myId=(withRows? "row"+numRows+tableName+"Form" : menu+tableName+jsTable )
    if (tableName==="observaciones") myId="measurementobservacionesObservaciones";
    if (tableName==="medicion"){ myId="measurementmedicionMedicion"};
    if (tableName==="linea_mtp") myId="measurementlinea_mtpSelect";
    if (tableName==="municipio") {
        withNuevo=false
        const newmuninames= muninames.map((muniname)=>{
            return muniname['nomgeo']
        })
        completetitlevallist[tableName]=newmuninames
        
    };

    if (!!(document.getElementById(myId))){   
        ("row"+numRows+tableName+"Form");
        const mySelection = document.getElementById(myId);
        if (tableName.split('_')[0]==="observacion") tableName = tableName.replace("observacion", "especie");
        
        let mycurrentlist=completetitlevallist[tableName];
        mycurrentlist= tableName==="observaciones"? ['ave','arbol','arbusto','mamifero','herpetofauna','hierba']:mycurrentlist

        let frag = document.createDocumentFragment(),elOption;
        elOption = frag.appendChild(document.createElement('option'));
            elOption.value = "notselected";
            elOption.innerHTML =" ";
        if (withNuevo){
            elOption = frag.appendChild(document.createElement('option'));
            elOption.value = "Nuevo";
            elOption.innerHTML ="Nuevo";
        }

        if (preApproved===false){
            for (let i = 0; i<approvedList[tableName].length; i++){
                elOption = frag.appendChild(document.createElement('option'));
                elOption.value = mycurrentlist[approvedList[tableName][i]];
                elOption.innerHTML = mycurrentlist[approvedList[tableName][i]];
            }
        }else{

            
            for (let i = 0; i<mycurrentlist.length; i++){
                if(tableName!='medicion'|| mycurrentlist[i].split('*')[0]==document.getElementById('measurementlinea_mtpSelect').value.split(' (')[0]){
                    elOption = frag.appendChild(document.createElement('option'));
                    elOption.value = mycurrentlist[i];
                    elOption.innerHTML =mycurrentlist[i];
                }
            }
        }
        while (mySelection.hasChildNodes()) {
            mySelection.removeChild(mySelection.lastChild);
        }
          mySelection.appendChild(frag);
    }
}

//////////////////////////////////////////////////////////////////////////////////////        

function clearForm(menu, jsTable){
    if (!(menu)){
        menu='measurement'
    }
    const myTBody = document.getElementById(menu+"TBody"+jsTable);
    if (!!(myTBody)){
        while (myTBody.hasChildNodes()) {
            myTBody.removeChild(myTBody.lastChild);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////      

function addOnChangeMTP(tableName, menu){
                    const currentFunction= function(tableName,menu){
                        const myChoice = document.getElementById(menu+tableName+"Select").value;
                        clearForm(menu,"Form")
                        if (myChoice=="Nuevo"){
                            clearForm(menu, "Medicion")
                            clearForm(menu, "Observaciones")
                            clearForm(menu, "Numero")
                            clearForm(menu, "Form")
                            buildForm("linea_mtp", menu, "Coordenadas de Linea")
                            const newMTPdropdowns=[ "predio", "municipio","estado",]
                            newMTPdropdowns.forEach(function(newTable){
                                buildDropdowns(newTable,menu,"Form");
                                selectOptionsCreate(newTable,menu);
                                addOnChangeFKey(newTable, menu) 
                            })
                        }else{
                        //This is when an old linea_mtp is selected
                            clearForm(menu,"Observaciones")
                            clearForm(menu,"Medicion")
                            buildDropdowns("medicion",menu, "Medicion");
                            selectOptionsCreate("medicion",menu);
                            addOnChangeMedicion('medicion', menu) 
                    
                    }
                }
                const currentOnChange =function() {currentFunction(tableName,menu)  }

                const getSelection = document.getElementById(menu+tableName+"Select");
            getSelection.onchange=currentOnChange;
               }
               

//////////////////////////////////////////////////////////////////////////////////////          

function addOnChangeFKey(tableName, menu){
    const getSelection = document.getElementById(menu+tableName+"Form");
    const currentFunction3 = function(tableName, menu){
        const myChoice = getSelection.value;
        const inputRow = document.getElementById(tableName+"inputrow");
        const colRow = document.getElementById(tableName+"columnsrow");
            if (myChoice==="Nuevo"){
                colRow.classList.remove("hiddenrows");
                inputRow.classList.remove("hiddenrows");
            
            }else{  
                colRow.classList.add("hiddenrows");
                inputRow.classList.add("hiddenrows");

            }
    }  
    const currentOnChange3 =function() {currentFunction3(tableName,menu)}   
             getSelection.onchange=currentOnChange3;
            }
            
//////////////////////////////////////////////////////////////////////////////////////       
function addOnChangeMedicion(tableName, menu){
    const getSelection = document.getElementById(menu+tableName+"Medicion");
    const currentFunctionMedicion = function(tableName, menu){
        const myChoice = document.getElementById(menu+tableName+"Medicion").value;
            if (myChoice==="Nuevo"){
                clearForm(menu,"Observaciones")
                clearForm(menu,"Numero")
                clearForm(menu,"Form")
                buildForm("medicion",menu);
                buildForm("personas",menu, "Brigada");
                buildForm("gps",menu, "GPS",true);
                buildForm("camara",menu, "Camara",true);
               
            }else{  
                clearForm(menu,"Observaciones")
                clearForm(menu,"Numero")
                clearForm(menu,"Form")
                buildDropdowns("observaciones",menu, "Observaciones");
                selectOptionsCreate("observaciones", menu, true, "Form",[], false, false);
                addOnChangeObservaciones(menu)
               
                
                
                                           
            }
    }  
    const currentOnChangeMedicion =function() {currentFunctionMedicion(tableName,menu)}   
             getSelection.onchange=currentOnChangeMedicion;
            }
            
//////////////////////////////////////////////////////////////////////////////////////         

function createRows (tableName,menu,myCols, myNumRow, obs=false,customList=[]){
    
    const speciesTable =[];
    const columnRowOld = document.createElement("tr");
    const firstDataRow = document.createElement("tr");
    firstDataRow.class="dataRows";

    myCols.sort(function(a, b){
            if(a < b) return -1;
            if(a > b) return 1;
            return 0;
                    })
    myCols.sort(function(a, b){
        if(a=='notas') return 1;
        if(b=='notas') return -1;
        if(a.indexOf('omienzo')!==-1) return -1;
        if(b.indexOf('omienzo')!==-1)return 1;
        if(a.indexOf('long')!==-1) return -1;
        if(b.indexOf('long')!==-1)return 1;
        if(a.indexOf('lat')!==-1) return -1;
        if(b.indexOf('lat')!==-1)return 1;
        if(a.indexOf('hora')!==-1) return -1;
        if(b.indexOf('hora')!==-1)return 1;
        if(a.indexOf('fecha')!==-1) return -1;
        if(b.indexOf('fecha')!==-1)return 1;
        if(a.indexOf('sexo')!==-1) return -1;
        if(b.indexOf('sexo')!==-1)return 1;
        if(a.indexOf('estadio')!==-1) return -1;
        if(b.indexOf('estadio')!==-1)return 1;
        if(a.indexOf('actividad')!==-1) return -1;
        if(b.indexOf('actividad')!==-1)return 1;
        if(a.indexOf('distancia')!==-1) return -1;
        if(b.indexOf('distancia')!==-1)return 1;
        if(a.indexOf('azimut')!==-1) return -1;
        if(b.indexOf('azimut')!==-1)return 1;
        if(a.indexOf('altura')!==-1) return -1;
        if(b.indexOf('altura')!==-1)return 1;
        if(a.indexOf('dn')!==-1) return -1;
        if(b.indexOf('dn')!==-1)return 1;
        if(a.indexOf('dc1')!==-1) return -1;
        if(b.indexOf('dc1')!==-1)return 1;
        if(a.indexOf('dc2')!==-1) return -1;
        if(b.indexOf('dc2')!==-1)return 1;
        
        if(a.length==1) return 1;
        if(b.length==1) return -1;
        if(a.length==2) return 1;
        if(b.length==2) return -1;
        return 0;
                })
    


    if (customList.length>=1) myCols=customList

    if(obs){
        if (tableName=='observacion_arbol'|| tableName=='observacion_arbusto'){
            const cuadranteLabel = document.createElement("td");
            cuadranteLabel.textContent="Cuadrante";
            cuadranteLabel.className="formcolumnlabels"
            const cuadranteBox = document.createElement("td");
            const cuadranteInput = document.createElement("INPUT");
            cuadranteInput.setAttribute("type", "text");
            cuadranteInput.name = "row"+myNumRow+'*'+tableName+'*cuadrante';
            cuadranteInput.id=`row${myNumRow}cuadrante`;
            cuadranteInput.value=1;
            cuadranteInput.className="cuadranteinput";
            cuadranteBox.appendChild(cuadranteInput);
            cuadranteBox.className="cuadrante";
            columnRowOld.appendChild(cuadranteLabel);
            firstDataRow.appendChild(cuadranteBox);
            //
            const cuadnumLabel = document.createElement("td");
            cuadnumLabel.textContent="#";
            cuadnumLabel.className="formcolumnlabels octothorp"
            const cuadnumBox = document.createElement("td");
            const cuadnumInput = document.createElement("INPUT");
            cuadnumInput.setAttribute("type", "text");
            cuadnumInput.name = "row"+myNumRow+'*'+tableName+'*cuadnum';
            cuadnumInput.id=`row${myNumRow}cuadnum`;
            cuadnumInput.value=1;
            cuadnumInput.className="cuadranteinput";
            cuadnumBox.appendChild(cuadnumInput);
            cuadnumBox.className="cuadrante";
            columnRowOld.appendChild(cuadnumLabel);
            firstDataRow.appendChild(cuadnumBox);
        }
        const speciesTable = tableName.replace("observacion", "especie");
        //Species drop Label
        const speciesLabelDrop = document.createElement("td");
        speciesLabelDrop.innerText=speciesTable;
        speciesLabelDrop.className="formcolumnlabels"
        columnRowOld.appendChild(speciesLabelDrop);
        //Species drop 
        const speciesInput = document.createElement("SELECT");
        speciesInput.id = "row"+myNumRow+tableName+"Form";//this needs to
        speciesInput.setAttribute("class",speciesTable);
        speciesInput.classList.add('allinputs');
        speciesInput.classList.add('form-control');


        speciesInput.name = "row"+myNumRow+"*"+tableName+ "*"+"species";
        const inputBox = document.createElement("td");
        inputBox.appendChild(speciesInput);
        firstDataRow.appendChild(inputBox);
        //Invador Label
        const invadorLabel = document.createElement("td");
        invadorLabel.textContent="Invasor";
        invadorLabel.className="formcolumnlabels"
        columnRowOld.appendChild(invadorLabel);
        //Species comun Label
        const speciesLabelComun = document.createElement("td");
        speciesLabelComun.textContent="Nuevo Nombre Comun";
        speciesLabelComun.className="formcolumnlabels"
        columnRowOld.appendChild(speciesLabelComun);

         //Species cien Label
        const speciesLabelCien = document.createElement("td");
        speciesLabelCien.textContent="Nuevo Nombre Cientifico";
        speciesLabelCien.className="formcolumnlabels"
        columnRowOld.appendChild(speciesLabelCien);

        //Invador Checkbox
        const invadorCheck = document.createElement("INPUT");
        invadorCheck.setAttribute("type", "checkbox");
        invadorCheck.classList.add("row"+myNumRow+"disableme")
        invadorCheck.classList.add('invadorCheck');
        invadorCheck.disabled=true;
        invadorCheck.value='true'
        invadorCheck.name = "row"+myNumRow+"*"+tableName+ "*"+"invasor";
        const boxContainerInvador = document.createElement("td");
        boxContainerInvador.className="centerInTd"
        boxContainerInvador.appendChild(invadorCheck)
        firstDataRow.appendChild(boxContainerInvador);

        //Species comun inputbox
        const speciesBoxComun = document.createElement("INPUT");
        speciesBoxComun.setAttribute("type", "text");
        speciesBoxComun.classList.add("row"+myNumRow+"disableme")
        speciesBoxComun.classList.add('allinputs');
        speciesBoxComun.classList.add('form-control');

        speciesBoxComun.disabled=true;
        speciesBoxComun.name = "row"+myNumRow+"*"+tableName+ "*"+"comun";
        const boxContainerComun = document.createElement("td");
        boxContainerComun.appendChild(speciesBoxComun)
        firstDataRow.appendChild(boxContainerComun);

        //Species cien inputbox
        const speciesBoxCien = document.createElement("INPUT");
        speciesBoxCien.setAttribute("type", "text");
       
        speciesBoxCien.classList.add("row"+myNumRow+"disableme")
        speciesBoxCien.classList.add('allinputs');
        speciesBoxCien.classList.add('form-control');

        speciesBoxCien.disabled=true;
        speciesBoxCien.name = "row"+myNumRow+"*"+tableName+ "*"+"cientifico";
        const boxContainerCien = document.createElement("td");
        boxContainerCien.appendChild(speciesBoxCien)
        firstDataRow.appendChild(boxContainerCien);
    }
    myCols.forEach(function(val){
        let found = false;
        if (typeof(allPhp2[tableName]["fKeyCol"])!=="undefined"){
            found = !!allPhp2[tableName]["fKeyCol"].find(function(element) {
                return element==val;
            });
        }
            if (!(val.includes("iden")) && !found){
                const nameBox = document.createElement("td");
                const spacedval=val.split("_").join(" ");
                nameBox.innerText=spacedval.charAt(0).toUpperCase() + spacedval.slice(1);
                nameBox.className="formcolumnlabels"
                
                columnRowOld.appendChild(nameBox);
                columnRowOld.className=tableName+"columnrow"
                const textInput = document.createElement("INPUT");
                if (val.substring(0, 5).toLowerCase()=="fecha"){
                    textInput.classList.add('fechainputs');

                    textInput.setAttribute("type", "date");
                }else if (val.substring(0, 4).toLowerCase()==="hora"){
                    textInput.classList.add('horainputs');
                    textInput.setAttribute("type", "time");
                }else{
                    textInput.setAttribute("type", "text");
                }
                textInput.id = tableName+val;
                textInput.classList.add(tableName+val);
                if(obs){
                    textInput.classList.add("row"+myNumRow+"*"+tableName);
                }
                textInput.classList.add('allinputs');
                textInput.classList.add('form-control');

                textInput.name = ("row"+myNumRow+"*"+tableName+ "*"+val).toLowerCase();
                const inputBox = document.createElement("td");
                inputBox.appendChild(textInput);
                firstDataRow.className=tableName+"inputrow";
                if (val!=='Foto'){
                    firstDataRow.appendChild(inputBox);
                }
            }
            
    })
    if(obs){
        const fotoInput = document.createElement("INPUT");
        fotoInput.setAttribute("type", "file");
        fotoInput.name = ("row"+myNumRow+"*"+tableName+ "*"+'foto').toLowerCase();
        fotoInput.id = tableName+'foto';
        const fotoInputBox = document.createElement("td");
        fotoInputBox.appendChild(fotoInput);

        firstDataRow.appendChild(fotoInputBox);    
        return [columnRowOld, firstDataRow,speciesTable]
    }
   
    
    return [columnRowOld, firstDataRow,speciesTable]
}

//////////////////////////////////////////////////////////////////////////////////////          


function buildForm(tableName, menu, myTitle, spacers=false, obs=false, customList=[], buttons=true){
    if (!(menu)){
        menu='measurement'
    }
    const myTBody = document.getElementById(menu+"TBodyForm");
    let myCols = tabletoColumns[tableName];
    const spaceRow = document.createElement("tr");
    spaceRow.className="formtitles"
    spaceRow.innerHTML="<br> ";
    if (myTitle!=="none") spaceRow.innerHTML=myTitle;
    const buttonRow = document.createElement("tr");
    let mySubmit =  document.createElement("INPUT");
    mySubmit.setAttribute("type", "submit");
    mySubmit.id= menu+tableName+"Submit";
    mySubmit.className= "border border-secondary btn btn-success mySubmit p-2 m-2";
    mySubmit.value='Enviar'
    if(document.getElementsByClassName("mySubmit").length>0) mySubmit= document.getElementsByClassName("mySubmit")[0];
    var newRows = createRows(tableName,menu,myCols,0,obs,customList)

    const addElementRow = document.createElement("BUTTON");
    addElementRow.setAttribute("type", "button");
    addElementRow.id = "addElementRow"+tableName;
    //addElementRow.className = "addElementRow";
    const subtractElementRow = document.createElement("BUTTON");
    subtractElementRow.setAttribute("type", "button");

    subtractElementRow.id = "subtractElementRow";
    addElementRow.innerText="+"
    subtractElementRow.innerText="-"
    
    addElementRow.onclick=function(){return addRow(myTBody,tableName, myCols, obs,customList) }; 
    subtractElementRow.onclick=function(){return subtractRow(myTBody,tableName) }; 
    const buttonBox = document.createElement("td");
    buttonBox.appendChild(addElementRow);
    buttonBox.appendChild(subtractElementRow);
    buttonRow.appendChild(buttonBox);

    const spacer1 = document.createElement("td");
    spacer1.innerHTML="&nbsp;";

    const spacerTR1 =document.createElement("tr");
    spacerTR1.className="myspacer";
    for(let i=0;i<newRows[0].childElementCount;i++){
        spacerTR1.appendChild(spacer1.cloneNode(true));
    }
    const spacerTR2 =document.createElement("tr");
    spacerTR2.appendChild(spacer1.cloneNode(true));

    const bottomSpacer =document.createElement("tr");
    bottomSpacer.id=tableName+"bottomspacer"
    bottomSpacer.appendChild(spacer1.cloneNode(true));

    if (tableName=='medicion' || !buttons){
        myTBody.appendChild(mySubmit);
        myTBody.insertBefore(newRows[0], mySubmit);
        myTBody.insertBefore(newRows[1], mySubmit);
        //myTBody.insertBefore(bottomSpacer, mySubmit);
    }else{

        if (spacers){

                myTBody.appendChild(mySubmit);
            myTBody.insertBefore(spacerTR1, mySubmit);
            myTBody.insertBefore(spacerTR2, mySubmit);
            myTBody.insertBefore(spaceRow, mySubmit);
            myTBody.insertBefore(buttonRow, mySubmit);
            myTBody.insertBefore(newRows[0], mySubmit);
            myTBody.insertBefore(newRows[1], mySubmit);
            myTBody.insertBefore(bottomSpacer, mySubmit);

        }else{

            myTBody.appendChild(mySubmit);
            myTBody.insertBefore(spaceRow, mySubmit);
            myTBody.insertBefore(buttonRow, mySubmit);
            myTBody.insertBefore(newRows[0], mySubmit);
            myTBody.insertBefore(newRows[1], mySubmit);
            myTBody.insertBefore(bottomSpacer, mySubmit);
        }
    }
    
    if (obs){
        selectOptionsCreate(tableName, menu,true, "Form",[],true);

        selectSpeciesOnChange(tableName, menu, 0);
        
        //selectOptionsCreate(tableName, menu, true, "Form",[], 0)

    }
}


//////////////////////////////////////////////////////////////////////////////////////          

function addRow(myTBody,tableName, myCols,obs,customList=[]){
    var menu='selection';
    const bottomSpacer = document.getElementById(tableName+"bottomspacer");
    numRows++;
    var newRows = createRows(tableName,menu,myCols,numRows,obs,customList )
    newRows[1].class="addedRow";
    newRows[1].id="addedRow"
    myTBody.insertBefore(newRows[1], bottomSpacer);
    if(obs){
        selectSpeciesOnChange(tableName, menu, numRows);
        selectOptionsCreate(tableName, menu, true, "Form",[], true)

    }
 }
//////////////////////////////////////////////////////////////////////////////////////          

function subtractRow(myTBody,tableName){
    myTBody.childNodes.forEach(function(val,index){
        if (val.id==tableName+"bottomspacer"){
            let targetNode= myTBody.childNodes[index-1]
            if (targetNode.id=="addedRow") {
                myTBody.removeChild(targetNode)
                numRows--;
            }
            

            
        }
    })    
}

//////////////////////////////////////////////////////////////////////////////////////          

function addOnChangeObservaciones(menu){
    const getSelection = document.getElementById("measurementobservacionesObservaciones");
    const currentFunction3 = function(tableName, menu){
        const myChoice = 'observacion_'+document.getElementById("measurementobservacionesObservaciones").value;
        numRows=0;
        clearForm(menu,"Numero")
        clearForm(menu,"Form")
        if (myChoice!=='notselected'){
            let numberPoints = 4;
            let transpunto = 'Transecto';
            if (myChoice=="observacion_ave" || myChoice=="observacion_mamifero" ){
                transpunto = 'Punto';
                numberPoints = 5;
            }
            if (myChoice=="observacion_arbol" || myChoice=="observacion_arbusto" ){
                buildDropdowns("Punto",menu, "Numero");
                const mySelectionPunto = document.getElementById(`measurementPuntoNumero`);
                mySelectionPunto.addEventListener('change',()=>{
                    clearForm('',"Form")
                })
                //Add Number Options
                let fragPunto = document.createDocumentFragment(),elOption;
                elOption = fragPunto.appendChild(document.createElement('option'));
                elOption.value = "notselected";
                elOption.innerHTML =" ";
                for (let i = 1; i<=8; i++){
                    elOption = fragPunto.appendChild(document.createElement('option'));
                    elOption.value =i;
                    elOption.innerHTML =i;
                }
                mySelectionPunto.appendChild(fragPunto);
            }
        let octothorp = myChoice=='observacion_hierba'? true: false
            buildDropdowns(transpunto,menu, "Numero",octothorp);
            const mySelection = document.getElementById('measurement'+transpunto+'Numero');
            mySelection.addEventListener('change',()=>{
                clearForm('',"Form")
            })
            //Add Number Options
            
            let frag = document.createDocumentFragment(),elOption;
            elOption = frag.appendChild(document.createElement('option'));
                elOption.value = "notselected";
                elOption.innerHTML =" ";
            for (let i = 1; i<=numberPoints; i++){
                elOption = frag.appendChild(document.createElement('option'));
                elOption.value =i;
                elOption.innerHTML =i;
            }
            while (mySelection.hasChildNodes()) {
                mySelection.removeChild(mySelection.lastChild);
            }
            mySelection.appendChild(frag);


            
            const readybutton = document.createElement("button");
            readybutton.textContent='Cargar Formulario'
            readybutton.className=' btn btn-primary border border-secondary p-2 m-2 cargarformulario'
            readybutton.type="button"
            readybutton.id="readybutton"
            readybutton.addEventListener('click', clickReadyButton)
            //readybutton.onclick=function(){return clickReadyButton() }; 

            const myTBody = document.getElementById("measurementTBodyNumero")
            myTBody.append(readybutton);
            
    }
    }
    const currentOnChange3 =function(tableName,menu) {currentFunction3(tableName,menu)}   
             getSelection.onchange=currentOnChange3;
}

//////////////////////////////////////////////////////////////////////////////////////          
          

function clickReadyButton(e){
    let menu="measurement"
    const myChoice = 'observacion_'+document.getElementById("measurementobservacionesObservaciones").value;
    const newExist = document.getElementById("measurementdatosNumero");
    const selectedPunto = document.getElementById("measurementPuntoNumero");
    const selectedTransecto = document.getElementById("measurementTransectoNumero");
    const selectedlinea_mtp = document.getElementById("measurementlinea_mtpSelect");
    const selectedmedicion = document.getElementById("measurementmedicionMedicion");
    if(selectedlinea_mtp && selectedlinea_mtp.value=='notselected'){
        alert('Elige Linea MTP')
        return
    }
    if(selectedPunto && selectedPunto.value=='notselected'){
        alert('Elige Punto')
        return
    }
    if(selectedmedicion && selectedmedicion.value=='notselected'){
        alert('Elige Medicion')
        return
    }
    if(selectedTransecto && selectedTransecto.value=='notselected'){
        alert('Elige Transecto')
        return
    }
    
    
    async function getData(){

        //let myapi ='http://localhost:3000/api/getudp'
        let myapi ='https://biodiversidadpuebla.online/api/getudp'

        if (window.location.host=='localhost:3000') myapi ='http://localhost:3000/api/getudp'

        const rawResponse = await fetch(myapi, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json;",
                mode: 'cors',
            },
            body: JSON.stringify({
                "lineamtp": document.getElementById("measurementlinea_mtpSelect").value,
                "medicion":document.getElementById("measurementmedicionMedicion").value,
                "observacion":myChoice,
                "punto":selectedPunto? selectedPunto.value:"0",
                "transecto":selectedTransecto? selectedTransecto.value:"0",
                "useremail":useremail
            })
        });
        let dataResult = await rawResponse.json()
        return dataResult
    }




    
    if (e.offsetX>0){
        
        getData().then(dataResult =>{
            clearForm(menu,"Form")
            if (dataResult[0].length>0){
                const myTBody = document.getElementById(menu+"TBody"+'Form')
                const hiddenLocation = document.createElement('input')
                hiddenLocation.setAttribute("type", "hidden");
                hiddenLocation.name = 'hiddenlocation';
                hiddenLocation.value = dataResult[0][0]['iden'];
                hiddenLocation.id='hiddenlocation';
                myTBody.append(hiddenLocation);
    
                buildCustomForm(myChoice,menu,'Datos Existentes')
                let formtranspunto='punto'
                if (myChoice.includes('hierba') || myChoice.includes('herpetofauna')){
                    formtranspunto='transecto'
                }
                let lifeForm=document.getElementById("measurementobservacionesObservaciones").value
                const puntoEntries=Object.entries(dataResult[0][0])
                for (const [cat, val] of puntoEntries){
                    let myElem=document.getElementById(`${formtranspunto}_${lifeForm}${cat}`)
                    if (myElem){
                        myElem.value=val
                    }
                }
                dataResult[1].forEach((row,ind) => {
                    if (ind>0){
                        //make new row
                        const getSelectionAdd = document.getElementById(`addElementRow${myChoice}`)
                        if (!myChoice.includes('arbol') && !myChoice.includes('arbusto')){
                            getSelectionAdd.onclick()
                        }
                    }
                    const obsEntries=Object.entries(row)
                    for (const [cat, val] of obsEntries){
                        if (cat=='comun_cientifico'){
                            let myElemSpecies=document.getElementsByName("row"+ind+"*"+myChoice +"*species")
                            myElemSpecies[0].value=val;
                        }
                        let myElem=document.getElementsByName("row"+ind+"*"+myChoice +"*"+cat)
                        if (myElem[0]){
                            myElem[0].value=val
                            
                            if (cat=='invasor' && myElem[0].value=="true"){
                                myElem[0].disabled = false
                                myElem[0].checked=true 
                                myElem[0].disabled = true
                            }
                        }
                    }
                })
            }else{
                buildCustomForm(myChoice,menu,'Datos Nuevos')
            }
        });
    }else{
        if (newold=='Datos Nuevos'){
            buildCustomForm(myChoice,menu,'Datos Nuevos')
        }else{
            buildCustomForm(myChoice,menu,'Datos Existentes')

            const myTBody = document.getElementById(menu+"TBody"+'Form')
            const hiddenLocation = document.createElement('input')
            hiddenLocation.setAttribute("type", "hidden");
            hiddenLocation.name = 'hiddenlocation';
            hiddenLocation.value = hiddenlocationvalue;
            hiddenLocation.id='hiddenlocation';
            myTBody.append(hiddenLocation);
        }
    }        
    
}

//////////////////////////////////////////////////////////////////////////////////////          

 
 
function selectSpeciesOnChange(tableName, menu, numRows){
    const currentFunction2= function(tableName,numRows){
        const myChoice = document.getElementById("row"+numRows+tableName+"Form").value;
        const allMyRows= document.getElementsByClassName("row"+numRows+"*"+tableName)
        const colRow = document.getElementsByClassName("row"+numRows+"disableme");
        if (myChoice==="Nuevo"){
            colRow[0].disabled= false  
            colRow[1].disabled= false
            colRow[2].disabled= false
        }else{
            colRow[0].disabled= true 
            colRow[1].disabled= true 
            colRow[2].disabled= true 
            colRow[1].value=""
            colRow[2].value=""     
        }
        if (myChoice==="0000"){
            for(let  i=0;i<allMyRows.length;i++){
                if (allMyRows[i].name.includes("hora")){
                    allMyRows[i].value="00:01"
                }
                else if(allMyRows[i].name.includes("fecha")){
                    allMyRows[i].value="1000-01-01"
                    
                }else{
                    allMyRows[i].value="0000"
                }
            }  
        }
        if (myChoice==="000"){
            for(let  i=0;i<allMyRows.length;i++){
                allMyRows[i].value="000"
            }  
        }




    }
    const currentOnChange2 =function() {currentFunction2(tableName,numRows)  }
    const getSelection = document.getElementById("row"+numRows+tableName+"Form");
    getSelection.onchange=currentOnChange2;
}



function buildCustomForm(obName,menu, mode){
    let transPunto='punto';
    if(obName=='observacion_hierba'||obName=='observacion_herpetofauna'){
        transPunto='transecto';
    }
    let obsNameContext=(transPunto+"_" +obName.split('_')[1]);

    buildForm(obsNameContext, menu, ' ', false, false, [], false)
    
    buildForm(obName, menu, ' ', true, true, [])

    if (obName=='observacion_arbol'||obName=='observacion_arbusto'){
        const getSelectionAdd = document.getElementById(`addElementRow${obName}`)
        const getSelectionSubtract = document.getElementById('subtractElementRow')
        let getCuadrante0 = document.getElementById(`row${0}cuadrante`)
        getCuadrante0.setAttribute("readonly", true);
        for(let i=0;i<7;i++) {
            getSelectionAdd.onclick()
            let getCuadrante = document.getElementById(`row${i+1}cuadrante`)
            getCuadrante.value=Math.floor(i/2+1.5)
            getCuadrante.setAttribute("readonly", true);
            let getCuadnum = document.getElementById(`row${i+1}cuadnum`)
            getCuadnum.value=i+2
            getCuadnum.setAttribute("readonly", true);
        }
        numRows=0
        getSelectionAdd.disabled=true;
        getSelectionSubtract.disabled=true;
    }
    const myTBody = document.getElementById(menu+"TBody"+'Form')
    const datosField = document.createElement('input')
    datosField.setAttribute("type", "text");
    datosField.name = 'mode';
    datosField.value = mode;
    datosField.id='mode';
    datosField.className =' modeButton text-dark text-center';
    datosField.setAttribute("readonly", true);
    myTBody.prepend(datosField);

}

function addOnChangeAdminTable(){
    const getSelection = document.getElementById('table_option');
    const currentFunction3 = function(tableName, menu){

        const myChoice = getSelection.value;
        const mySelection = document.getElementById('field_option')
        const mycurrentlist= tabletoColumns[myChoice]
        let frag = document.createDocumentFragment(),elOption;

        for (let i = 0; i<mycurrentlist.length; i++){
            if(!mycurrentlist[i].includes("iden")){
                elOption = frag.appendChild(document.createElement('option'));
                elOption.value = mycurrentlist[i];
                elOption.innerHTML =mycurrentlist[i];
            }
        }
    while (mySelection.hasChildNodes()) {
        mySelection.removeChild(mySelection.lastChild);
    }
    mySelection.appendChild(frag);

    }  
    const currentOnChange3 =function() {currentFunction3()}   
             getSelection.onchange=currentOnChange3;
}
var numRows=0;
if(window.location.href.substr(-5)==='admin'){
    buildDropdowns( "usuario", "measurement", "Select" );
    selectOptionsCreate( "usuario",  "measurement",  true,  "Select", [],  false,  false);
    buildDropdowns( "usuario_permitido", "measurement", "Medicion" );
    selectOptionsCreate( "usuario_permitido",  "measurement",  true,  "Medicion", [],  false, false);
    buildDropdowns( "additional_layers", "measurement", "cargar" );
    selectOptionsCreate( "additional_layers",  "measurement",  true,  "cargar", [],  false, false);
    addOnChangeAdminTable()

}else{
    buildDropdowns( "linea_mtp", "measurement", "Select" );
    selectOptionsCreate( "linea_mtp", "measurement", true,  "Select" );
    addOnChangeMTP( "linea_mtp",  "measurement");
}

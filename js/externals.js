const requestNotificationPermission = async ()=>{
    const permission = await Notification.requestPermission();

    if(permission !== 'granted'){
        throw new Error("No se ha podido otorgar permisos para la notificacion.");
    }else{
        new Notification ("Hola mi nombre es Rodrigo Ernesto Campos , soy estudiante de la  UGF.");
    }
}

async function recordVideo(){
    if (window.recorder && window.recorder.state==="recording"){
        window.recorder.stop();
    }else{
        let toggle = document.getElementById("recording-button");
        let stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true}).catch((error)=>{
            throw new Error("no es posible continuar, debido a falta de permisos");
        });

        let videoE1 = document.getElementById("video-element");
        videoE1.srcObject = stream;
        videoE1.play();

        window.recorder = new MediaRecorder(stream);
        let chunks = [];
        window.recorder.ondataavailable = function(event){
            if(event.data.size > 0){
                chunks.push(event.data);
            }
        };

        window.recorder.onstop = function(){
            let blob = new Blob(chunks,{type:'video/webm'});
            toggle.innerHTML = '<i class="fa fa-circle"></i>';
            videoE1.srcObject= null;
            videoE1.src = URL.createObjectURL(blob);
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }

window.recorder.onstart = function(){
    toggle.innerHTML = '<i class="fa fa-circle"></i>';
};

window.recorder.start();

    }
}
function geolocalizacion(){
    if(navigator.permissions && navigator.permissions.query){
        navigator.permissions.query({name:'geolocation'}).then(function(result){
            const permission = result.state;
            if(permission === 'granted' || permission === 'prompt'){
                _onGetCurrentLocation();
            } 
        });

    }else if (navigator.geolocation){
        _onGetCurrentLocation();
    }
}

function _onGetCurrentLocation(){
    const options ={
        enableHighAccuaracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(function(position){
        const maker = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        let enlace = document.getElementById("ir_mapa");
        enlace.href = `https://maps.google.com/?q=${marker.lat},${marker.lng}`;
        enlace.text = "Ir al mapa";
        enlace.target = "_blank";
    },function(error){
        console.log(error);
    },options);
}
const init = () => {
    const tieneSoporteUserMedia = () =>
        !!(navigator.mediaDevices.getUserMedia);
    if(typeof MediaRecorder === "undefined" || !tieneSoporteUserMedia()){
        return alert ("su navegador no cumple con los requsitos , favor actualizar a una version mas reciente ");
    }
    const $listaDeDispositivos = document.querySelector("#listaDeDispositivos"),
    $duracion = document.querySelector("duracion"),
    $btnComenzarGrabacion = document.querySelector("#btnComenzarGrabacion"),
    $btnDEtenerGrabacion = document.querySelector("#btnDetenerGrabacion");

    const LimpiarSelect = () => {
        for (let x = $listaDeDispositivos.options.length - 1; x >= 0; x--) {
            $listaDeDispositivos.options.remove(x);
          }
          
          const segundosATiempo = numeroDeSegundos => {
            let horas = Math.floor(numeroDeSegundos / 60 / 60);
            numeroDeSegundos -= horas * 60 * 60;
          
            let minutos = Math.floor(numeroDeSegundos / 60);
            numeroDeSegundos -= minutos * 60;
          
            numeroDeSegundos = parseInt(numeroDeSegundos);
          
            if (horas < 10) { 
              horas = "0" + horas; 
            }
            if (minutos < 10) {
              minutos = "0" + minutos; 
            }
            if (numeroDeSegundos < 10) {
              numeroDeSegundos = "0" + numeroDeSegundos; 
            }
          
            return `${horas}:${minutos}:${numeroDeSegundos}`;
          };
          let tiempodeInicio,mediaRecorder,idInterval;
          const refrescar = () =>{
            $duracion.textContent = segundosATiempo ( (Date.now - tiempodeInicio) / 1000);
          }

          const llenarLista = () => {
            navigator.mediaDevices.enumerateDevices().then(dispositivos => {
                limpiarSelect();
                dispositivos.forEach((dispositivo, indice) => {
                    if (dispositivo.kind === "audioinput") {
                        const $opcion = document.createElement("option");
                        $opcion.text = dispositivo.label || `Dispositivo ${indice + 1}`;
                        $opcion.value = dispositivo.deviceId;
                        $listaDeDispositivos.appendChild($opcion);
                    }
                })
            })
        };

        const comenzarACortar =() =>{
            tiempoInicio = Date.now();
            idIntervalo = setInterval (refrescar,500);
        };
        const comenzarAGrabar  =() =>{
            if(!$listaDeDispositivos.options.length) return alert ("no hay dispositivos");
            if(mediaRecorder) return alert ("ya se esta garbando");
            navigator.mediaDevices.getUserMedia({
                audio:{
                    deviceId:$listaDeDispositivos.value,
                }
            }).then (stream =>{
                mediaRecorder new MediaRecorder(stream);
                mediaRecorder.start();
                comenzarAContar();
                const fragmentosDeAudio = [];
                mediaRecorder.addEventListener("stop", ()=>{
                    stream.getTracks().forEach(track=>track.stop());
                    detenerConteo();
                    const blobAudio = new Blob (fragmentosDeAudio);
                    const urlParaDescargar = URL.createObjectURL(blobAudio);
                    document.body.appendChild(a);
                    a.style ="display:none";
                    a.href = urlParaDescargar;
                    a.download ="rodrigo.ernestocamposmejia.ufg.webn";
                    a.click();
                    window.URL.revokeObjectURL(urlParaDescargar);
                });
            }).catch (error =>{
                console.log(error);
            });
        };
        const detenerConteo = () => {
            clearInterval(idIntervalo);
            tiempoInicio = null;
            $duracion.textContent = "";
          };
          
          const detenerGrabacion = () => {
            if (!mediaRecorder) return alert("No se está grabando");
            mediaRecorder.stop();
            mediaRecorder = null;
          }
          $btnComenzarGrabacion.addEventListener("click",comenzarAGrabar);
          $btnDetenerGrabacion.addEventListener("click",detenerGrabacion);

          llenarLista();

        }

        document.addEventListener("DOMContentLoaded", init);
    }
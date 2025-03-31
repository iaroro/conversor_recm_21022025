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
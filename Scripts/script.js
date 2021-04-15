let nomeDoUsuario;
let mensagens;
function loginUsuario() {
    nomeDoUsuario = document.querySelector(".nomeUsuario").value
    const telaLogin = document.querySelector(".telaEntrada")
    telaLogin.classList.add("oculto")
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: nomeDoUsuario})
    promessa.then(buscarMensagem);
    promessa.catch(tratarErroLogin);
}
function buscarMensagem() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promessa.then(mensagensRecebidas)
}
function tratarErroLogin() {
    alert("Esse nome já existe");
}

function mensagensRecebidas (resposta) {
    mensagens = resposta.data;
    console.log(mensagens);
    chatDeMensagens()
}

function chatDeMensagens() {
    const todasAsMensagens = document.querySelector(".containerChat");
    
    for(let i=0; i < mensagens.length ; i++) {
        if(mensagens[i].type==='status') {
            todasAsMensagens.innerHTML += ` 
            <div class="chat ${mensagens[i].type}">
                (${mensagens[i].time}) ${mensagens[i].from} ${mensagens[i].text}
            </div>
            `
        } else {
            todasAsMensagens.innerHTML += ` 
            <div class="chat ${mensagens[i].type}">
                (${mensagens[i].time}) ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
            </div>
            `
        }
        
    }
}
/**
function enviarMensagem() {
    const msgDoUsuario = document.querySelector(".mensagem").value
    //const novaMensagem = {from: nomeDoUsuario, to: , text: msgDoUsuario, type: tipoDeMensagem};
    const promessa = axios.post("");
    promessa.then(buscarMensagem);
    promessa.catch(tratarErro);
}
function tratarErro() {
    alert();
}

let participantes;
function buscarParticipantes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promessa.then(participantesAtivos)
    promessa.catch(tratarErro)
}
function participantesAtivos(resposta) {
    participantes = resposta.data
}
function listaContatos() {
    const todosOsUsuarios = document.querySelector(".escolhaContato ul");
    for(let i=0;i<participantes.length;i++) {
        todosOsUsuarios.innerHTML += `
        <li>
            <div class="perfil">
                <ion-icon name="people-sharp"></ion-icon> 
                ${participantes[i].name}
            </div>
            <ion-icon name="checkmark-outline"></ion-icon>
        </li>
        `;
    }
}
let tipoDeMensagem;
function enviarMensagemPublica() {
    tipoDeMensagem = "message"
    alert("msg publica")
}
function enviarMensagemPrivada() {
    tipoDeMensagem = "private_message"
    alert("msg privada")
}
function statusConexao() {
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", nomeDoUsuario)
}
function conexao() {
    setInterval(statusConexao, 5000)
}

**/
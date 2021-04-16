let nomeDoUsuario;
let mensagens;
function loginUsuario() {
    const carregar = document.querySelector(".carregando");
    carregar.classList.remove('oculto');
    nomeDoUsuario = document.querySelector(".nomeUsuario").value
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: nomeDoUsuario})
    promessa.then(atualizarMensagens);
    promessa.then(atualizarParticipantes)
    promessa.then(removerTelaInicial)
    promessa.catch(tratarErroLogin);
    setInterval(statusConexao, 5000)
}
function removerTelaInicial() {
    const telaLogin = document.querySelector(".telaEntrada")
    telaLogin.classList.add("oculto")
}
function atualizarMensagens() {
    setInterval(buscarMensagem, 3000)
    buscarMensagem()
}
function tratarErroLogin() {
    alert("Esse nome já existe");
}
function statusConexao() {
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", {name: nomeDoUsuario})
    promessa.catch(logout)
}
function logout(erro) {
    statusErro = erro.response.status;
    alert("Ocorreu erro"+ statusErro);
}
function buscarMensagem() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promessa.then(mensagensRecebidas)
}
function mensagensRecebidas (resposta) {
    mensagens = resposta.data;
    chatDeMensagens()
    
}
function chatDeMensagens() {
    const todasAsMensagens = document.querySelector(".containerChat");
    todasAsMensagens.innerHTML = "";
    for(let i=0; i < mensagens.length ; i++) {
        let mensagemDeStatus = mensagens[i].type==='status';
        let mensagemReservada = mensagens[i].type==='private_message';
        let mensagemGeral = mensagens[i].type==='message'
        
        if(mensagemDeStatus) {
            todasAsMensagens.innerHTML += ` 
            <div class="chat status">
                (${mensagens[i].time}) ${mensagens[i].from} ${mensagens[i].text}
            </div>
            `
        } else if(mensagemReservada && (mensagens[i].from===nomeDoUsuario || mensagens[i].to===nomeDoUsuario) ) {
            todasAsMensagens.innerHTML += ` 
            <div class="chat reservadamente">
                (${mensagens[i].time}) ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
            </div>
            `
        }else if(mensagemGeral){
            todasAsMensagens.innerHTML += ` 
            <div class="chat publico">
                (${mensagens[i].time}) ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
            </div>
            `
        }
    }
    let ultimaMensagem = document.querySelector(".containerChat div:last-of-type")
    ultimaMensagem.scrollIntoView();
}

let tipoDeMensagem = 'message';
function tipoDaMensagem(mensagemTipo) {
    tipoDeMensagem = mensagemTipo.id;
    const tipoSelecionado = document.querySelector(".visibilidade .selecionado");
    if (tipoSelecionado!==null) {
        tipoSelecionado.classList.remove("selecionado");
    }
    mensagemTipo.classList.add("selecionado")
} 

function enviarMensagem() {
    const msgDoUsuario = document.querySelector(".mensagem").value
    const novaMensagem = {from: nomeDoUsuario, to: destinatario, text: msgDoUsuario, type: tipoDeMensagem};
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", novaMensagem);
    promessa.then(buscarMensagem);
    promessa.catch(tratarErro);
    document.querySelector(".mensagem").value="";
    
}
function tratarErro(erro) {
    statusErro = erro.resonse.status
    alert(`("Ocorreu erro"+ statusErro)`)
    window.location.reload()
}
document.querySelector(".nomeUsuario").addEventListener("keypress", loginComEnter)
document.querySelector(".mensagem").addEventListener("keypress", mensagemComEnter)
function loginComEnter(tecla) {
    if(tecla.key === "Enter") {
        loginUsuario()
    }
}
function mensagemComEnter(tecla) {
    if(tecla.key === "Enter") {
        enviarMensagem()
    }
}

function atualizarParticipantes() {
    setInterval(buscarParticipantes, 10000)
    buscarParticipantes()
}

function buscarParticipantes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    promessa.then(participantesAtivos)
    promessa.catch(tratarErro)
}
let participantes;
function participantesAtivos(resposta) {
    participantes = resposta.data
}
function abrirAbaContatos() {
    const abaContatos = document.querySelector(".contatosContainer")
    if(abaContatos.classList.contains("oculto")){
        abaContatos.classList.remove("oculto")
        listaContatos()
    } else {
        abaContatos.classList.add("oculto")
    }
    
}
function listaContatos() {
    const todosOsUsuarios = document.querySelector(".listaDeUsuarios");
    todosOsUsuarios.innerHTML = `
    <li onclick="enviarPara(this)" id="Todos">
        <div class="perfil">
            <ion-icon name="people-sharp"></ion-icon> 
            Todos
        </div>
        <ion-icon class="check" name="checkmark-outline"></ion-icon>
    </li>
    `;
    for(let i=0;i<participantes.length;i++) {
        todosOsUsuarios.innerHTML += `
        <li onclick="enviarPara(this)" id="${participantes[i].name}">
            <div class="perfil">
                <ion-icon name="people-sharp"></ion-icon> 
                ${participantes[i].name}
            </div>
            <ion-icon class="check" name="checkmark-outline"></ion-icon>
        </li>
        `;
    }
}
let destinatario = 'Todos';
function enviarPara(pessoa) {
    destinatario = pessoa.id;
    const selecionado = document.querySelector(".listaDeUsuarios .selecionado");
    
    if (selecionado!==null) {
        selecionado.classList.remove("selecionado");
    }
    pessoa.classList.add("selecionado")
    const infoDaMensagem = document.querySelector(".infoDestinatario")
    if(tipoDeMensagem ==='private_message' && destinatario !=='Todos') {
        infoDaMensagem.innerHTML=`Enviando para ${destinatario} (reservadamente)`
    } else if(tipoDeMensagem ==='message') {
        infoDaMensagem.innerHTML=`Enviando para ${destinatario} (público)`
    }
}
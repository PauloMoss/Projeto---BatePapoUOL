let nomeDoUsuario;
let mensagens;
function loginUsuario() {
    nomeDoUsuario = document.querySelector(".nomeUsuario").value
    const telaLogin = document.querySelector(".telaEntrada")
    telaLogin.classList.add("oculto")
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", {name: nomeDoUsuario})
    promessa.then(atualizarMensagens);
    //promessa.then(removerTelaInicial)
    promessa.catch(tratarErroLogin);
    setInterval(statusConexao, 5000)
}
function removerTelaInicial() {
    const telaLogin = document.querySelector(".telaEntrada")
    telaLogin.classList.add("oculto")
}
function atualizarMensagens() {
    setInterval(buscarMensagem, 3000)
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
    const telaLogin = document.querySelector(".telaEntrada")
    telaLogin.classList.remove("oculto")
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
            <div class="chat ${mensagens[i].type}">
                (${mensagens[i].time}) ${mensagens[i].from} ${mensagens[i].text}
            </div>
            `
        } else if(mensagemReservada && (mensagens[i].from===nomeDoUsuario || mensagens[i].to===nomeDoUsuario) ) {
            todasAsMensagens.innerHTML += ` 
            <div class="chat ${mensagens[i].type}">
                (${mensagens[i].time}) ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
            </div>
            `
        }else if(mensagemGeral){
            todasAsMensagens.innerHTML += ` 
            <div class="chat ${mensagens[i].type}">
                (${mensagens[i].time}) ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
            </div>
            `
        }
    }
    window.scrollTo(0,todasAsMensagens.scrollHeight);
}

let tipoDeMensagem;
function enviarMensagemPublica() {
    tipoDeMensagem = "message"
}
function enviarMensagemPrivada() {
    tipoDeMensagem = "private_message"
}
function enviarMensagem() {
    const msgDoUsuario = document.querySelector(".mensagem").value
    const novaMensagem = {from: nomeDoUsuario, to: destinatario, text: msgDoUsuario, type: tipoDeMensagem};
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", novaMensagem);
    promessa.then(buscarMensagem);
    promessa.catch(tratarErro);
    document.querySelector(".mensagem").value="";
}
function tratarErro() {
    alert();
}

let participantes;
function buscarParticipantes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    promessa.then(participantesAtivos)
    promessa.catch(tratarErro)
}
function participantesAtivos(resposta) {
    participantes = resposta.data
    const abaContatos = document.querySelector(".fundoEmbacado")
    if(abaContatos.classList.contains("oculto")){
        abaContatos.classList.remove("oculto")
        console.log(participantes)
        listaContatos()
    } else {
        abaContatos.classList.add("oculto")
    }
    
}
function listaContatos() {
    const todosOsUsuarios = document.querySelector("ul");
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
let destinatario = '';
function enviarPara(pessoa) {
    destinatario = pessoa.id;
    const selecionado = document.querySelector(".listaContatos .selecionado");
    
    if (selecionado!==null) {
        selecionado.classList.remove("selecionado");
    }
    pessoa.classList.add("selecionado")
}
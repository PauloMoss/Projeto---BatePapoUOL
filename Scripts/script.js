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
}
function atualizarMensagens() {
    setInterval(buscarMensagem, 3000)
    buscarMensagem()
}
function atualizarParticipantes() {
    setInterval(buscarParticipantes, 10000)
    buscarParticipantes()
}
function removerTelaInicial() {
    const telaLogin = document.querySelector(".telaEntrada")
    telaLogin.classList.add("oculto")
    statusConexao()
    setInterval(statusConexao, 5000)
}
function tratarErroLogin(erro) {
    const error = erro.response.data
    const statusErro = erro.response.status
    const tipoDeErro = "Esse nome já existe!"
    tratatErros(error, statusErro, tipoDeErro)
    location.reload();
}
function tratatErros(error, statusErro, tipoDeErro) {
    if(statusErro===400) {
        alert(`Ocorreu erro: ${statusErro}\n${tipoDeErro}`);
    } else {
        alert(`Ocorreu erro: ${statusErro}\n${error}`);
    }
} 
function statusConexao() {
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", {name: nomeDoUsuario})
    promessa.catch(logout)
}
function logout(erro) {
    const error = erro.response.data
    const statusErro = erro.response.status
    const tipoDeErro = "Você foi desconectado por Inatividade!"
    tratatErros(error, statusErro, tipoDeErro)
    location.reload();
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
        if(mensagens[i].type==='status') {
            todasAsMensagens.innerHTML += ` 
            <div class="chat status">
                <span class="tempo">(${mensagens[i].time})</span>&nbsp<span class="usuario">${mensagens[i].from}</span>&nbsp${mensagens[i].text}
            </div>
            `
        } else if(mensagens[i].type==='private_message' && (mensagens[i].from===nomeDoUsuario || mensagens[i].to===nomeDoUsuario) ) {
            todasAsMensagens.innerHTML += ` 
            <div class="chat reservadamente">
                <span class="tempo">(${mensagens[i].time})</span>&nbsp<span class="usuario">${mensagens[i].from}</span> reservadamente para <span class="usuario">${mensagens[i].to}</span>&nbsp: ${mensagens[i].text}
            </div>
            `
        }else if(mensagens[i].type==='message'){
            todasAsMensagens.innerHTML += ` 
            <div class="chat publico">
                <span class="tempo">(${mensagens[i].time})</span>&nbsp<span class="usuario">${mensagens[i].from}</span> para <span class="usuario">${mensagens[i].to}</span>&nbsp: ${mensagens[i].text}
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
    promessa.catch(tratarErroEnvioMensagem);
    document.querySelector(".mensagem").value="";
    
}
function tratarErroEnvioMensagem(erro) {
    const error = erro.response.data
    const statusErro = erro.response.status
    const tipoDeErro = "Caracteres Inválidos!"
    tratatErros(error, statusErro, tipoDeErro)
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
function buscarParticipantes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    promessa.then(participantesAtivos)
    promessa.catch(tratarErroDeParticipantes)
}
function tratarErroDeParticipantes() {
    const error = erro.response.data
    const statusErro = erro.response.status
    const tipoDeErro = "Não foi possivel buscar os Participantes"
    tratatErros(error, statusErro, tipoDeErro)
}
let participantes;
function participantesAtivos(resposta) {
    participantes = resposta.data
    listaContatos()
}
function abrirAbaContatos() {
    const abaContatos = document.querySelector(".contatosContainer")
    if(abaContatos.classList.contains("oculto")){
        abaContatos.classList.remove("oculto")
        
    } else {
        abaContatos.classList.add("oculto")
    }
    descricaoDaMensagem()
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
    pessoa.classList.add("selecionado");
}
function descricaoDaMensagem() {
    const infoDaMensagem = document.querySelector(".infoDestinatario")
    if(tipoDeMensagem ==='private_message') {
        infoDaMensagem.innerHTML=`Enviando para ${destinatario} (reservadamente)`
    } else if(tipoDeMensagem ==='message') {
        infoDaMensagem.innerHTML=`Enviando para ${destinatario} (público)`
    }
}
import User from './paciente.js';
import { filaAtendimento } from './filaAtendimento.js'
import { filaInternados } from './filaInternados.js'

const cadastrar = document.getElementById('cadastrar');
const chamar = document.getElementById('chamar');
const sim = document.getElementById('sim')
const nao = document.getElementById('nao')
const alta = document.getElementById('alta');
const obito = document.getElementById('obito');
const consultarPaciente = document.getElementById('consultarPaciente');

cadastrar.addEventListener("click", cadastrarPaciente)
chamar.addEventListener("click", atenderPaciente)
sim.addEventListener("click", internar)
nao.addEventListener("click", liberado)
alta.addEventListener("click", altaPaciente)
obito.addEventListener("click", obitoPaciente)
consultarPaciente.addEventListener("click", consultarPac)


var registroDePacientes = [];
var filaAtendimentoStorage = [];
var pacientesInternados = [];
var tamanhoLeito = 100;
var user = new User()
var filaAt = new filaAtendimento()
var filaIn = new filaInternados()

document.getElementById("cadastrar").disabled = true;

// restores data from localStorage
window.addEventListener('load', () => {
    getLocal()
    getLocalInternados()
    getFila()
    atualizaRegistro()
    atualizaInternados()
})

// Funções de clique
function cadastrarPaciente(e) {
    e.preventDefault()
    var nome = document.getElementById("nome").value;
    var idade = document.getElementById("idade").value;
    var email = document.getElementById("email").value;
    var cpf = document.getElementById("cpf").value;
    var status = "Fila Atendimento"

    user = new User(nome, idade, email, cpf, status)
    registroDePacientes.push(user)
    filaAtendimentoStorage.push(user)
    filaAt.add(user)

    mudarStatus(cpf, status)

    document.getElementById("nome").value = ""
    document.getElementById("idade").value = ""
    document.getElementById("email").value = ""
    document.getElementById("cpf").value = ""

    document.getElementById('sucesso').innerHTML = "Paciente Cadastrado com Sucesso!";
    setTimeout(() => {
        document.getElementById('sucesso').innerHTML = "";
    }, 4000)
    atualizaRegistro()
    document.getElementById("cadastrar").disabled = true;
}

function atenderPaciente(e) {
    e.preventDefault()
    // filaAt.removerPrimeiro()
    const filaPaciente = JSON.parse(localStorage.getItem('filaAtendimentoStorage'))
    if(filaPaciente) filaAtendimentoStorage = filaPaciente;

    if(filaPaciente.length > 0){
        var obj = filaPaciente[0];
        filaPaciente.splice(0,1);
        document.getElementById('pacienteChamado').innerHTML = obj.name;
        document.getElementById('cpfChamado').innerHTML = obj.cpf;
        document.getElementById('emailChamado').innerHTML = obj.email;
        document.getElementById('idadeChamado').innerHTML = obj.idade;
        document.getElementById("perguntas").style.display = "block";
        document.getElementById("chamar").style.display = "none";
    }else{
        document.getElementById('erroPaciente').innerHTML = "Não há pacientes na fila.";
        setTimeout(() => {
            document.getElementById('erroPaciente').innerHTML = "";
        }, 4000)
    }
}

function internar(){
    let nome = document.getElementById("pacienteChamado").innerHTML;
    let idade = document.getElementById("idadeChamado").innerHTML;
    let email = document.getElementById("emailChamado").innerHTML;
    let cpf = document.getElementById("cpfChamado").innerHTML;
    let status = "Internado";
    user = new User(nome, idade, email, cpf, status)

    if(pacientesInternados.length >= tamanhoLeito){
        alert('Leitos lotados, você será redirecionado para um fila de espera')
        filaIn.add(user)
    }else {
        pacientesInternados.push(user)
        mudarStatus(cpf, status)
        document.getElementById("perguntas").style.display = "none";
  
    }
    document.getElementById("chamar").style.display = "inline";
    document.getElementById('pacienteChamado').innerHTML = "";
    document.getElementById('cpfChamado').innerHTML = "";
    document.getElementById('emailChamado').innerHTML = "";
    document.getElementById('idadeChamado').innerHTML = "";
    atualizaRegistro()
    atualizaInternados()
}

function liberado(){
    let cpf = document.getElementById("cpfChamado").innerHTML;
    let status = "Liberado";

    mudarStatus(cpf, status)
    document.getElementById("perguntas").style.display = "none";
  
    document.getElementById("chamar").style.display = "inline";
    document.getElementById('pacienteChamado').innerHTML = "";
    document.getElementById('cpfChamado').innerHTML = "";
    document.getElementById('emailChamado').innerHTML = "";
    document.getElementById('idadeChamado').innerHTML = "";  
    atualizaRegistro()
    atualizaInternados()
}

function altaPaciente(e) {
    e.preventDefault()
    let cpf = $("#cpfLiberar").val()

    const local = JSON.parse(localStorage.getItem('pacientesInternados'))
    if(local) pacientesInternados = local;
    
    var i;
    for (i in local) {
        if(local[i].cpf == cpf){
            
            let cpfLiberar = local[i].cpf;
            let status = "Alta"
            mudarStatus(cpfLiberar, status)
            const index = local.findIndex(item => item.cpf === cpf);
            local.splice(index, 1)
            let texto = "Paciente recebeu alta"
            textoLiberar(texto)
            break;
        }else {
            let texto = "Paciente não encontrado"
            textoLiberar(texto)
        }
    }
    atualizaRegistro()
    atualizaInternados()
}

function obitoPaciente(e) {
    e.preventDefault()
    let cpf = $("#cpfLiberar").val()

    const local = JSON.parse(localStorage.getItem('pacientesInternados'))
    if(local) pacientesInternados = local;
    
    var i;
    for (i in local) {
        if(local[i].cpf == cpf){
            
            let cpfLiberar = local[i].cpf;
            let status = "Óbito"
            mudarStatus(cpfLiberar, status)
            const index = local.findIndex(item => item.cpf === cpf);
            local.splice(index, 1)
            let texto = "Paciente Óbito"
            textoLiberar(texto)
            break;
        }else {
            let texto = "Paciente não encontrado"
            textoLiberar(texto)
        }
    }
    atualizaRegistro()
    atualizaInternados()
}

function consultarPac(e) {
    e.preventDefault()
    var cpf = document.getElementById("cpfConsultar");
    if(registroDePacientes.length == 0){
        document.getElementById('cpfNaoEncontrado').innerHTML = "CPF não encontrado";
        setTimeout(() => {
            document.getElementById('cpfNaoEncontrado').innerHTML = "";
        }, 4000)
    }
    const storage = JSON.parse(localStorage.getItem('registroDePacientes'))
    if(storage) registroDePacientes = storage;
    var i;
    for (i in storage){
        if(storage[i].cpf == cpf.value){
            console.log(pacientesInternados.indexOf('pacientesInternados[i].cpf'))
            document.getElementById("divConsulta").style.display = "inline";
            document.getElementById('nomeConsultado').innerHTML = storage[i].name;
            document.getElementById('cpfConsultado').innerHTML = storage[i].cpf;
            document.getElementById('statusConsultado').innerHTML = storage[i].status;
            document.getElementById("cpfNaoEncontrado").style.display = "none";
            break;
        }else {
            document.getElementById("divConsulta").style.display = "none";
            document.getElementById("cpfNaoEncontrado").style.display = "inline";
            document.getElementById('cpfNaoEncontrado').innerHTML = "CPF não encontrado";
            
            setTimeout(() => {
                document.getElementById('cpfNaoEncontrado').innerHTML = "";
            }, 4000)
        }
    }
}

// Verificações e util
var inputs = $('.inputCadastro').on('keyup', verificarInputs);
function verificarInputs() {
    const preenchidos = inputs.get().every(({value}) => value)
    $('#cadastrar').prop('disabled', !preenchidos);

    const storage = JSON.parse(localStorage.getItem('registroDePacientes'))
    if(storage) registroDePacientes = storage;

    let cpf = $("#cpf").val()
    var i;
    for (i in storage){
        if(storage[i].cpf == cpf){
            console.log('CPF já cadastrado')
            document.getElementById("cadastrar").disabled = true;
            document.getElementById('erroCadastro').innerHTML = "CPF já cadastrado!";
            setTimeout(() => {
                document.getElementById('erroCadastro').innerHTML = "";
            }, 2000)
            break;
        }else {
            console.log('DIFERENTE')
            document.getElementById("cadastrar").disabled = false; 
        }
    }

}
$("#cadastrar").on("click").disabled = true;

function mudarStatus(cpf, status) {
    for (var i = 0; i < registroDePacientes.length; i++){
        if(registroDePacientes[i].cpf === cpf){
            registroDePacientes[i].status = status
            console.log(registroDePacientes[i].status)
        }else {

        }
    }
}

function leitosDisponiveis(){
    var resultado;
    var tamanho = pacientesInternados.length
    resultado = tamanhoLeito - tamanho;
    document.getElementById('leitosDisponiveis').innerHTML = resultado
    setInternados()
}

function atualizaRegistro() {
    document.getElementById('registroPacientes').innerHTML = "";
    for (var i = 0; i < registroDePacientes.length; i++){ 
        let nome = registroDePacientes[i].name
        let cpf = registroDePacientes[i].cpf
        let status = registroDePacientes[i].status
        $('#registroPacientes').append('<div class="listaRegistro"><p><strong>Nome: </strong><span>'+nome+',</span> <strong>CPF:</strong><span>'+cpf+',</span><br><strong>Status: </strong><span>'+status+'</span></p></div>')
    }
   setLocal()
   setFila()
}

function atualizaInternados(){
    document.getElementById('leitosOcupados').innerHTML = "";
    for (var i = 0; i < pacientesInternados.length; i++){ 
        let nome = pacientesInternados[i].name
        let cpf = pacientesInternados[i].cpf
        $('#leitosOcupados').append('<div class="listaRegistro"><p><strong>Nome: </strong><span>'+nome+',</span> <strong>CPF:</strong><span>'+cpf+',</span></p></div>')
    }
    leitosDisponiveis()
}

function textoLiberar(texto) {
    document.getElementById('consultadoPaciente').innerHTML = texto;
    setTimeout(() => {
        document.getElementById('consultadoPaciente').innerHTML = "";
    }, 4000)
}

// localStorage registro de pacientes
function setLocal() {
    localStorage.setItem('registroDePacientes', JSON.stringify(registroDePacientes))
}
function getLocal(){
    const storage = JSON.parse(localStorage.getItem('registroDePacientes'))
    if(storage) registroDePacientes = storage;
}

//localStorage Internados
function setInternados() {
    localStorage.setItem('pacientesInternados', JSON.stringify(pacientesInternados))
}
function getLocalInternados(){
    const local = JSON.parse(localStorage.getItem('pacientesInternados'))
    if(local) pacientesInternados = local;
}

// fila de atendimento com localStorage
function setFila(){
    localStorage.setItem('filaAtendimentoStorage', JSON.stringify(filaAtendimentoStorage))
}
function getFila(){
    const filaPaciente = JSON.parse(localStorage.getItem('filaAtendimentoStorage'))
    if(filaPaciente) filaAtendimentoStorage = filaPaciente;
}

// card option
$("#entrar_familiar").click(function(){
    $(".card-option").hide();
    $("#consultar_Paciente").show();
    $("#liberarPaciente").hide();
    $("#cadastrarPaciente").hide();
    $("#atenderPaciente").hide();
    $(".consultas").hide();
    $("#container").show();
})
$("#entrar_medico").click(function(){
    $(".card-option").hide();
    $("#container").show();
})

console.log("registroDePacientes",registroDePacientes)
console.log("pacientesInternados",pacientesInternados)
filaAt.print()
filaIn.print()


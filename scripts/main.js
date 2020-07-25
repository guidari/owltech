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
var pacientesInternados = [];
var tamanhoLeito = 3;
var user = new User()
var filaAt = new filaAtendimento()
var filaIn = new filaInternados()

var cpf = document.getElementById("cpf")
cpf.addEventListener("keyup", verificaCpf)


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
}

function atenderPaciente(e) {
    e.preventDefault()
    filaAt.removerPrimeiro()
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
    
    var cpf = $("#cpfLiberar").val()
    var x;
    if(pacientesInternados.length == 0){
        let texto = "Paciente não encontrado"
        textoLiberar(texto)
    }
    for (x in pacientesInternados){
        if(pacientesInternados[x].cpf == cpf) {
            let cpf = pacientesInternados[x].cpf;
            let status = "Alta"
            pacientesInternados.splice('pacientesInternados[i].cpf',1)
            mudarStatus(cpf, status)
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
    
    var cpf = $("#cpfLiberar").val()
    var x;
    if(pacientesInternados.length == 0){
        let texto = "Paciente não encontrado"
        textoLiberar(texto)
    }
    for (x in pacientesInternados){
        if(pacientesInternados[x].cpf == cpf) {
            let cpf = pacientesInternados[x].cpf;
            let status = "Óbito"
            pacientesInternados.splice('pacientesInternados[i].cpf',1)
            mudarStatus(cpf, status)
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
    var i;
    for (i in registroDePacientes){
        if(registroDePacientes[i].cpf === cpf.value){
            console.log(pacientesInternados.indexOf('pacientesInternados[i].cpf'))
            document.getElementById("divConsulta").style.display = "inline";
            document.getElementById('nomeConsultado').innerHTML = registroDePacientes[i].name;
            document.getElementById('cpfConsultado').innerHTML = registroDePacientes[i].cpf;
            document.getElementById('statusConsultado').innerHTML = registroDePacientes[i].status;
            return 1;
        }else {
            document.getElementById("divConsulta").style.display = "none";
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
}

function mudarStatus(cpf, status) {
    for (var i = 0; i < registroDePacientes.length; i++){
        if(registroDePacientes[i].cpf === cpf){
            registroDePacientes[i].status = status
            console.log(registroDePacientes[i].status)
        }else {

        }
    }
}

function verificaCpf() {
    for (var i = 0; i < registroDePacientes.length; i++){
        if(registroDePacientes[i].cpf === cpf.value){
            console.log('CPF já cadastrado')
            document.getElementById("cadastrar").disabled = true;
            //fazer um mensagem aparecer depois
        }else {
            document.getElementById("cadastrar").disabled = false; 
        }
    }
}

function atualizaRegistro() {
    document.getElementById('registroPacientes').innerHTML = "";
    for (var i = 0; i < registroDePacientes.length; i++){ 
        let nome = registroDePacientes[i].name
        let cpf = registroDePacientes[i].cpf
        let status = registroDePacientes[i].status
        $('#registroPacientes').append('<div class="listaRegistro"><p><strong>Nome: </strong><span>'+nome+',</span> <strong>CPF:</strong><span>'+cpf+',</span><br><strong>Status: </strong><span>'+status+'</span></p></div>')
    }
}

function atualizaInternados(){
    document.getElementById('leitosOcupados').innerHTML = "";
    for (var i = 0; i < pacientesInternados.length; i++){ 
        let nome = pacientesInternados[i].name
        let cpf = pacientesInternados[i].cpf
        $('#leitosOcupados').append('<div class="listaRegistro"><p><strong>Nome: </strong><span>'+nome+',</span> <strong>CPF:</strong><span>'+cpf+',</span></p></div>')
    }
}

function textoLiberar(texto) {
    document.getElementById('consultadoPaciente').innerHTML = texto;
    setTimeout(() => {
        document.getElementById('consultadoPaciente').innerHTML = "";
    }, 4000)
}


console.log("registroDePacientes",registroDePacientes)
console.log("pacientesInternados",pacientesInternados)
filaAt.print()
filaIn.print()


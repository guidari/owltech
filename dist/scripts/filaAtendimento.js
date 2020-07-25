export function filaAtendimento() {
    this.lista = new Array();
 
    this.add = function(obj){
        this.lista[this.lista.length] = obj;
    }
 
    this.removerPrimeiro = function(){
        if(this.lista.length > 0){
            var obj = this.lista[0];
            this.lista.splice(0,1);
            document.getElementById('pacienteChamado').innerHTML = obj.name;
            document.getElementById('cpfChamado').innerHTML = obj.cpf;
            document.getElementById('emailChamado').innerHTML = obj.email;
            document.getElementById('idadeChamado').innerHTML = obj.idade;
            perguntas()
        }else{
            erro()
        }
    }
 
    this.lerPrimeiro = function(){
        if(this.lista.length > 0){
            return this.lista[0];
        }else{
            erro()
        }
    }

    this.print = function() {
        console.log("Fila Atendimento", this.lista)
    }

    function erro() {
        document.getElementById('erroPaciente').innerHTML = "Não há pacientes na fila.";
        setTimeout(() => {
            document.getElementById('erroPaciente').innerHTML = "";
        }, 4000)
    }

    function perguntas(){
        document.getElementById("perguntas").style.display = "block";
        document.getElementById("chamar").style.display = "none";
    }
}


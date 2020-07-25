export function filaInternados() {
    this.lista = new Array();
 
    this.add = function(obj){
        this.lista[this.lista.length] = obj;
    }
 
    this.removerPrimeiro = function(){
        if(this.lista.length > 0){
            var obj = this.lista[0];
            this.lista.splice(0,1);
            document.getElementById('pacienteChamado').innerText(obj)
            return obj;     
        }else{
            alert("Não há objetos na fila.")
        }
    }
 
    this.lerPrimeiro = function(){
        if(this.lista.length > 0){
            return this.lista[0];
        }else{
            alert("Não há objetos na fila.")
        }
    }

    this.print = function() {
        console.log("Fila Internados", this.lista)
    }
}
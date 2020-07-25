export default class User {
    constructor(name, idade, email, cpf, status) {
        this.name = name
        this.idade = idade
        this.email = email
        this.cpf = cpf
        this.status = status
    }
}

export function printName(user) {
    console.log(`User's name is ${user.name}`)
}

export function printIdade(user) {
    console.log(`User is ${user.idade} years old`)
}
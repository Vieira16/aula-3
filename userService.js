const User = require("./user")
const path = require("path") //modulo para manipular caminhos
const fs = require("fs")// modulo para manipular arquivos file system
const bcrypt = require("bcryptjs")// modulo para criptografar senha
const mysql = require("./mysql");


class userService {

    async addUser(nome, email, senha, endereco, telefone, cpf, idade) {
        try {
            const senhaCripto = await bcrypt.hash(senha, 10)
            const resultados = await mysql.execute(
                `INSERT INTO usuario (nome, email, idade, endereço, cpf,  telefone, senha)
	                  VALUES (?, ?, ?, ?, ?, ?, ?);`,
                      [nome, email, idade, endereco, cpf, telefone, senhaCripto]
            )
            return resultados
        } catch (error) {
            console.log("Erro ao adicionar usuário", error)
            throw error
        }
    }
    async getUsers(id) {
        try {
            const resultado = await mysql.execute(
                `SELECT idusuario FROM usuario WHERE id = ?`, 
                [id]
            );
            console.log("resultado", resultado)
            return resultado;
            
        } catch (erro) {
            console.log("Erro ao buscar usuários", erro)
        }
    }

    async deleteUser(id) {
        try {
            const user = await this.getUser(id);
        if (!user) {
            console.log("Usuario nao existe!")
            return;
    }
    const resultado = await mysql.execute(
        `DELETE FROM usuario WHERE idusuario = ?`,
        [id]
    )
    return resultado;
        } catch (erro) {
            console.log("Erro ao deletar usuário", erro)
        }
    }

    async updateUser(id, nome, email, idade, endereco, cpf, telefone, senha) {
        try {
            const senhaCripto = await bcrypt.hash(senha, 10)
            const resultados = await mysql.execute(
                `UPDATE usuario
                    SET nome = ?, email = ?, idade = ?, endereço = ?, cpf = ?, telefone = ?, senha = ?
	              WHERE id = ?`
                      [nome, email, idade, endereco, cpf, telefone, senhaCripto, id])
            return resultados
        } catch (erro) {
            console.log("Erro", erro)
            throw erro
        }
    }
}

module.exports = new userService
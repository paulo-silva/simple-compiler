const Base = require('./base')
class Semantica extends Base {
	constructor (conteudo) {
		super('semantico')
		this.conteudo = conteudo
		this.totalParses = this.conteudo.length
		this.declaracaoDeVariaveis = []
	}

	iniciar() {
		var resultadoRegex = null
		this.conteudo.forEach((parse, index) => {
			resultadoRegex = parse.match(/var ([a-z A-Z]+) = (.*)/g)
			if (resultadoRegex) {
				eval(
					parse.replace(/var ([a-z A-Z]+) = (.*)/g,
					`this.adicionarVariavelNaTabelaDeSimbolos(${index}, \'$1\', $2)`)
				)
			} else {
				resultadoRegex = parse.match(/^([a-z A-Z]+) = (.*)/g)

				if (resultadoRegex) {
					eval(parse.replace(/^([a-z A-Z]+) = (.*)/g, `this.verificarSeVariavelFoiDeclarada(${index}, \'$1\', \'$2\')`))
				}
			}
		})
		return this.conteudo
	}

	adicionarVariavelNaTabelaDeSimbolos(linha, varNome, valor) {

		if (typeof this.declaracaoDeVariaveis[varNome] === 'undefined') {
			console.log(`Variável \`${varNome}\` criada na linha ${linha + 1}`.bold.blue)
		} else {
			this.errors = `Variável \`${varNome}\` redeclarada na linha ${linha} (Antes: Linha ${this.declaracaoDeVariaveis[varNome] + 1})`.bold.red
		}
		this.declaracaoDeVariaveis[varNome] = linha
		global.tabelaDeSimbolos = [varNome, valor]
	}

	verificarSeVariavelFoiDeclarada(linha, varNome, valor) {
		if (typeof this.declaracaoDeVariaveis[varNome] === 'undefined') {
			this.errors = `Variável \`${varNome}\` recebendo ${valor} na linha ${linha} não definida!`
		}
	}
}

module.exports = Semantica
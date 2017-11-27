const Base = require('./base')

class Lexica extends Base {
	constructor (conteudo) {
		super('lexico')
		this.conteudo = conteudo
	}

	iniciar () {
		this.conteudo.forEach((parse, index) => {
			const lineNumber = index + 1
			let tokens = parse.split(' ')
			let tokenAntigo = ''
			const qtdeTokens = tokens.length

			for (let i = 0; i < qtdeTokens; i++) {
				tokenAntigo = tokens[i]
				tokens[i] = global.tabelaDeSimbolos.pegarTokenFonteCorrespondente(tokens[i])
			}

			this.conteudo[index] = tokens.join(' ')
		})
		return this.conteudo
	}
}

module.exports = Lexica
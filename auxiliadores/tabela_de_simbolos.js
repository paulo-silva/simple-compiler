class TabelaDeSimbolos {
	constructor () {
		this._tabelaDeSimbolos = [
			['INICIO', ''],
			['VAR', 'var'],
			['inteiro', 0],
			['PARA', 'for'],
			['ATÉ', ';'],
			['FAÇA', '{'],
			['FIMPARA', '}'],
			['IMPRIMIR', 'console.log'],
			['SE', 'if'],
			['ENTÃO', '{'],
			['SENÃO', '} else {'],
			['FIMSE', '}'],
			['FIMPROGRAMA', ''],
			[':=', '='],
			['(', '('],
			[')', ')'],
			['>', '>'],
			['"', '"'],
			['+', '+'],
			['*', '*']
		];

		this.qtdeSimbolos = this._tabelaDeSimbolos.length
		this.tokenAnterior = ''
	}

	get tabelaDeSimbolos () {
		return this._tabelaDeSimbolos
	}

	set tabelaDeSimbolos (value) {
		console.log(`Novo item adicionado à tabela de símbolos: ${value[0]} -> ${value[1]}`.bold.magenta)
		this._tabelaDeSimbolos.push(value)
		this.qtdeSimbolos = this._tabelaDeSimbolos.length
	}

	pegarTokenFonteCorrespondente (token) {
		for (var i = 0; i < this.qtdeSimbolos; i++) {
			if (this._tabelaDeSimbolos[i][0] === token) return this._tabelaDeSimbolos[i][1];
		}

		return token
	}
}

module.exports = TabelaDeSimbolos
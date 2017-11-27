const Base = require('./base')
class Sintatica extends Base {
	constructor (conteudo) {
		super('sintatico')
		this.regrasSintaticas = [
			[/for ([A-Z]+) = ([0-9]+) ; ([0-9]+) {/g, 'for ($1 = $2; $1 <= $3; $1++) {'],
			[/var ([A-Z]+): (.*)/g, 'var $1 = $2'],
			[/(^[a-z A-Z]+ = .*$)/g, '$1'],
			[/IMPRIMIR\((.*)\)/g, 'console.log($1)'],
			[/if ([a-z A-Z]+) (>|<|=|>=|<=|!=) (.*) {/g, 'if ($1 $2 $3) {'],
			[/} else {$/g, '} else {'],
			[/^}$/g, '}'],
		]

		this.conteudo = conteudo
		this.totalParses = this.conteudo.length
		this.totalRegrasSintaticas = this.regrasSintaticas.length
	}

	iniciar () {
		let linhasNaoValidadas = []
			, linhaValidada
			, regraSintatica
			, regex
			, novoConteudo
			, i
		;

		this.conteudo.forEach((parse, index) => {
			linhaValidada = false
			for (i = 0; i < this.totalRegrasSintaticas; i++) {
				regraSintatica = this.regrasSintaticas[i]
				regex = regraSintatica[0]
				novoConteudo = regraSintatica[1]

				if (parse === '') {
					linhaValidada = true
				} else if (parse.match(regex)) {
					linhaValidada = true
					parse = parse.replace(regex, novoConteudo)

					if (typeof regraSintatica[2] === 'string') {
						eval(this.conteudo[index].replace(regex, regraSintatica[2]))
					}
					this.conteudo[index] = parse
				}
			}

			if (!linhaValidada) {
				linhasNaoValidadas.push(index)
			}
		})
		this.armazenarErros(linhasNaoValidadas)
		return this.conteudo
	}

	armazenarErros(linhas) {
		linhas.forEach(linha => {
			this.errors = `Ocorreu um erro sintático na linha ${linha + 1}`
		})
	}

	armazenarVariavelTabelaSimbolo(nomeVariavel, valor) {
		global.tabelaDeSimbolos.tabelaDeSimbolos = [ nomeVariavel, valor ]
	}
}

module.exports = Sintatica
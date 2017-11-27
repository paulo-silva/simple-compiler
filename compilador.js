const fs = require('fs')
const Lexica = require('./fases/lexica')
const Sintatica = require('./fases/sintatica')
const Semantica = require('./fases/semantica')
const TabelaDeSimbolos = require('./auxiliadores/tabela_de_simbolos')
const exec = require('child_process').exec;

global.tabelaDeSimbolos = new TabelaDeSimbolos()

class Compilador {

	constructor (conteudo) {
		this.conteudo = conteudo
		this.limparCodigo()
		this._errors = []
	}

	get errors () {
		return this._errors
	}

	set errors (value) {
		this._errors.push(value)
	}

	limparCodigo() {
		let arg = [
			[ /( )+/g, ' ' ], // Troca espaços seguidos por apenas 1
			[ /\t/g, ''], // Remove tabulações
			[/\/\/.*/g, ''] // Remove comentários
		]

		for (let i = 0; i < arg.length; i++) {
			this.conteudo = this.conteudo.replace(arg[i][0], arg[i][1])
		}

		this.conteudo = this.conteudo.split("\n")

		this.removerEspacosEmStrings()
		// this.removerLinhasEmBranco()
	}

	removerEspacosEmStrings() {
		var delimitadorString;
		this.conteudo.forEach((parse, index) => {
			delimitadorString = parse.match(/"(.*)"/g)
			if (delimitadorString) {
				delimitadorString = delimitadorString[0].replace(/\s/g, '&nbsp;')
				parse = parse.replace(/"(.*)"/g, `${delimitadorString}`)
				this.conteudo[index] = parse
			}
		});
	}

	executarAnalises() {
		[
			['lexica', 'cyan'],
			['sintatica', 'magenta'],
			[ 'semantica', 'blue' ],
		].forEach(analise => {
			const className = analise[0].charAt(0).toUpperCase() + analise[0].slice(1)
			eval(`
				console.log('Análise ${analise[0]} iniciada'.bold.${analise[1]})
				const ${analise[0]} = new ${className}(this.conteudo)
				this.conteudo = ${analise[0]}.iniciar()
				if (${analise[0]}.errors.length) {
					console.log((${analise[0]}.errors.bold).red)
				} else {
					console.log('Nenhum erro encontrado!'.bgWhite.bold.black)
				}
				console.log('Análise ${analise[0]} finalizada'.bold.${analise[1]})
			`)
		})
	}

	salvarCodigoEExecutar() {
		const codigo = this.conteudo.join("\n").replace(/&nbsp;/g, ' ')
		fs.writeFile(`${process.argv[2]}.compiled`, codigo, function (err) {
			if (err) {
				return console.log(err);
			}

			console.log(`Resultado da compilação salvo em ${process.argv[2]}.compiled`.bold.green);
		});

		this.executar()
	}

	executar() {
		exec(`node ${process.argv[2]}.compiled`, { timeout: 3000 }, function (error, stdout, stderr) {
			if (error) {
				console.log('Não foi possível executar o programa,'.red)
				console.log('isso pode ocorrer por diversas maneiras, sendo a mais comum um loop infinito'.red)
				throw error
			}
			console.log('Resultado da execução:'.yellow)
			console.log(stdout.bold.yellow)
			console.log(`Fim de execução...`.yellow)
		})
	}
}

global.colors = require('colors');

if (typeof process.argv[2] !== 'string') {
	console.log('Nome do arquivo não informado!')
	process.exit(1)
}

fs.readFile(process.argv[2], 'utf8', (error, conteudo) => {
	if (error) {
		console.log(`Não foi possível abrir o arquivo "${process.argv[2]}"`.bold.red)
		process.exit()
	}
	console.log(`Arquivo "${process.argv[2]}" encontrado!`.bold.green)
	console.log('Iniciando fase compilação...'.bold.green)

	compilador = new Compilador(conteudo)
	compilador.executarAnalises()
	// compilador.analiseSintatica()
	// compilador.analiseSemantica()
	console.log('Fase de compilação finalizada!...'.bold.green)
	compilador.salvarCodigoEExecutar()

})

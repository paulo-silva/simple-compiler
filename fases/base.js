class Base {

	constructor (type) {
		this._errors = []
		this.type = type
	}

	get errors() {
		return this._errors.join("\n")
	}

	set errors(value) {
		this._errors.push(`[ERRO ${this.type.toUpperCase()}] ${value}`)
	}

	removerLinhasEmBranco() {
		this.conteudo.forEach((parse, index) => {
			if (parse === '') {
				this.conteudo.splice(index, 1)
				global.linhasRemovidas++
			}
		})
	}
}

module.exports = Base
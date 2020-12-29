const COST = 'Cur_OfficialRate';
const ABR = 'Cur_Abbreviation';
const SCALE = 'Cur_Scale';
const INP = 'in_';
const SELECT = ' ✓';
const CON = 'con_';
let hidden = true;

const exchangeRate = {
	url: "https://www.nbrb.by/api/exrates/rates?periodicity=0",
	currency: new Map(),
	rate: ['USD', 'EUR', 'RUB', 'UAH'],
	async getRate(){
		let response = await fetch(exchangeRate.url);
		let data = await response.json();
		data.forEach((name, index) => {
			exchangeRate.currency.set(name[ABR], data[index]);
		});
		this.showRate();
		this.fill();
	},
	showRate(){
		this.rate.forEach((curName) => {
			document.getElementById(curName).textContent = exchangeRate.currency.get(curName)[COST];
			this.calculate(curName, 1);
		});
	},
	fill(){
		document.getElementById(INP + 'BYN').value = 1;
	},
	calculate(curName, sum){
		const res = (Math.round(((sum / this.currency.get(curName)[COST] * this.currency.get(curName)[SCALE]))*100)/100);
		document.getElementById(INP + curName).value = res;
	},
	update(obj){
		const curName = obj.id.slice(3, 6);
		if(obj.value != ''){
			if(curName == 'BYN'){
				this.rate.forEach((cur) => this.calculate(cur, obj.value));
			}else{
				const byn = (obj.value * this.currency.get(curName)[COST] / this.currency.get(curName)[SCALE]);
				document.getElementById('in_BYN').value = (Math.round(byn*100)/100);
				this.rate.forEach((cur) => this.calculate(cur, byn));
			}
		}else{
			document.getElementById(INP + 'BYN').value = '';
			this.rate.forEach((cur) => document.getElementById(INP + cur).value = '');
		}
	},
}

var show = {
	list(obj){
		document.getElementById('currency_list').hidden = true;

		if(obj.textContent.slice(obj.textContent.length-2) == SELECT){
			this.add(obj);
		}else{
			this.hide(obj);
		}
	},
	addCurrency(){
		document.getElementById('currency_list').hidden = false;
		hidden = false;
	},
	add(obj){
		const nameCur = obj.textContent.slice(obj.textContent.length - 5, obj.textContent.length - 2);

		obj.textContent = obj.textContent.slice(0, obj.textContent.length - 2);

		exchangeRate.rate.forEach((el, index) => {
			if(el == nameCur){
				exchangeRate.rate.splice(index, 1);
			}
		});

		document.getElementById(CON + nameCur).remove();
	},
	hide(obj){
		const nameCur = obj.textContent.slice(obj.textContent.length - 3);

		obj.textContent += SELECT;

		let text = document.createElement('div');
		text.className = 'converter';
		text.id = CON + nameCur;
		text.innerHTML = '<input type="number" id="in_' + nameCur + '" class="inp" name="" oninput="exchangeRate.update(this)">';
		text.innerHTML += '<div class="name_currency">' + nameCur +'</div>';
		document.getElementById('converter').append(text);

		exchangeRate.rate.push(nameCur);
		exchangeRate.calculate(nameCur, document.getElementById('in_BYN').value);
	}

}

document.onclick = (() => {
	document.getElementById('currency_list').hidden = hidden;
	hidden = true;
});

exchangeRate.getRate();

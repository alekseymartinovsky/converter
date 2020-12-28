const cost = 'Cur_OfficialRate';
const abr = 'Cur_Abbreviation';
const scale = 'Cur_Scale';
const inp = 'in_';
let hidden = true;
const select = ' ✓';
const con = 'con_';

document.getElementById('currency_list').hidden = true;

const exchangeRate = {
	url: "https://www.nbrb.by/api/exrates/rates?periodicity=0",
	currency: new Map(),
	rate: ['USD', 'EUR', 'RUB', 'UAH'],
	async getRate(){
		let response = await fetch(exchangeRate.url);
		let data = await response.json();
		data.forEach((name, index) => {
			exchangeRate.currency.set(name[abr], data[index]);
		});
		this.showRate();
		this.fill();
	},
	showRate(){
		this.rate.forEach((curName) => {
			document.getElementById(curName).textContent = exchangeRate.currency.get(curName)[cost];
			this.calculate(curName, 1);
		});
	},
	fill(){
		document.getElementById(inp + 'BYN').value = 1;
	},
	calculate(curName, sum){
		let res = (Math.round(((sum / this.currency.get(curName)[cost] * this.currency.get(curName)[scale]))*100)/100);
		document.getElementById(inp + curName).value = res;
	},
	update(obj){
		let curName = obj.id.slice(3, 6);
		if(obj.value != ''){
			if(curName == 'BYN'){
				this.rate.forEach((cur) => {
					this.calculate(cur, obj.value);
				});
			}else{
				let byn = (obj.value * this.currency.get(curName)[cost] / this.currency.get(curName)[scale]);
				document.getElementById('in_BYN').value = (Math.round(byn*100)/100);
				this.rate.forEach((cur) => {
					this.calculate(cur, byn);
				});
			}
		}else{
			document.getElementById(inp + 'BYN').value = '';
			this.rate.forEach((cur) => {
				document.getElementById(inp + cur).value = '';
			});
		}
	},
}

var show = {
	list(obj){
		document.getElementById('currency_list').hidden = true;

		if(obj.textContent.slice(obj.textContent.length-2) == select){
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
		let nameCur = obj.textContent.slice(obj.textContent.length - 5, obj.textContent.length - 2);

		obj.textContent = obj.textContent.slice(0, obj.textContent.length - 2);

		exchangeRate.rate.forEach((el, index) => {
			if(el == nameCur){
				exchangeRate.rate.splice(index, 1);
			}
		});

		document.getElementById(con + nameCur).remove();
	},
	hide(obj){
		let nameCur = obj.textContent.slice(obj.textContent.length - 3);

		obj.textContent += select;

		let text = document.createElement('div');
		text.className = 'converter';
		text.id = con + nameCur;
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

function log(name){
	console.log(name);
}


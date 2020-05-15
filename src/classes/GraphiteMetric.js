import Metric from "@/classes/Metric";

export default class GraphiteMetric extends Metric {
	constructor(chart, shift, index) {
		super();
		if (typeof chart === "object") {
			this._chart = chart.chart;
			this._shift = chart.shift;
			this._index = chart.index;
			return;
		}
		this._chart = chart;
		this._shift = shift;
		this._index = index;
	}

	get chart() {
		return this._chart;
	}

	set chart(value) {
		this._chart = value;
	}

	get shift() {
		return this._shift;
	}

	set shift(value) {
		this._shift = value;
	}

	get index() {
		return this._index;
	}

	set index(value) {
		this._index = value;
	}

	get shiftHint() {
		return this.shift ? ` (timeShift ${this.shift})` : "";
	}

	isEmpty() {
		return !this.chart;
	}

	metricUrl(refDate) {
		if (this.isEmpty()) {
			return "";
		}

		let refMonth = `0${refDate.getMonth() + 1}`.slice(-2);
		let refDay = `0${refDate.getDate()}`.slice(-2);
		let refYear = refDate.getFullYear();

		let refNextDate = new Date(refDate.valueOf());
		refNextDate.setDate(refNextDate.getDate() + 1);
		let refNextMonth = `0${refNextDate.getMonth() + 1}`.slice(-2);
		let refNextDay = `0${refNextDate.getDate()}`.slice(-2);
		let refNextYear = refNextDate.getFullYear();

		let randomParam = parseInt(Math.random() * 100000000);

		let metricPath = this.chart;
		if (this.shift) {
			metricPath = `timeShift(${metricPath}%2C%22${this.shift}%22)`;
		}

		let template = `https://mongraphite.booking.com/render?`
			+ `from=000000_${refYear}${refMonth}${refDay}&until=000000_${refNextYear}${refNextMonth}${refNextDay}`
			+ `&target=${metricPath}&format=csv`
			+ `&rnd=${randomParam}`;

		// for dev purposes
		// console.log(template);
		// return "http://localhost:8080/render.csv";
		return template;
	}
}

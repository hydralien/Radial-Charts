export default class Metric {
	constructor() {
		this._index = 0;
	}

	get index() {
		return this._index;
	}

	get shiftHint() {
		return "";
	}

	hintText() {
		let chartIndex = this.index;
		let shiftHint = this.shiftHint;

		return `metric ${chartIndex}${shiftHint}: {valueY}`;
	}

	isEmpty() {
		return true;
	}

	// eslint-disable-next-line no-unused-vars
	metricUrl(refDate) {
		return "";
	}
}
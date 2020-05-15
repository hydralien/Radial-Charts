import Metric from "@/classes/Metric";

export default class UrlMetric extends Metric {
	constructor(url, index) {
		super();
		if (typeof url === "object") {
			this._url = url.url;
			this._index = url.index;
			return;
		}
		this._url = url;
		this._index = index;
	}

	get url() {
		return this._url;
	}

	set url(value) {
		this._url = value;
	}

	get index() {
		return this._index;
	}

	set index(value) {
		this._index = value;
	}

// an alias for compatibility
	get chartUrl() {
		return this._url;
	}

	set chartUrl(chartUrl) {
		this._url = chartUrl;
	}

	isEmpty() {
		return !this.url;
	}

	metricUrl(refDate) {
		if (this.isEmpty()) {
			return "";
		}
		let urlCopy = this.url;
		let datePlaceholder = '{referenceDate}';
		if (urlCopy.includes(datePlaceholder)) {
			urlCopy.replace(datePlaceholder, refDate.toDateString());
		}
		return urlCopy;
	}

}
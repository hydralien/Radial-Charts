<template>
	<div id="app">
		<Tabs @changed="chartSourceChange">
<!--			<Tab name="Graphite metrics" :id="chartSources.GRAPHITE">-->
<!--				<div id="graphite-alert" v-if="!graphiteUrlAvailable">-->
<!--					<p>GraphiteMetric.GRAPHITE_SITE_URL should be defined to use Graphite metrics</p>-->
<!--				</div>-->
<!--				<div v-for="(chart,id) in chartList" v-bind:key="id">-->
<!--					&lt;!&ndash;<label>Metric URL: <input class="chart-url" v-model.lazy="chart.chartUrl"></label>&ndash;&gt;-->
<!--					<label>Metric path: <input class="chart-url" v-model.lazy="chart.chart"></label>-->
<!--					<label>Time shift: <input v-model.lazy="chart.shift"></label>-->
<!--					<button @click="deleteChart(id)">delete</button>-->
<!--				</div>-->
<!--			</Tab>-->
			<Tab name="Data URLs" :id="chartSources.URL">
				<div id="urls-alert">
					<p>Use {referenceDate} in the URL to replace it with the selected date (if required)</p>
				</div>
				<div v-for="(chart,id) in chartUrls" v-bind:key="id">
					<label>Metric URL: <input class="chart-url" v-model.lazy="chart.chartUrl"></label>
					<button @click="deleteUrl(id)">delete</button>
				</div>
			</Tab>
		</Tabs>

		<label>Reference date:
			<Datepicker
					v-model.lazy="referenceDate"
					id="referenceDate"
					:monday-first="true"
			></Datepicker>
		</label>


		<CircularChart
				v-bind:chart-list="chartList"
				v-bind:chart-urls="chartUrls"
				v-bind:reference-date="referenceDate"
				v-bind:chart-source="chartSource"
		></CircularChart>

	</div>
</template>

<script>
	import CircularChart from "@/components/CircularChart";
	import Datepicker from 'vuejs-datepicker';
	import {Tabs, Tab} from 'vue-tabs-component';
	import GraphiteMetric from "@/classes/GraphiteMetric";
	import UrlMetric from "@/classes/UrlMetric";
	import {ChartDataSource} from "@/classes/ChartDataSource";

	export default {
		name: 'App',
		data() {
			return {
				chartList: [],
				referenceDate: new Date(),
				chartUrls: [],
				chartSource: ChartDataSource.URL,
				chartSources: ChartDataSource,
				graphiteUrlAvailable: GraphiteMetric.GRAPHITE_SITE()
			}
		},
		components: {
			Tabs,
			Tab,
			Datepicker,
			CircularChart
		},
		watch: {
			chartList: {
				deep: true,
				handler() {
					this.refreshQueryString();
					if (this.$data.chartList[this.$data.chartList.length - 1].chart) {
						this.$data.chartList.push(new GraphiteMetric());
					}
				}
			},
			chartUrls: {
				deep: true,
				handler() {
					this.refreshQueryString();
					if (this.chartUrls[this.chartUrls.length - 1].chartUrl) {
						this.chartUrls.push(new UrlMetric());
					}
				}
			},
			referenceDate() {
				this.refreshQueryString();
			}
		},
		methods: {
			chartSourceChange(selectedTab) {
				this.chartSource = selectedTab.tab.id;
				console.log(this.chartSource);
			},
			refreshQueryString() {
				let queryDate = this.$data.referenceDate.toDateString();
				if (queryDate === new Date().toDateString()) {
					queryDate = "today";
				}
				let newQsObject = {
					refdate: queryDate,
					chart: [],
					shift: [],
					charturl: []
				};
				this.$data.chartList.forEach(chartItem => {
					if (!chartItem.chart) {
						return;
					}
					newQsObject.chart.push(chartItem.chart);
					newQsObject.shift.push(chartItem.shift);
				});
				this.chartUrls.forEach(chartItem => {
					if (!chartItem.chartUrl) {
						return;
					}
					newQsObject.charturl.push(chartItem.chartUrl);
				});
				this.$router.replace({query: newQsObject}).catch(() => {
				});
			},
			deleteChart(chartIndex) {
				this.chartList.splice(chartIndex, 1);
			},
			deleteUrl(urlIndex) {
				this.chartUrls.splice(urlIndex, 1);
			}
		},
		created() {
			if (this.$route.query.refdate) {
				if (this.$route.query.refdate === "today") {
					this.$data.referenceDate = new Date();
				} else {
					this.$data.referenceDate = new Date(this.$route.query.refdate);
				}
			}
			if (this.$route.query.chart) {
				let urlChartList = [];
				let chartListEnsured = typeof(this.$route.query.chart) === "object" ? this.$route.query.chart : [this.$route.query.chart];
				let shiftListEnsured = typeof(this.$route.query.shift) === "object" ? this.$route.query.shift : [this.$route.query.shift];
				for (let chartIndex = 0; chartIndex < chartListEnsured.length; chartIndex++) {
					let chartObject = new GraphiteMetric(
						chartListEnsured[chartIndex],
						this.$route.query.shift ? shiftListEnsured[chartIndex] : ""
					);
					urlChartList.push(chartObject);
				}
				this.$data.chartList = urlChartList;
			}
			if (this.$route.query.charturl) {
				let urlChartList = [];
				let urlListEnsured = typeof(this.$route.query.charturl) === "object" ? this.$route.query.charturl : [this.$route.query.charturl];
				urlListEnsured.forEach(chartUrl => {
					let chartUrlObject = new UrlMetric(
						chartUrl
					);
					urlChartList.push(chartUrlObject);
				});
				this.chartUrls = urlChartList;
			}
			if (this.$data.chartList.length === 0) {
				let defaultChart = new GraphiteMetric(
					"",
					""
				);
				this.$data.chartList = [defaultChart, new GraphiteMetric()];
			}
			if (this.chartUrls.length === 0) {
				let defaultChart = new UrlMetric("./render.csv");
				this.chartUrls.push(defaultChart, new UrlMetric());
			}
		}
	}
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}

	#graphite-alert {
		font-size: large;
		font-weight: bold;
		color: red;
	}

	.chart-url {
		width: 500px;
	}

	input {
		margin: 5px;
		padding: 3px;
	}

	.vdp-datepicker {
		display: inline-block;
	}

	/* tabs CSS */

	.tabs-component {
		margin: 1em 0;
	}

	.tabs-component-tabs {
		border: solid 1px #ddd;
		border-radius: 6px;
		margin-bottom: 5px;
	}

	@media (min-width: 700px) {
		.tabs-component-tabs {
			border: 0;
			align-items: stretch;
			display: flex;
			justify-content: flex-start;
			margin-bottom: -1px;
		}
	}

	.tabs-component-tab {
		color: #999;
		font-size: 14px;
		font-weight: 600;
		margin-right: 0;
		list-style: none;
	}

	.tabs-component-tab:not(:last-child) {
		border-bottom: dotted 1px #ddd;
	}

	.tabs-component-tab:hover {
		color: #666;
	}

	.tabs-component-tab.is-active {
		color: #000;
	}

	.tabs-component-tab.is-disabled * {
		color: #cdcdcd;
		cursor: not-allowed !important;
	}

	@media (min-width: 700px) {
		.tabs-component-tab {
			background-color: #fff;
			border: solid 1px #ddd;
			border-radius: 3px 3px 0 0;
			margin-right: .5em;
			transform: translateY(2px);
			transition: transform .3s ease;
		}

		.tabs-component-tab.is-active {
			border-bottom: solid 1px #fff;
			z-index: 2;
			transform: translateY(0);
		}
	}

	.tabs-component-tab-a {
		align-items: center;
		color: inherit;
		display: flex;
		padding: .75em 1em;
		text-decoration: none;
	}

	.tabs-component-panels {
		padding: 1em 0;
	}

	@media (min-width: 700px) {
		.tabs-component-panels {
			border-top-left-radius: 0;
			background-color: #fff;
			border: solid 1px #ddd;
			border-radius: 0 6px 6px 6px;
			box-shadow: 0 0 10px rgba(0, 0, 0, .05);
			padding: 1em 1em;
		}
	}
</style>

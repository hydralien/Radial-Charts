<template>
	<div class="chart-container">
		<div id="loading" v-if="reloading">...LOADING...</div>
		<div id="amChart" class="chart-container"></div>
	</div>
</template>

<script>
	import * as am4core from "@amcharts/amcharts4/core";
	import * as am4charts from "@amcharts/amcharts4/charts";
	import am4themes_animated from "@amcharts/amcharts4/themes/animated";
	import * as csvParse from "csv-parse/lib/sync";
	import {ChartDataSource} from "@/classes/ChartDataSource";

	am4core.useTheme(am4themes_animated);
	export default {
		name: "CircularChart",
		data: function () {
			return {
				mergedMetrics: {},
				reloading: false,
				reloadingProcess: Promise.resolve(),
				mergedChartInfo: []
			};
		},
		props: {
			chartList: [Object, Array],
			chartUrls: [Object, Array],
			referenceDate: Date,
			chartSource: String
		},
		mounted() {
			this.chartDataMerge();
		},
		watch: {
			chartDetails: {
				deep: true,
				handler() {
					this.drawChart();
				}
			},
			referenceDate() {
				this.chartDataMerge();
			},
			chartList: {
				deep: true,
				handler() {
					this.chartDataMerge();
				}
			},
			chartUrls: {
				deep: true,
				handler() {
					this.chartDataMerge();
				}
			},
			chartSource() {
				this.chartDataMerge();
			}
		},
		methods: {
			transformMergedData() {
				let dataList = [];
				Object.keys(this.$data.mergedMetrics).forEach(
					dateKey => {
						if (dateKey.startsWith("__")) {
							return;
						}
						let dateObject = {date: Date.parse(dateKey)};

						dataList.push(Object.assign(dateObject, this.$data.mergedMetrics[dateKey]));
					}
				);

				return dataList;
			},
			drawChart() {
				let chart = am4core.create(
					this.$el.getElementsByClassName("chart-container")[0],
					am4charts.RadarChart
				);

				chart.data = this.transformMergedData();

				let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
				dateAxis.dataFields.category = "date";
				dateAxis.tooltip.disabled = false;
				dateAxis.groupData = true;
				// dateAxis.groupCount = 1000;
				dateAxis.periodChangeDateFormats.setKey("day", "yyyy");

				var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
				valueAxis.renderer.axisFills.template.fill = chart.colors.getIndex(2);
				valueAxis.renderer.axisFills.template.fillOpacity = 0.05;
				valueAxis.tooltip.disabled = true;

				this.$data.mergedChartInfo.forEach(chartInfo => {
					if (chartInfo.isEmpty()) {
						return;
					}

					let valueField = "value" + chartInfo.index;

					let series = chart.series.push(new am4charts.RadarSeries());
					series.dataFields.valueY = valueField;
					series.groupFields.valueY = "sum";
					series.dataFields.dateX = "date";
					series.name = "Chart " + valueField;
					series.strokeWidth = 3;
					series.tooltipText = chartInfo.hintText();
					series.tooltip.disabled = false;
					//series.fill = am4core.color("#CDA2AB");
					series.fillOpacity = 0.3;
				});

				chart.cursor = new am4charts.RadarCursor();

				// this.chartDisposal();
				this.chart = chart;
			},
			chartDisposal() {
				if (this.chart) {
					this.chart.dispose();
				}
			},
			appendArray(newArray, chartInfo) {
				// let chartInfo = chartInfoClosure();
				this.$data.mergedChartInfo.push(chartInfo);
				let targetObject = this.$data.mergedMetrics;

				let level = chartInfo.index;
				let valueField = "value" + level;

				newArray.forEach(
					dataLine => {
						// Graphite CSV looks like
						// 0: chart name
						// 1: date
						// 2: data point
						// but we'll assume there could be just date and data point, so last two columns
						let lineDate = dataLine[dataLine.length - 2];
						let lineDataPoint = dataLine[dataLine.length - 1];

						if (!targetObject[lineDate]) {
							targetObject[lineDate] = {};
						}
						targetObject[lineDate][valueField] = lineDataPoint;
					}
				);
			},
			chartDataMerge() {
				let promisesList = [];

				if (this.reloading) {
					// this does too many reloads, needs optimising first
					//this.reloadingProcess.then(() => {this.chartDataMerge()});
					return;
				}

				this.$data.reloading = true;
				this.$data.mergedMetrics = {};
				this.$data.mergedChartInfo = [];
				let httpClient = this.$http;

				let chartIndex = 0;
				let metricsList = this.chartSource === ChartDataSource.URL ? this.chartUrls : this.chartList;
				metricsList.forEach(chart => {
					chartIndex += 1;
					let chartUrl = chart.metricUrl(this.referenceDate);
					if (!chartUrl) {
						return;
					}
					let chartPromise = function (chartInfo) {
						return httpClient
							.get(chartUrl)
							.then(responseData => {
								let parsedMetrics = csvParse(
									responseData.data,
									{
										skip_empty_lines: true,
										columns: false
									}
								);
								this.appendArray(parsedMetrics, chartInfo);
							})
							.catch(error => console.error(error));
					}.bind(this);

					let newChart = Object.assign(chart);
					newChart.index = chartIndex;
					promisesList.push(chartPromise(newChart));
				});

				this.reloadingProcess = this.$http.all(promisesList).then(() => {
					this.$data.reloading = false;
					this.drawChart();
				});
			},
			beforeDestroy() {
				this.chartDisposal();
			}
		}
	}
</script>

<style scoped>
	#chart-group {
		width: 100%;
		min-height: 1000px;
	}

	#loading {
		font-weight: bold;
		font-size: large;
		color: red;
		margin: 20px;
	}

	.chart-container {
		width: 100%;
		min-height: 600px;
	}
</style>
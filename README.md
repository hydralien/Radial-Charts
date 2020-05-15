# Radial Chart

## Why

I wanted to plot the data that is tightly connected to a time of a day (like number of bookings) 
as a circular chart, resembling the clock face - for no particular reason other than checking out how it looks.

Another thing I wanted to do was to play with some relatively modern JS framework.

And then I also got a bit a of a spare time on my hands.

## What

So as a result, here's a code that fetches CSV data from Graphite metrics (or any other CSV file) and displays it on a radial chart (aka Radar chart).
It's crude and unoptimised and inefficient, but it serves the goal of visual representation (see examples section below).

It's mostly an amCharts showcase (and, accidentally, GitLab pages) - amCharts are amazing (turned out, GitLab pages are too), I love them dearly. Check them out if you're not familiar, there's seemingly nothing you can't do with them: https://www.amcharts.com/demos/ 

As a bonus point, it is built into GitLab pages via CI pipeline, and served from GitLab, so no extra maintenance for Kubernetes app or other resource.

## Examples

- Bookings today vs last week vs last year: https://bturchik.pages.booking.com/radial-chart/?refdate=today&chart=ddos.new_detector.subtype.all.bookings.agg_001_min.have.avg.ewa_100&chart=ddos.new_detector.subtype.all.bookings.agg_001_min.have.avg.ewa_100&chart=ddos.new_detector.subtype.all.bookings.agg_001_min.have.avg.ewa_100&shift=&shift=1w&shift=1y&charturl=.%2Frender.csv
- Office pageviews Wed vs Sun: https://bturchik.pages.booking.com/radial-chart/?refdate=Wed%20May%2013%202020&chart=general.tuning.five_minutely.per_persona.intranet.summary.all.pageviews_sum&chart=general.tuning.five_minutely.per_persona.intranet.summary.all.pageviews_sum&shift=&shift=3d&charturl=.%2Frender.csv
- Tasks running on Clustered Cron: https://bturchik.pages.booking.com/radial-chart/?refdate=Wed%20May%2013%202020&chart=summarize%28sum%28general.clusteredcron.tasks.hosts.%2a.%2a.starting_sum%29,%223min%22%29&shift=&charturl=.%2Frender.csv

## Shortcomings

- it's not a working tool or a developing project - it's a fun thing built for no reason 
- it loads a ton of unnecessary libraries, becasue how amCharts library for Vue.js is sructured, and also because it's not optimised for anything
- it only works with one-metric Graphite data, so no `dc.*.*.*.pageviews_sum` (unless you sum it)
- &lt; _many other things_ &gt;

## Vue auto-generated help

### Project setup
```
yarn install
```

#### Compiles and hot-reloads for development
```
yarn serve
```

#### Compiles and minifies for production
```
yarn build
```

#### Lints and fixes files
```
yarn lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

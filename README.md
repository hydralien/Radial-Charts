# Radial Chart

## Why

I wanted to plot the data that is tightly connected to a time of a day 
as a circular chart, resembling the clock face - for no particular reason other than checking out how it looks.

Another thing I wanted to do was to play with some relatively modern JS framework.

And then I also got a bit a of a spare time on my hands.

## What

So as a result, here's a code that fetches CSV data from Graphite metrics (or any other CSV file) and displays it on a radial chart (aka Radar chart).
It's crude and unoptimised and inefficient, but it serves the goal of visual representation (see examples section below).

It's mostly an amCharts showcase - amCharts are amazing, I love them dearly. Check them out if you're not familiar, there's seemingly nothing you can't do with them: https://www.amcharts.com/demos/ 

## Examples


## Shortcomings

- it's not a working tool or a developing project - it's a fun thing built for no reason 
- it loads a ton of unnecessary libraries, becasue how amCharts library for Vue.js is structured, and also because it's not optimised for anything
- &lt;_many other things_&gt;

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

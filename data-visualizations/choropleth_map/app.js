const body = d3.select('body');

const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const tooltip = body.append('div').attr('class', 'tooltip').attr('id', 'tooltip').style('opacity', 0);

let unemployment = d3.map();

let path = d3.geoPath();

const xScale = d3.scaleLinear().domain([ 2.6, 75.1 ]).rangeRound([ 600, 860 ]);

const color = d3.scaleThreshold().domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8)).range(d3.schemeGreens[9]);

const g = svg.append('g').attr('class', 'key').attr('id', 'legend').attr('transform', 'translate(0, 40)');

g
	.selectAll('rect')
	.data(
		color.range().map((d) => {
			d = color.invertExtent(d);
			if (d[0] === null) d[0] = xScale.domain()[0];
			if (d[1] === null) d[1] = xScale.domain()[1];
			return d;
		})
	)
	.enter()
	.append('rect')
	.attr('height', 8)
	.attr('x', (d) => xScale(d[0]))
	.attr('width', (d) => xScale(d[1]) - xScale(d[0]))
	.attr('fill', (d) => color(d[0]));

g
	.append('text')
	.attr('class', 'caption')
	.attr('x', xScale.range()[0])
	.attr('y', -6)
	.attr('fill', '#000')
	.attr('text-anchor', 'start')
	.attr('font-weight', 'bold');

g
	.call(d3.axisBottom(xScale).tickSize(13).tickFormat((x) => `${Math.round(x)}%`).tickValues(color.domain()))
	.select('.domain')
	.remove();

const EDUCATION_FILE =
	'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const COUNTY_FILE =
	'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

d3.queue().defer(d3.json, COUNTY_FILE).defer(d3.json, EDUCATION_FILE).await(ready);

function ready(error, us, education) {
	if (error) throw error;

	svg
		.append('g')
		.attr('class', 'countries')
		.selectAll('path')
		.data(topojson.feature(us, us.objects.counties).features)
		.enter()
		.append('path')
		.attr('class', 'county')
		.attr('data-flips', (d) => d.id)
		.attr('data-education', (d) => {
			let result = education.filter((obj) => obj.fips === d.id);
			if (result[0]) return result[0].bachelorsOrHigher;
			return 0;
		})
		.attr('fill', (d) => {
			let result = education.filter((obj) => obj.fips === d.id);
			if (result[0]) return color(result[0].bachelorsOrHigher);
			return color(0);
		})
		.attr('d', path)
		.on('mouseover', (d) => {
			tooltip.style('opacity', 0.9);
			tooltip
				.html(() => {
					let result = education.filter((obj) => obj.fips === d.id);
					if (result[0]) {
						return `${result[0]['area_name']}, ${result[0]['state']}: ${result[0].bachelorsOrHigher}%`;
					}
					return 0;
				})
				.attr('data-education', () => {
					let result = education.filter((obj) => obj.fips === d.id);
					if (result[0]) return result[0].bachelorsOrHigher;
					return 0;
				})
				.style('left', `${d3.event.pageX + 10}px`)
				.style('top', `${d3.event.pageY - 28}px`);
		})
		.on('mouseout', (d) => tooltip.style('opacity', 0));

	svg
		.append('path')
		.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
		.attr('class', 'states')
		.attr('d', path);
}

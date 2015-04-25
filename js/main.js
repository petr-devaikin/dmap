window.onload = function() {
    var width = 1000,
        height = 600;

    var textureSize = 5;

    var svg = d3.select('svg');

    var color = d3.scale.pow()
        .exponent(0.25)
        .domain([0, 4727])
        .range([0, textureSize]);

    var projection = d3.geo.albers()
        .rotate([-105, 0])
        .center([-10, 65])
        .parallels([52, 64])
        .scale(600)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path().projection(projection);

    queue()
        .defer(d3.json, "js/regions.json")
        .defer(d3.csv, "js/density.csv")
        .await(drawRegion);

    function drawRegion(error, map, density) {
        var regions = {};

        density.forEach(function(d) {
            regions[d.Code] = d;
        })

        svg.selectAll('.region')
                .data(topojson.object(map, map.objects.russia).geometries)
            .enter().append('path')
                .classed('region', true)
                .attr('d', path)
                .style('fill', function(d) {
                    if (regions[d.properties.region] === undefined) {
                        console.log(d.properties.region);
                        return 'silver';
                    }
                    var t = textures.circles()
                        .size(textureSize)
                        .radius(color(regions[d.properties.region].Density) * 1.4)
                        .fill('#999');

                    svg.call(t);

                    return t.url();
                });
    }
}
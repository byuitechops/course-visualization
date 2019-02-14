//create html template DONE
//"create" a bubble visualization 
//inject that bubble visualization in the html template
const fs = require('fs');
const moment = require('moment');

function createHtml(name) {
    const htmlTemplate = `
        <html>
            <head>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.3.0/d3.js"></script>
                <script src="http://dimplejs.org/dist/dimple.v2.3.0.js"></script>
                <!-- <script src="dimple2-3-0.js"></script> -->
            </head>

            <body>
                <div id="chart">${injectBubbles()}<div>
            </body>
        </html>
    `;

    let time = moment().format('LL');
    let path = `./${name}-(${time}).html`;

    fs.writeFile(path.replace(' ', ''), htmlTemplate, err => {
        if (err) console.log(err);
    });
}

function injectBubbles() {
    let data = [{
            "Name": "Standard Resources",
            "ModulePosition": 1,
            "Module Name": "Instructor Resources (Do NOT Publish)",
            "Position": -1,
            "Points": 0,
            "Type": "SubHeader"
        },
        {
            "Name": "End of Course Evaluation",
            "ModulePosition": 1,
            "Module Name": "Instructor Resources (Do NOT Publish)",
            "Position": -2,
            "Points": 0,
            "Type": "ExternalUrl"
        }
    ];

    return `
        <script type="text/javascript">
        var data = ${JSON.stringify(data, null, 4)};
        var svg = dimple.newSvg("#chart", 1600, 800);
        max = d3.max(data, d => d.Points);

            var myChart = new dimple.chart(svg, data);

            myChart.defaultColors = [
                new dimple.color("#2ecc71", "#27ae60", 1), // green
                new dimple.color("#3498db", "#2980b9", 1), // blue
                new dimple.color("#e74c3c", "#c0392b", 1), // red
                new dimple.color("#9b59b6", "#8e44ad", 1), // purple
                new dimple.color("#e67e22", "#d35400", 1), // orange
                new dimple.color("#f1c40f", "#f39c12", 1), // yellow
                new dimple.color("#1abc9c", "#16a085", 1), // turquoise
                new dimple.color("#95a5a6", "#7f8c8d", 1) // gray
            ];

            var x = myChart.addCategoryAxis("x", "Module Name")

            x.addOrderRule((a, b) => {
                return a.ModulePosition[0] - b.ModulePosition[0]
            });

            var y = myChart.addCategoryAxis("y", "Position");
            y.hidden = true;
            var z = myChart.addMeasureAxis("z", "Points");
            z.overrideMax = max * 1.25;
            z.overrideMin = -5;

            // var f = myChart.addCategoryAxis("f", "Name");

            var series = myChart.addSeries(["Name", "Type"], dimple.plot.bubble);
            var OurGetTooltipText = series.getTooltipText;

            series.getTooltipText = e => {
                var theText = OurGetTooltipText.call(series, e).filter(text => !text.includes("Position"));

                return theText;
            }

            myChart.addLegend(240, 10, 330, 20, "right");
            myChart.draw();
        </script>`;

}

(async () => {
    let name = 'CS 124';
    createHtml(name);
})();
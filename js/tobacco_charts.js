
document.addEventListener('DOMContentLoaded', function () {

    let seriesData_ = [], parishes_ = [],
        data2020object_ = {"name": 2020, "data": []},
        data2019object_ = {"name": 2019, "data": []},
        data2018object_ = {"name": 2018, "data": []}
    parish_data_2020_2019.features.forEach(feature => {
        parishes_.push(feature.properties.Name)
        data2020object_["data"].push(feature.properties.Tobacco)
    })
    parish_data_2019_2018.features.forEach(feature => {
        data2019object_["data"].push(feature.properties.Tobacco)

    })
    parish_data_2018_2017.features.forEach(feature => {
        data2018object_["data"].push(feature.properties.Tobacco)
    })

    Highcharts.chart('chart_id', {
        chart: {
            type: 'bar'
        },
        title: {
            text: "Chart Of Tobacco Growing Areas Per Parish",
            style: {
                "color": "#333333", "fontSize": "1.5rem",
                "fontFamily": '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",\
                Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol",\
                "Noto Color Emoji";',
                "fontWeight": "bold"
            }
        },
        xAxis: {
            categories: parishes_,
            title: {
                text: null
            }
        },
        yAxis: {
            title: {
                text: "Tobacco grown(square meters)",
                align: "high"
            }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
          shadow: true
        },
        series: [data2020object_, data2019object_, data2018object_],
    });
});

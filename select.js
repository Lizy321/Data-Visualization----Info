function showSelectValue() {
    var obj = document.getElementById('year_set');
    var objProduct = document.getElementById('product_set');
    d3.selectAll("g")
        .remove();
    //console.log(objProduct.value);
    d3.json("world-countries.json", function (data) {
        /* Antarctica will not shown on the map */
        // var features = _.filter(data.features, function(value, key) {
        //     return value;
        // });
        var group = svg.selectAll("g")
            .data(data.features)
            .enter()
            .append("g")

        var projection = d3.geo.mercator();
        var oldScala = projection.scale();
        var oldTranslate = projection.translate();
        xy = projection.scale(oldScala * (width / oldTranslate[0] / 2) * 2.0)
            .translate([width / 2 - 500, height / 2 + 300]); //CENTER
        path = d3.geo.path().projection(xy);
        svg.attr('width', width).attr('height', height);
        //定义最小值和最大值对应的颜色
        var a = d3.rgb(255, 255, 255);  //浅蓝
        //var a = d3.rgb(0,255,255);
        var b = d3.rgb(255, 0, 0);    //
        //颜色插值函数
        var computeColor = d3.interpolate(a, b);
        //直接读入js文件
        // var ex_data = exportData.export;
        // console.log(ex_data);
        //从csv文件中读取数据！！！
        //var textobj=document.getElementsByName('text');
        //var selectvalue = obj.value;
        //console.log(selectvalue);
        d3.csv( "all_country_export/"+objProduct.value+"_" +obj.value+ ".csv", function (data) {
            var ex = data;
            //console.log(ex);
            var tooltip = d3.select("body").append("div")
                .attr("class","tooltip") //用于css设置类样式
                .attr("opacity",0.0);

            var values = [];
            var valueArray = [];
            var norms =[];
            var normArray = [];
            for (var i = 0; i < ex.length; i++) {
                if(ex[i].country !== "WLD") {
                    var country = ex[i].country;
                    var value = ex[i].value;
                    values[country] = value;
                    valueArray.push(value * 1000 / 1000);
                }
            }
            //console.log(valueArray);
            var maxvalue = d3.max(valueArray);
            var minvalue = d3.min(valueArray);
            //ex_data, function(d){ return d.value; });
            //console.log(obj.value);
            //console.log(objProduct.value);
            console.log(maxvalue);
            console.log(minvalue);
            //定义一个线性比例尺，将最小值和最大值之间的值映射到[0, 1]
            for(var j=0;j<ex.length;j++){
                if(ex[j].country!=="WLD") {
                    var ncountry = ex[j].country;
                    var nvalue = ex[j].value;
                    norms[ncountry] = (nvalue * 1000 - minvalue * 1000) / (maxvalue * 1000);
                    normArray.push((nvalue * 1000 - minvalue * 1000) / (maxvalue * 1000));
                }
            }
            //console.log(norms);
            console.log(normArray);
            var min = d3.min(normArray);
            var max = d3.max(normArray);
            var linear = d3.scale.linear()
                .domain([min, max])
                .range([0, 1]);

            //console.log(exportData.length);
            var areas = group.append("path")
                .attr("d", path)
                .attr("class", "area")
                .attr("fill", function (d) {
                    var t = linear(norms[d.id]);
                    var color = computeColor(t);
                    //console.log(color);
                    if (color == "#NaNNaNNaN") {
                        return "#efefef";
                    }
                    return color.toString();
                })//function(d){return color( )})
                .on('mouseout', function (datda) {
                    d3.select(this).attr('fill', function (d){
                        tooltip.style("opacity",0.0);
                        var t = linear(norms[d.id]);
                        var color = computeColor(t);
                        //console.log(color);
                        if (color == "#NaNNaNNaN") {
                            return "#efefef";
                        }
                        return color.toString();
                    });
                })
                .on('mouseover', function (data) {
                    //设置tooltip文字
                    tooltip.html(data.id+":"+values[data.id])
                    //设置tooltip的位置(left,top 相对于页面的距离)
                        .style("left",(d3.event.pageX)+"px")
                        .style("top",(d3.event.pageY+20)+"px")
                        .style("opacity",1.0);
                    d3.select(this).attr('fill', 'rgba(2,2,139,0.61)');
                })
                //点击事件：
                .on('mousedown',function(data){
                    //得到年份
                    var year = document.getElementById('year_set');
                    console.log(year.value);
                    d3.csv( "all_product_export/"+data.id+"_all_product_ex.csv", function (productdata) {
                        for (var i = 0; i < ex.length; i++) {
                            if(year.value==productdata[i].year){
                                var showdata=[];
                                showdata.push(productdata[i]['01-05_Animal']);
                                showdata.push(productdata[i]['06-15_Vegetable']);
                                showdata.push(productdata[i]['16-24_FoodProd']);
                                showdata.push(productdata[i]['25-26_Minerals']);
                                showdata.push(productdata[i]['27-27_Fuels']);
                                showdata.push(productdata[i]['28-38_Chemicals']);
                                showdata.push(productdata[i]['39-40_PlastiRub']);
                                showdata.push(productdata[i]['41-43_HidesSkin']);
                                showdata.push(productdata[i]['44-49_Wood']);
                                showdata.push(productdata[i]['50-63_TextCloth']);
                                var showdataname=['Animal','Vegetable','FoodProd','Minerals','Fuels','Chemicals','PlastiRub','HidesSkin','Wood','TextCloth'];
                                break;
                            }
                        }

                        //堆叠面积图的大小

                        var marginTop = 10;
                        var marginBottom = 20;
                        var marginRight = 15;
                        var marginLeft = 130;
                        var height_stream = 280 - marginTop - marginBottom;
                        var width_stream = 580 - marginLeft - marginRight;
                        console.log(height_stream,width_stream);

                        var svgSelection = d3.select('#chart1')
                            .append("svg")
                            .attr("width", width_stream + marginLeft + marginRight)
                            .attr("height", height_stream + marginTop + marginBottom)
                            .style('position', 'absolute')
                            .style('top', 0)
                            .style('left', 550);
                        console.log(width_stream + marginLeft + marginRight,height_stream + marginTop + marginBottom);

                        var baseGroup = svgSelection
                            .append("g")
                            .attr("transform", "translate("+marginLeft+","+marginTop+")");


                        var min = d3.min(normArray);
                        var max = d3.max(normArray);
                        var linear = d3.scale.linear()
                            .domain([min, max])
                            .range([0, 1]);

                        var yScale = d3.scale.linear()
                            .range([height_stream,0])
                            .domain([0,100]);

                        var xScale = d3.time.scale()
                            .range([0, width_stream]);

                        var colorScale = d3.scale.ordinal()
                            .range(["#F37B6D", "#FFD900"]);//"#F37B6D", "#6CC071",

                        var hoverLabel = d3.scale.ordinal()
                            .range(["01-05_Animal","06-15_Vegetable","16-24_FoodProd","25-26_Minerals","27-27_Fuels","28-38_Chemicals","39-40_PlastiRub","41-43_HidesSkin","44-49_Wood","50-63_TextCloth"]);


                        var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .tickSize(-width_stream, 0, 0)
                            .ticks(5)
                            .tickFormat(function(d){if(d==100){return d +"%";}else{return d}})
                            .orient("left");

                        var xBar = d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom");


                        var parseDate = d3.time.format("%Y").parse;
                        productdata.forEach(function(d) {
                            d.year = parseDate(d.year);
                        });

                        var newDataset = ["01-05_Animal","06-15_Vegetable","16-24_FoodProd","25-26_Minerals","27-27_Fuels","28-38_Chemicals","39-40_PlastiRub","41-43_HidesSkin","44-49_Wood","50-63_TextCloth"].map(function(n){
                            return productdata.map(function(d, i){
                                return { x: d.year, y: d[n], y0: 0 };
                            });
                        });

                        //console.log(newDataset);

                        d3.layout.stack()(newDataset);

                        xScale.domain(d3.extent(productdata, function(d) { return d.year }))

                        baseGroup.append("g")
                            .attr("class", "xaxis")
                            .attr("transform", "translate(0," + height_stream + ")")
                            .call(xBar);

                        baseGroup.append("g")
                            .attr("class", "yaxis")
                            .call(yAxis);


                        var area = d3.svg.area()
                            .x(function(d) { return xScale(d.x); })
                            .y0(function(d) { return yScale(d.y0); })
                            .y1(function(d) { return yScale(d.y + d.y0); });

                        var ageGroup = baseGroup.selectAll(".valgroup")
                            .data(newDataset)
                            .enter()
                            .append("g")
                            .attr("class", "valgroup")
                            .style("fill", function(d, i) { return colorScale(i); })
                            .attr("class", function(d, i) { return hoverLabel(i); });

                        ageGroup.append("path")
                            .attr("d", function(d) { return area(d); });


                        var svg2 = d3.select('#container').append('svg');
                        var width2 = 500;
                        var height2 = 500;
                        svg2.attr("width", width2)
                            .attr("height", height2)
                            .style('position', 'absolute')
                            .style('top', '500')
                            .style('left', '800');
                        var pie=d3.layout.pie();
                        var piedata=pie(showdata);
                        piedata[0].data="Animal";
                        piedata[1].data="Vegetable";
                        piedata[2].data="FoodProd";
                        piedata[3].data="Minerals";
                        piedata[4].data="Fuels"
                        piedata[5].data="Chemicals";
                        piedata[6].data="PlastiRub";
                        piedata[7].data="HidesSkin";
                        piedata[8].data="Wood";
                        piedata[9].data="TextCloth";

                        console.log(piedata);
                        var outerRadius = 200; //外半径
                        var innerRadius = 0; //内半径，为0则中间没有空白
                        var arc = d3.svg.arc()  //弧生成器
                            .innerRadius(innerRadius)   //设置内半径
                            .outerRadius(outerRadius);  //设置外半径
                        var color = d3.scale.category10();   //有十种颜色的颜色比例尺


                        var arcs = svg2.selectAll("g")
                            .data(piedata)
                            .enter()
                            .append("g")
                            .attr("transform","translate("+ (width2/2) +","+ (width2/2) +")");
                        //console.log("yes");

                        arcs.append("path")
                            .attr("fill",function(d,i){
                                //console.log("yes");
                                return color(i);
                            })
                            .attr("d",function(d){
                                return arc(d);   //调用弧生成器，得到路径值
                            });

                        //arcs.data(showdataname);

                        //arcs.append("text")
                        //.attr("transform",function(d){
                        //return "translate(" + arc.centroid(d) + ")";
                        //})
                        arcs.append("text")
                            .attr("transform",function(d){
                                return "translate(" + arc.centroid(d) + ")";
                            })
                            .attr("text-anchor","middle")
                            .style("font-size","12px")
                            .text(function(d){
                                //console.log(d);
                                return d.data;
                            });


                    })
                })
                .attr('stroke','#0A0A0A')
            //定义一个线性渐变
            var defs = svg.append("defs");
            var linearGradient = defs.append("linearGradient")
                .attr("id","linearColor")
                .attr("x1","0%")
                .attr("y1","0%")
                .attr("x2","100%")
                .attr("y2","0%");
            var stop1 = linearGradient.append("stop")
                .attr("offset","0%")
                .style("stop-color",a.toString());
            var stop2 = linearGradient.append("stop")
                .attr("offset","100%")
                .style("stop-color",b.toString());
            //添加一个矩形，并应用线性渐变
            var colorRect = svg.append("rect")
                .attr("x", 20)
                .attr("y", 150)
                .attr("width", 140)
                .attr("height", 20)
                .style("fill","url(#" + linearGradient.attr("id") + ")");
            //添加文字
            d3.selectAll("text")
                .remove();
            var minValueText = svg.append("text")
                .attr("class","valueText")
                .attr("x", 10)
                .attr("y", 190)
                .attr("dy", "-0.3em")
                .text(function(){
                    return minvalue;
                });
            var maxValueText = svg.append("text")
                .attr("class","valueText")
                .attr("x", 160)
                .attr("y", 190)
                .attr("dy", "-0.3em")
                .text(function(){
                    return maxvalue;
                });
            /*group.append("titile")
                .attr("x", function (d) {
                    return path.centroid(d)[0];
                })
                .attr("y", function (d) {
                    return path.centroid(d)[1];
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.id;
                })*/
        });
    });
    //alert(obj.value);
}
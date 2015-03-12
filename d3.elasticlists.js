/*global d3:false */

//EXTEND SO THAT DATA FIELDS can contain multiple values separated by comma as an option

var elasticLists = function(args){
	var defaults = {
		id: 'id',
		columns: [0],
		duration: 500,
		multiples: false,
		splitStr:","
	};

	var filters = [];
	var lists = [];
	var cwidth = 0;
	var rheight = 0;
	var y;
	var heights = [];
	var header_height = 40;

	var config = d3.tools.extend( defaults , args );

	for(var l = 0; l<config.columns.length; l++){
		filters[config.columns[l]] = [];
	}

	var mySelection;

	function my(selection){
		mySelection = selection;
		cwidth = (mySelection.node().getBoundingClientRect().width/config.columns.length);
		rheight = mySelection.node().getBoundingClientRect().height;

		var i = 0;
		for(var l in lists){
			var headSvg = mySelection.append("div")
				.attr("id", "head-"+config.columns[i])
				.attr("class", "el-head")
				.attr("style", "margin:0; padding:0; float:left; height:"+header_height+"px; width:"+(100/config.columns.length)+"%;")
				.append("svg")
					.attr("width", cwidth)
					.attr("height", header_height);

			headSvg.append("rect")
				.attr("height", header_height-5)
				.attr("width", cwidth-10)
				.attr("x", 0)
				.attr("y", 0);

			headSvg.append("text")
				.text(config.columns[i])
				.attr("x", 5)
				.attr("y", (header_height-5)/2+4);

			i++;
		}

		i = 0;
		for(var l in lists){
			var listDiv = mySelection.append("div")
				.attr("id", "list-"+config.columns[i])
				.attr("data-column", config.columns[i])
				.attr("class", "el-col")
				.attr("style", "margin:0; padding:0; float:left; height:"+(rheight-header_height)+"px; width:"+(100/config.columns.length)+"%;");

			var listSvg = listDiv.append("svg")
				.attr("data-column", config.columns[i])
				.attr("id", "svg-"+config.columns[i])
				.attr("height", heights[i]);

			listSvg.selectAll("rect.el-row")
				.data(lists[l])
				.enter().append("rect")
					.attr("class", function(d){ return "el-row el-count-"+d.count; })
					.attr("x", 0)
					.attr("width", cwidth-10);

			listSvg.selectAll("text.el-text-left")
				.data(lists[l])
				.enter().append("text")
					.attr("class", function(d){ return "el-text el-text-left el-count-"+d.count; })
					.attr("x", 5);

			listSvg.selectAll("text.el-text-right")
				.data(lists[l])
				.enter().append("text")
					.attr("class", function(d){ return "el-text el-text-right el-count-"+d.count; })
					.attr("text-anchor", "end")
					.attr("x", cwidth-15);

			listSvg.selectAll("rect.el-click")
				.data(lists[l])
				.enter().append("rect")
					.attr("class", "el-click")
					.attr("x", 0)
					.attr("width", cwidth-10)
					.on("click", function(d){
						my.changeFilter(d3.select(this.parentNode).attr("data-column"), d.name);
						my.update();
					});

			i++;
		}

		my.update();
	}

	function isSelected(object, column){
		var r = false;

		for(var f in filters[column]){
			if(object.name === filters[column][f]){
				r = true;
			}
		}

		return r;
	}

	my.update = function(){
		var i = 0;
		for(var l in lists){
			d3.select("#svg-"+config.columns[i])
				.transition()
				.duration(config.duration)
					.attr("height", heights[i]);

			d3.selectAll("#svg-"+config.columns[i]+" rect.el-row")
				.data(lists[l])
					.attr("class", function(d){
						var cl = "";
						if(isSelected(d, d3.select(this.parentNode).attr("data-column"))){
							cl = "el-selected ";
						}
						return cl+"el-row el-count-"+d.count;
					})
					.transition()
					.duration(config.duration)
						.attr("y", function(d){ return d.y; })
						.attr("height", function(d){ return y(d.count); });

			d3.selectAll("#svg-"+config.columns[i]+" text.el-text-left")
				.data(lists[l])
					.attr("class", function(d){ return "el-text el-text-left el-count-"+d.count; })
					.text(function(d){ return d.name; })
					.transition()
					.duration(config.duration)
						.attr("y", function(d){ return d.y+(y(d.count)/2)+4; });
						

			d3.selectAll("#svg-"+config.columns[i]+" text.el-text-right")
				.data(lists[l])
					.attr("class", function(d){ return "el-text el-text-right el-count-"+d.count; })
					.text(function(d){ return d.count+"/"+d.ocount; })
					.transition()
					.duration(config.duration)
						.attr("y", function(d,i){ return d.y+(y(d.count)/2)+4; });

			d3.selectAll("#svg-"+config.columns[i]+" rect.el-click")
				.data(lists[l])
					.transition()
					.duration(config.duration)
						.attr("y", function(d){ return d.y; })
						.attr("height", function(d){ return y(d.count); });

			i++;
		}
	};

	function checkFilters(object){
		var r = true;

		for(var f in filters){
			if(filters[f].length >= 1){
				var tr = false;
				for(var i in filters[f]){
					if(config.multiples){
						var object_split = object[f].split(config.splitStr);
						for(var o in object_split){
							if(object_split[o] === filters[f][i]){
								tr = true;
							}
						}
					}else{
						if(object[f] === filters[f][i]){
							tr = true;
						}
					}
				}
				if(!tr){
					r = false;
				}
			}
		}

		return r;
	}

	
	my.updateData = function(){

		for(var l = 0; l<config.columns.length; l++){

			var list = [];
			
			for(var d = 0; d<config.data.length; d++){
				
				//multiples split by "," and then loop
				//if(config.multiples){}

				//Check if filter is active and if current elements are to be added
				//Then split up and add


				var value = config.data[d][config.columns[l]];
				var exists = false;
				for(var c in list){
					if(list[c].name === value){
						exists = true;
						if(checkFilters(config.data[d])){
							list[c].count++;
						}
						list[c].ocount++;
					}
				}
				if(!exists){
					var item = {'name':value, 'count':0, 'ocount':0, 'y':0};
					if(checkFilters(config.data[d])){
						item.count = 1;
					}
					item.ocount = 1;
					list.push(item);
				}
			}

			lists[config.columns[l]] = list;

		}

		for(var l in lists){
			lists[l].sort(function(a,b){
				if((typeof a.name === "number")&&(typeof b.name === "number")){
					return a.name - b.name;
				}else{
					return a.name > b.name;
				}
				
			});
		}

		var values = [];
		for(var l in lists){
			for(var ll in lists[l]){
				values.push(lists[l][ll].ocount);
			}
		}

		y = d3.scale.linear()
			.domain(d3.extent(values))
			.range([20, 60]);

		heights = [];
		for(var l in lists){
			var h = 0;
			for(var ll in lists[l]){
				lists[l][ll].y = h;
				//+2 for border
				h+=y(lists[l][ll].count)+2;
			}

			heights.push(h);
		}

		for(var d = 0; d<config.data.length; d++){
			if(checkFilters(config.data[d])){
				config.data[d].el_selected = true;
			}else{
				config.data[d].el_selected = false;
			}
		}

		dispatch.update(config.data);
	};

	my.changeFilter = function(name, value){
		var exists = true;
		var tempArray = [];

		for(var f in filters[name]){
			if(filters[name][f] === value){
				exists = false;
			}else{
				tempArray.push(filters[name][f]);
			}
		}

		if(exists){
			tempArray.push(value);
		}

		filters[name] = tempArray;

		my.updateData();

		return exists;
	};

	var dispatch = d3.dispatch('update');
		d3.rebind(my, dispatch, "on");

	return my;
};
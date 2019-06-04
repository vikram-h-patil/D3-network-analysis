window.onload = function(){
    //1- declaring the main svg variable
    var svgCanvas = d3.select("svg")
        .attr("width", 1000)
        .attr("height", 600)
        .attr("class", "svgCanvas");

    //2- reading the json data
    d3.json("data.json", function(d){
        var nodes =d.nodes
        var links= d.links

    //3- adding the tool tip
        var tooltip  = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);

//------------------------------------------------------------------------------
     //4- Creating the line
        var link = svgCanvas.selectAll("line")
            .data(links).enter()
            .append("line")
            .attr("x1", function(d){
                                    for(var i=0; i<nodes.length;i++)
                                        {
                                          if(d.node01 == nodes[i].id)
                                           return nodes[i].x;
                                        }
                                  })

            .attr("y1", function(d){
                                    for(var i=0; i<nodes.length;i++)
                                        {
                                          if(d.node01 == nodes[i].id)
                                           return nodes[i].y;
                                        }
                                  })
            .attr("x2", function(d){
                                    for(var i=0; i<nodes.length;i++)
                                        {
                                          if(d.node02 == nodes[i].id)
                                           return nodes[i].x;
                                        }
                                  })
            .attr("y2", function(d){
                                    for(var i=0; i<nodes.length;i++)
                                        {
                                          if(d.node02 == nodes[i].id)
                                           return nodes[i].y;
                                        }
                                  })
            .attr("stroke", "black")
            .attr("stroke-width",function(d){return cal_width(d)});

           //calculating the width of the line based on summation of amount from each nodes
            function cal_width(d){
                amount=0
                for (variable of nodes) {
                  if(variable.id ==d.node01 || variable.id == d.node02){
                    amount = d.amount + amount
                  }
                }
                return amount/150
            }
// end of links
//------------------------------------------------------------------------------



//5 - circle
        //5-1: creating circle
        var node = svgCanvas.selectAll("circle")
            .data(nodes)
            .enter() // create place hodlers if the data are new
            .append("circle") // create one circle for each
            .attr("cx", function(thisElement, index){

              // calculate the centres of circles
                      return thisElement["x"];
            })

            .attr("cy", function(thisElement, index){
              // calculate the centres of circles
                      return thisElement["y"];
            })
            .attr("r",function(d){return cal_radius(d)})
            .on("mouseover", function(d) {
                      svgCanvas.selectAll("circle")
                          .attr("opacity", 0.5); // grey out all circles

                      // hightlight the on hovering on
                      d3.select(this).attr("opacity", 1).style("fill", "red");

                      //change font color
                      link.attr("stroke", function(o){
                                          return o.node01 == d.id || o.node02 == d.id ? "red" : "#777";
                                      });

                      //to make non-connected links transparent
                      link.transition(500).style("opacity", function(o) {
                                                return o.node01 == d.id || o.node02 == d.id ? 1.0 : 0.1;
                                              });
                      //show tooltip
                      showTip(d);
                   }) //end of mouseover

           .on("mouseout", function(d) {
                       // restore all circles to normal mode
                       svgCanvas.selectAll("circle")
                              .attr("opacity", 1);
                       tooltip.style("opacity", 0);
                       d3.select(this) // hightlight the on hovering on
                           .attr("opacity", 1).style("fill", "black");
                       link.attr("stroke", "#777");
                       link.transition(500).style("opacity", 1);
                     }); //end of mouseout

     //----------------------------------------//
          //5-2: to show tip
           function showTip(d){
             tooltip.html(d.id+"<br/>"+"Total trading amount : " +  Math.round(cal_radius(d)*50)+"<br/>"+
            "No. of connected locations : " + cal_locn(d))
                 .style("background-color", "tan")
                 .style("border", "1px solid black")
                 .style("padding", "2px")
                 .style("top", d3.event.pageY + 10 + "px")
                 .style("left", d3.event.pageX + 10 + "px")
                 .style("opacity", 0.9);
               }

    //----------------------------------------//
          //5-3: calculation of radius
          function cal_radius(d){
              amount=0
              for (variable of links) {
                if(d.id ==variable.node01 || d.id == variable.node02){
                  amount = variable.amount + amount
                }
              }
              return amount/50
          }

    //----------------------------------------//
          //5-4: aalculation of locations
          function cal_locn(d){
              locn=0
              for (variable of links) {
                if(d.id ==variable.node01 || d.id == variable.node02){
                  locn = locn+1
                }
              }
              return locn
          }


// end of circle
//------------------------------------------------------------------------------

// 6 - creating text
        svgCanvas.selectAll("text")
                .data(nodes).enter()
                .append("text")
                .attr("x", function(thisElement, index){
                    return thisElement["x"]+50;
                })
                .attr("y", function(thisElement, index){
                    return thisElement["y"];
                })
                .attr("text-anchor", "right")
                .text(function(thisElement, index){
                    return thisElement["id"];
                });
// end of text
//------------------------------------------------------------------------------
    }); //end of read json
}


// reference - https://medium.com/@kj_schmidt/show-data-on-mouse-over-with-d3-js-3bf598ff8fc2

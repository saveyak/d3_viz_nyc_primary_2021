//Bar chart created by Sharon Lurye
//Thank you to Gurman Bhatia, Jonathan Soma, and Suhail Bhat-ta for their help
//Based on block by Joel Zief: https://bl.ocks.org/jrzief/70f1f8a5d066a286da3a1e699823470f
//Which in turn is probably based on this code by Mike Bostock: https://observablehq.com/@d3/bar-chart-race 

// Other tweaks I'd like to make in future edits:    
    // -- Add button for replay, pause, or select round
    // -- Figure out a way to create a rank automatically using D3 (rather than manually in Excel)
    // -- Make the outerLabel/innerLabel code less complicated 
    // -- Replace scaleLinear with scaleBand


//Start by defining variables
//Tick duration = amount of time before it transitions to next round
//Animation duration = amount of time the animation takes
//Since animation duration is less than tick duration, there is a pause between rounds    

var tickDuration = 2000;
var animationDuration = 500 
var top_n = 15;
var height = 600;
var width = 960;

//Create SVG

var svg = d3.select("body").append("svg")
      .attr("width", width) 
      .attr("height", height);
  
    
    const margin = {
      top: 80,
      right: 100, //Added right margin so that top candidate's name does not get cut off
      bottom: 5,
      left: 0
    };
  
    let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);
      
    let title = svg.append('text')
     .attr('class', 'title')
     .attr('y', 24)
     .html('New York City 2021 Ranked Choice Mayoral Primary Results');
  
    let subTitle = svg.append("text")
     .attr("class", "subTitle")
     .attr("y", 55)
     .html("Unofficial vote count for the Democratic primary as of July 6, 2021");
   
     let round = 1;
  
//To run in a local server, type into terminal: python -m http.server 1111 (or any four numbers)
//Then visit http://localhost:1111/

const link = "./boe_primary_results.csv"

  d3.csv(link).then(function(data) {
    //if (error) throw error;
      
    console.log(data);
      
      
       data.forEach(d => {
        d.value = isNaN(d.value) ? 0 : +d.value, //If it is null, value is 0
        d.round = +d.round,
        d.colour = "cornflowerblue"        
//        d.colour = d3.hsl(Math.random()*360,0.75,0.75) // Make it random colors
      });

     console.log(data);
    
     //filter for current round
     let roundSlice = data.filter(d => d.round == round && !isNaN(d.value))
      .sort((a,b) => b.value - a.value) // biggest value on top 
      .slice(0, top_n);
   
      roundSlice.forEach((d,i) => d.rank = i);
    
     console.log('roundSlice: ', roundSlice)
  
     //make x scale
     //this probably should have been scaleBand
     let x = d3.scaleLinear()
        .domain([0, d3.max(roundSlice, d => d.value)]) 
        //If we wanted the axis fixed: 
        //.domain([0, 450000])
        .range([margin.left, width-margin.right-65]);
  
     let y = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height-margin.bottom, margin.top]);
  
     let xAxis = d3.axisTop()
        .scale(x)
        .ticks(width > 500 ? 5:2)
        .tickSize(-(height-margin.top-margin.bottom))
        .tickFormat(d => d3.format(',')(d));
  
     svg.append('g')
       .attr('class', 'axis xAxis')
       .attr('transform', `translate(0, ${margin.top})`)
       .call(xAxis)
       .selectAll('.tick line')
       .classed('origin', d => d == 0);
  
       svg.selectAll('rect.bar')
       .data(roundSlice, d => d.name)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('x', x(0)+1)
       .attr('width', d => x(d.value)-x(0)) //was originally x(d.value-x(0)-1) in Zief's code
       .attr('y', d => y(d.rank)+5)
       .attr('height', y(1)-y(0)-barPadding)
//       .style('fill', d => d.colour);
       .style('fill', function(d) { 
         if (d.name === "Inactive ballots") {
           return "gray"
          } else {
            return d.colour
          }})  


     svg.selectAll('text.innerLabel') //originally text.label
        .data(roundSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'innerLabel')
        .attr('x', d => x(d.value)-8)
        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1) 
        .style('text-anchor', 'end')
        // .html(d => d.name);
        // .html(d => (d.value<100000)?'':d.name);
        .html((d)=>{ // Should only see this if there are more than 100,000 votes
          if (d.value<100000){
            return ''
          } else {
            return d.name
          }
        })


    svg.selectAll('text.outerLabel') //originally text.valueLabel
      .data(roundSlice, d => d.name)
      .enter()
      .append('text')
      .attr('class', 'outerLabel')
      .attr('x', d => x(d.value)+5)
      .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
      .html((d) => {
        let string
        if (d.value<100000){
          string = '<tspan>'+d.name +'</tspan> (' +d3.format(',')(d.value)+' votes)'
        } else {
          string = '('+d3.format(',')(d.value)+' votes)'  
        }
        
        string = string.replace("Inactive ballots", "0 voters had all their choices eliminated")
        string = string.replace('(0 votes)','') // Won't say "0 votes" after Inactive Ballots
        return string
      })
      .style('font-style', function(d) { 
        if (d.name === "Inactive ballots") {
          return "italic"
         } else {
           return "normal"
         }})


    let roundText = svg.append('text')
      .attr('class', 'roundText')
      .attr('x', width) // previously width-margin.right
      .attr('y', height-40) // previously height-25
      .style('text-anchor', 'end')
      .html("Round " + ~~round) // Display "Round" plus the round number
     .call(halo, 10);

     let caption = svg.append('text')
     .attr('class', 'caption')
     .attr('x', width)
     .attr('y', height-5)
     .style('text-anchor', 'end')
     .html('Chart by Sharon Lurye. Source: NYC Board of Elections')
     .call(halo, 10) 



 
   let ticker = d3.interval(e => {

      roundSlice = data.filter(d => d.round == round && !isNaN(d.value))
        .sort((a,b) => b.value - a.value)
        .slice(0,top_n);

      roundSlice.forEach((d,i) => d.rank = i);
     
      console.log('Intervalround: ', round, roundSlice);

      x.domain([0, d3.max(roundSlice, d => d.value)]); 
     //If we wanted the axis fixed:
     // x.domain([0, 450000]); 
     
      svg.select('.xAxis')
        .transition()
        .duration(animationDuration)
        .ease(d3.easeLinear)
        .call(xAxis);
    
       let bars = svg.selectAll('.bar').data(roundSlice, d => d.name);

      //replace code is to create classes by replacing spaces with underscores. 
      //However, that still doesn't work as some names have periods.
      //The Slugify code might help: https://gist.github.com/codeguy/6684588  
    
       bars
        .enter()
        .append('rect')
      //  .attr('class', d => `bar ${d.name.replace(/\s/g,'_')}`)
        .attr('x', x(0)+1)
      //  .attr( 'width', d => x(d.value)-x(0)-1) // (d)=>{console.log(x(d.value)-x(0))}
        .attr('y', d => y(top_n+1)+5)
        .attr('height', y(1)-y(0)-barPadding)
        .style('fill', d => d.colour)
        .transition()
          .duration(animationDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank)+5);
          
       bars
        .transition()
          .duration(animationDuration)
          .ease(d3.easeLinear)
          .attr('width', d => x(d.value)-x(0)) //Originally -x(0)-1
          .attr('y', d => y(d.rank)+5);
            
       bars
        .exit()
        .transition()
          .duration(animationDuration)
          .ease(d3.easeLinear)
          .attr('width', d => x(d.value)-x(0)-1)
          .attr('y', d => y(top_n+1)+5)
          .remove();

       let labels = svg.selectAll('.innerLabel')
          .data(roundSlice, d => d.name);

       labels
        .enter()
        .append('text')
        .attr('class', 'innerLabel')
        .attr('x', d => x(d.value)-8)
        .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
        .style('text-anchor', 'end')
        .html(d => { //If vote count is less than 100,000 then put the name outside 
          if (d.value<100000) {
            return ''
          } else {
            return d.name
          }
        })    
        .transition()
          .duration(animationDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
             
    
   	   labels
          .transition()
          .duration(animationDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
     
       labels
          .exit()
          .transition()
            .duration(animationDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(top_n+1)+5)
            .remove();
         

     
       let valueLabels = svg.selectAll('.outerLabel').data(roundSlice, d => d.name);
    
       valueLabels
          .enter()
          .append('text')
          .attr('class', 'outerLabel')
          .attr('x', d => x(d.value)+5)
          .attr('y', d => y(top_n+1)+5)
          .html((d) => {
            let string
            if (d.value<100000){
              string = '<tspan>'+d.name +'</tspan> (' +d3.format(',')(d.value)+' votes )'
            } else {
              string = '('+d3.format(',')(d.value)+' votes)'
            }
        
            return string
          })
          .transition()
            .duration(animationDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
            
       valueLabels
       .html((d) => {
        let string
        if (d.value<100000){
          string = '<tspan>'+d.name +'</tspan> (' +d3.format(',')(d.value)+' votes)'
        } else {
          string = '('+d3.format(',')(d.value)+' votes)'
        }
        if (d.name === 'Inactive ballots') {
          string= d3.format(',')(d.value)+' voters had all their choices eliminated' }
        else {
          string = string.replace('(0 votes)', '(eliminated)')    
//        string=string.replace('(0 votes)','(eliminated after round ' + d.eliminated_after_round + ')')
          }
        return string
      })       
          .transition()
            .duration(animationDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value)+5)
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
     
      valueLabels
        .exit()
        .transition()
          .duration(animationDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x(d.value)+5)
          .attr('y', d => y(top_n+1)+5)
          .remove();
    
      roundText.html("Round " + ~~round);
     
     if(round == 8) ticker.stop();
     round = round + 1; // originally round + 0.1 
   },tickDuration);

 });

    const halo = function(text, strokeWidth) {
      text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .style('fill', '#ffffff')
         .style( 'stroke','#ffffff')
         .style('stroke-width', strokeWidth)
         .style('stroke-linejoin', 'round')
         .style('opacity', 1);
       }   
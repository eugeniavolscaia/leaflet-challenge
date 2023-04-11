// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

  let features = data.features;
  console.log(features);
  
  // Create the map
  let myMap = L.map("map", {
    center: [40.76, -111.89],
    zoom: 5,
   });

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);  
    
   // Loop through the data.
   for (let i = 0; i < features.length; i++) {
  
     // Set the data location property to a variable.
     let location = features[i].geometry.coordinates;
     
      // Conditionals 
      let color = "";
      if (location[2] > 90) {
        color = "red";
      }
      else if (location[2] > 70) {
        color = "darkorange";
      }
      else if (location[2] > 50) {
        color = "orange";
      }
      else if (location[2] > 30) {
        color = "yellow";
      }
      else if (location[2] > 10) {
        color = "yellowgreen";
      }
      else {
        color = "lightgreen";
      }
    
     // Check for the location property and create markers
     if (location) {
      L.circle([location[1], location[0]],{
        fillOpacity: 0.9,
        color: "black",
        weight: 0.7,
        fillColor: color,
        radius: features[i].properties.mag * 10000   
      })
      .bindPopup(("<strong>"
       + "Location:<br /> lat " + location[1] 
       + "<br />long " + location[0] + "</strong><br /><br />Magnitude: " 
       + features[i].properties.mag + "<br />Depth: " 
       + location[2]))
      .addTo(myMap);
      }
   };

// Create legend
  let legend = L.control({position: 'bottomleft'});
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let labels = [];
    let categories = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    let colors = ['lightgreen', 'yellowgreen', 'yellow', 'orange', 'darkorange', 'red'];

  for (let i = 0; i < categories.length; i++) {
          div.innerHTML  
          labels.push(
              '<li style="background-color:' + colors[i] + '"</li> ' +
              (categories[i] ? categories[i] : '+'));
      }
      
      div.innerHTML += "<h1>Depth range<h1>" + labels.join('<br>');
      return div;
      };

 legend.addTo(myMap);

});
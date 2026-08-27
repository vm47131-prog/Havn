//no direct access of environment variables in js file
maptilersdk.config.apiKey = window.mapToken; //window.  makes it explicit that these values are global and available to map.js
const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates, //[longitude,Latitude]
  zoom: 9,
});
console.log(coordinates);
// const gc = new maptilerGeocoder.GeocodingControl();
// map.addControl(gc, "top-left");
// 1. Building the Custom "H" Element Marker
const el = document.createElement("div");
el.innerText = "H";

// Applying structural and visual styling properties to the node
el.style.width = "2rem";
el.style.height = "2rem";
el.style.backgroundColor =
  "#ff5a5f"; /* Airbnb signature coral background color */
el.style.color = "white";
el.style.borderRadius =
  "50%"; /* Rounds out bounds to construct a perfect circle */
el.style.display = "flex";
el.style.alignItems = "center"; /* Vertically centers the text "V" */
el.style.justifyContent = "center"; /* Horizontally centers the text "V" */
el.style.fontWeight = "bold";
el.style.fontSize = "16px";
el.style.boxShadow = "0px 2px 8px rgba(0, 0, 0, 0.3)";
el.style.border =
  ".5rem solid white"; /* Provides clean isolation contrast against the background circle layer */

const marker = new maptilersdk.Marker({
  element: el,
})
  .setLngLat(coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      "<p>Exact location will be provided after booking</p>",
    ),
  ) // Sirf popup create karein, map par add nahi
  .addTo(map); // Poore marker ko map par add karein

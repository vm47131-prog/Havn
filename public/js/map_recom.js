document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const geocoder = document.getElementById("locationGeocoder");
  const locationInput = document.getElementById("location");

  // USER SELECTS MAPTILER RECOMMENDATION

  geocoder.addEventListener("pick", (event) => {
    const feature = event.detail.feature;

    // Address selected from recommendation
    const address = feature.place_name;

    // Store it in actual form input
    locationInput.value = address;

    console.log("Selected location:", address);
  });

  // FORM SUBMIT

  form.addEventListener("submit", (event) => {
    // Recommendation select nahi ki
    if (locationInput.value.trim() === "") {
      event.preventDefault();

      alert("Please select a location from the recommendations.");

      return;
    }

    console.log("Submitting location:", locationInput.value);
  });
});

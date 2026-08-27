const taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") info.style.display = "inline";
    else info.style.display = "none";
  }
});

const filters = document.querySelectorAll(".filter");
for (let filter of filters) {
  filter.addEventListener("click", function () {
    const category = filter.dataset.category; //rule=> data-xxx -> dataset.xxx
    window.location.href = `/listings/search/${category}`; //`/listings/search${category}`
  });
}

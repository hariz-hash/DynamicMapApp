// Use DOMContentLoaded as our main entry point

window.addEventListener("DOMContentLoaded", async function () {
  // this function is to setup the application

  function init() {
    let map = initMap();

    // add a layer to store the search results
    let searchResultLayer = L.layerGroup();
    searchResultLayer.addTo(map);

    let markerClusterLayer = L.markerClusterGroup(); // <-- only available because we included the marker cluster JS file
    markerClusterLayer.addTo(map);
    // icon for ART_MUSEUM=====================================
    let artMuseumIcon = L.icon({
      iconUrl: "img/museumMarker.png",
      iconSize: [50, 55],
    });
    //// icon for ART_MUSEUM=====================================
    //---------------------------------------------------------------------//

    //// icon for HISTORY_MUSEUM=====================================
    let performingArtsVenue = L.icon({
      iconUrl: "img/performingVenueMarker.png",
      iconSize: [40, 55],
    });
    //// icon for HISTORY_MUSEUM=====================================
    //---------------------------------------------------------------------//

    //// icon for SCIENCE_MUSEUM=====================================
    let scienceMuseumIcon = L.icon({
      iconUrl: "img/scienceMuseum.png",
      iconSize: [35, 35],
    });
    //// icon for SCIENCE_MUSEUM=====================================
    //---------------------------------------------------------------------//
    //12=========================================================================================
    function displayIcon(icons) {
      const display = {
        10027: artMuseumIcon,
        10035: performingArtsVenue,
        // 10030: historyMuseumIcon,
        // 10031: scienceMuseumIcon,
      };
      return display[icons];
    }

    // document
    //   .querySelector("#btnToggleSearch")
    //   .addEventListener("click", function () {
    //     let searchContainerElement =
    //       document.querySelector("#search-container");
    //     let currentDisplay = searchContainerElement.style.display;
    //     if (!currentDisplay || currentDisplay == "none") {
    //       // if it is not visible
    //       searchContainerElement.style.display = "block";
    //     } else {
    //       searchContainerElement.style.display = "none";
    //     }
    //   });

    // document.querySelector("#RadioBtnShow").addEventListener("click", function () {
    //   let radioButtonElement = document.querySelector(".p-2");
    //   if (radioButtonElement.style.display == "none") {
    //     // if it is not visible
    //     radioButtonElement.style.display = "block";
    //   } else {
    //     radioButtonElement.style.display = "none";
    //   }
    // });
    // let currentWeather = sendGetRequest("1.3521","103.8198");

    document
      .querySelector("#btnSearch")
      .addEventListener("click", async function () {
        // remove all the existing markers first before adding the new ones
        markerClusterLayer.clearLayers();

        let searchTerms = document.querySelector("#searchTerm").value.trim();
        let boundaries = map.getBounds();
        let center = boundaries.getCenter(); // in lat lng
        let latLng = center.lat + "," + center.lng;
        let dropdownValue = "";
        dropdownValue = document.getElementById("select1").value;
        // document.getElementById("select1").addEventListener("change", function () {
        //     dropdownValue = this.value
        // });

        // console.log(dropdownValue);

        // SEARCH MUSEUM only
        // let museum = document.querySelectorAll(".museum");
        // let valueBtn = "";
        // for (let rb of museum) {
        //   if (rb.checked) {
        //     valueBtn = rb.value;
        //   }
        // }

        // console.log(`asd${searchTerms}asd`);
        let searchResults = await search(latLng, searchTerms, dropdownValue);
        let searchResultElement = document.querySelector("#results");
        searchResultElement.innerHTML = "";

        for (let r of searchResults.results) {
          console.log(searchResults.results);

          // Display the marker
          let lat = r.geocodes.main.latitude;
          let lng = r.geocodes.main.longitude;

          let marker = L.marker([lat, lng], {
            icon: displayIcon(dropdownValue),
          }).addTo(markerClusterLayer);
          let hideResult = document.querySelector("#results");

          hideResult.addEventListener("click", function () {
            let hidden = (hideResult.style.display = "none");

            //results
          });

          marker.bindPopup(function () {
            let el = document.createElement("div");
            // add the 'popup' class to the <div>

            // see style.css for its definition
            el.classList.add("popup");
            el.classList.add("img");
            el.classList.add("card");

            // document
            //   .querySelector("#btnToggleSearch")
            //   .addEventListener("click", function () {
            //     let searchContainerElement =
            //       document.querySelector("#search-container");
            //     let currentDisplay = searchContainerElement.style.display;
            //     if (!currentDisplay || currentDisplay == "none") {
            //       // if it is not visible
            //       searchContainerElement.style.display = "block";
            //     } else {
            //       searchContainerElement.style.display = "none";
            //     }
            //   });
            // el.innerHTML = `
            // <div class="card-body">
            //   <h5 class="card-title">${r.name}</h5>
            //   <h5 class="card-title">${r.location.formatted_address}</h5>
            //   <h5 class="card-title">${r.website}</h5>

            //   `;
            // console.log(data + "tftftfu");
            async function getPicture() {
              let photos = await getPhoto(r.fsq_id);
              el.innerHTML += `<div class="card ">`;
              if (photos.length) {
                let firstPhoto = photos[0];
                let url = firstPhoto.prefix + "original" + firstPhoto.suffix;

                el.innerHTML += `<img src="${url}" class="card-img-top" alt="...">`;
              } else {
                el.innerHTML += `<img src="/img/notavailable.png" class="card-img-top" alt="...">`;
              }

              // el.innerHTML += `<img src="${url}" class="card-img-top" alt="...">`;

              el.innerHTML += `
                  <div class="card-body m-0 p-0">
                    <h6 class="card-title">${r.name}</h6>
                    <p class="card-text">${r.location.address}</p>
                  </div>
              </div>
              `;
            }

            getPicture();

            // let resultt = sendGetRequest(lat, lng);
            // console.log(resultt);

            return el;
          });

          // add to the search results
          let resultElement = document.createElement("div");
          resultElement.innerText = r.name;
          resultElement.classList.add("search-result");

          // the second parameter is an anonymous function
          // inside its scope, we refer to `r` which is not is own local variable
          // and it is not a global variable (i.e it's the local variable of another scope)
          // therefore the created anoymous function will remember for itself what 'r'
          // stores when it is created. (Also known as a closure)
          resultElement.addEventListener("click", function () {
            map.flyTo(
              [r.geocodes.main.latitude, r.geocodes.main.longitude],
              16
            );
            markerClusterLayer.zoomToShowLayer(marker);

            marker.openPopup(); // show the bind popup for the marker
          });

          searchResultElement.appendChild(resultElement);
        }
      });
    let collapseElementList = [].slice.call(
      document.querySelectorAll(".collapse")
    );
    let collapseList = collapseElementList.map(function (collapseEl) {
      return new bootstrap.Collapse(collapseEl);
    });

    // WEATHER ============================================================================================

    async function sendGetRequest() {
      // https://api.openweathermap.org/data/2.5/weather?q=singapore&appid=a7d4412c5faff421f4d323e4648b95a0&units=metric
      const API_WEATHER_URL =
        "https://api.openweathermap.org/data/2.5/weather?q=singapore";
      const API_WEATHER_KEY = "a7d4412c5faff421f4d323e4648b95a0";
      const unit = "metric";

      let url = `${API_WEATHER_URL}&lat=1.3521&lon=103.8198&appid=${API_WEATHER_KEY}&units=${unit}`;

      const resp = await axios.get(url);

      const country = resp.data.name;
      const temp = resp.data.main.temp;
      const desc = resp.data.weather[0].description;

      const humidity = resp.data.main.humidity;
      const icon = resp.data.weather[0].icon;
      console.log(icon);

      document.querySelector(".country").innerText = country;
      document.querySelector(".temp").innerText = temp;
      document.querySelector(".description").innerText = desc;
      document.querySelector(".icon").src =
        "https://api.openweathermap.org/img/w/" + icon + ".png";

      document.querySelector(".humidity").innerText = humidity;

      // console.log(temp);
      // console.log(resp.data);
      // console.log(resp.data.weather[0].description);
      // console.log(resp.data.weather[0].main);
      // console.log(resp.data.weather[0].icon);

      // console.log("temp " + );
      // console.log("temp " + resp.data.main.temp);

      // console.log("temp_min " + resp.data.main.temp_min);
      // console.log("temp_max " + resp.data.main.temp_max);
      // console.log("humidity " + resp.data.main.humidity);
      // console.log("humidity " + resp.data.name);

      // document.querySelector(".displayWeather").innerText ;
    }

    sendGetRequest();

    // WEATHER ============================================================================================
  }

  init();
});

function initMap() {
  // create a map object
  let map = L.map("map", {
    maxZoom: 20,
    minZoom: 6,
    zoomControl: false,
  });
  L.control
    .zoom({
      position: "bottomleft",
    })
    .addTo(map);
  // set the center point and the zoom
  map.setView([1.29, 103.85], 13);

  // need set up the tile layer
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      // maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", //demo access token
    }
  ).addTo(map);

  return map; // return map as result of the function
}

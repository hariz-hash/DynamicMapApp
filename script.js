window.addEventListener("DOMContentLoaded", async function () {
  function init() {
    let map = initMap();

    let markerClusterLayer = L.markerClusterGroup();
    markerClusterLayer.addTo(map);

    let mrtlayer = L.markerClusterGroup();
    mrtlayer.addTo(map);

    let circleForTrain = L.layerGroup();
    circleForTrain.addTo(map);

    let foodCourtLayer = L.layerGroup();
    foodCourtLayer.addTo(map);

    // icon for ART_MUSEUM=====================================
    let artMuseumIcon = L.icon({
      iconUrl: "img/museumMarker.png",
      iconSize: [50, 55],
    });

    let performingArtsVenue = L.icon({
      iconUrl: "img/performingVenueMarker.png",
      iconSize: [40, 55],
    });
    let trainLogo = L.icon({
      iconUrl: "img/train_logo.png",
      iconSize: [30, 35],
    });

    let foodLogo = L.icon({
      iconUrl: "img/crownblack.png",
      iconSize: [30, 35],
    });

    function displayIcon(icons) {
      const display = {
        10027: artMuseumIcon,
        10035: performingArtsVenue,
        19047: trainLogo,
      };
      return display[icons];
    }
    //map boundries
    let boundaries = map.getBounds();
    let center = boundaries.getCenter(); // in lat lng
    let latLng = center.lat + "," + center.lng;
    //map boundries

    //marker latlong locations
    let latMarker = 0;
    let lngMarker = 0;
    let latLongMarker = "";

    document
      .querySelector("#btnSearch")
      .addEventListener("click", async function () {
        markerClusterLayer.clearLayers();
        let searchResultElement = document.querySelector("#results");
        if (searchResultElement.style.display == "none") {
          searchResultElement.style.display = "block";
        }

        let searchTerms = document.querySelector("#searchTerm").value.trim();

        let dropdownValue = "";
        dropdownValue = document.querySelector("#category").value;

        let searchResults = await search(latLng, searchTerms, dropdownValue);
        console.log("This is in search button" + latLng);

        searchResultElement.innerHTML = "";

        for (let r of searchResults.results) {
          // Display the marker
          latMarker = r.geocodes.main.latitude;
          lngMarker = r.geocodes.main.longitude;
          console.log(typeof latMarker);

          let marker = L.marker([latMarker, lngMarker], {
            icon: displayIcon(dropdownValue),
          }).addTo(markerClusterLayer);

          marker.bindPopup(function () {
            console.log(
              "This is in markerbindpopup in search button" +
                latMarker +
                " " +
                lngMarker
            );

            searchResultElement.style.display = "none";
            map.flyTo(
              [r.geocodes.main.latitude, r.geocodes.main.longitude],
              20
            );
            let el = document.createElement("div");
            el.classList.add("popup");
            el.classList.add("img");
            el.classList.add("card");

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

              el.innerHTML += `
                  <div class="card-body m-0 p-0">
                    <h6 class="card-title">${r.name}</h6>
                    <p class="card-text">${r.location.address}</p>
                  </div>
              </div>
              `;
            }

            getPicture();

            return el;
          });
          //add event listenr to close the result
          // add to the search results
          let resultElement = document.createElement("div");
          resultElement.innerText = r.name;
          resultElement.classList.add("search-result");

          resultElement.addEventListener("click", function () {
            latMarker = r.geocodes.main.latitude;
            lngMarker = r.geocodes.main.longitude;
            map.flyTo(
              [r.geocodes.main.latitude, r.geocodes.main.longitude],
              20
            );
            //set timeout by second
            markerClusterLayer.zoomToShowLayer(marker, function () {
              marker.openPopup();
            });
            // marker.openPopup(); // show the bind popup for the marker
            //function to after ----------------<> instantly close
            searchResultElement.style.display = "none";
          });

          searchResultElement.appendChild(resultElement);
        }
      });

    //CheckBox============================================================================

    document
      .querySelector("#mrtStations")
      .addEventListener("change", async function () {
        mrtlayer.clearLayers();
        circleForTrain.clearLayers();
        if (document.querySelector("#mrtStations").checked) {
          let mrtChecked = document.querySelector("#mrtStations").value;
          latLongMarker = latMarker + "," + lngMarker;
          let displayNearByMrt = await displayNearByMrtStations(latLongMarker);
          console.log(displayNearByMrt.results);
          console.log(mrtChecked);

          for (let r of displayNearByMrt.results) {
            console.log(r.geocodes.main.latitude, r.geocodes.main.longitude);
            let marker = L.marker(
              [r.geocodes.main.latitude, r.geocodes.main.longitude],
              {
                icon: displayIcon(mrtChecked),
              }
            ).addTo(mrtlayer);

            marker.bindPopup(function () {
              // console.log(
              //   "This is in markerbindpopup in search button" +
              //     latMarker +
              //     " " +
              //     lngMarker
              // );

              map.flyTo(
                [r.geocodes.main.latitude, r.geocodes.main.longitude],
                20
              );
              let el = document.createElement("div");
              el.classList.add("popup");
              el.classList.add("img");
              el.classList.add("card");

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

                el.innerHTML += `
                    <div class="card-body m-0 p-0">
                      <h6 class="card-title">${r.name}</h6>
                      <p class="card-text">${r.location.address}</p>
                    </div>
                </div>
                `;
              }

              getPicture();

              return el;
            });
            console.log(
              "This is in markerbindpopup in checked button" +
                latMarker +
                " " +
                lngMarker
            );
            let circle = L.circle(
              [r.geocodes.main.latitude, r.geocodes.main.longitude],
              {
                color: "yellow", // just the line color
                fillColor: "black", // background color,
                fillOpacity: 0.5,
                radius: 500, // in metres
              }
            );
            circle.addTo(circleForTrain);
          }

          if (displayNearByMrt.results.length) {
            map.flyTo(
              [
                displayNearByMrt.results[0].geocodes.main.latitude,
                displayNearByMrt.results[0].geocodes.main.longitude,
              ],
              15
            );
          }
        }
      });
    //CheckBox============================================================================

    // WEATHER ============================================================================================
    // show result list for mrts

    async function getWeather() {
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
    }

    getWeather();
    // WEATHER ============================================================================================

    document
      .querySelector(".menuBtn")
      .addEventListener("click", async function () {
        document.querySelector(".menu").style.width = "180px";
        let checkVisibleButton = document.querySelector(".menuBtn");
        if (checkVisibleButton.style.display == "none") {
          checkVisibleButton.style.display = "block";
        } else {
          checkVisibleButton.style.display = "none";
        }
      });

    document
      .querySelector(".menuBtnClose")
      .addEventListener("click", async function () {
        document.querySelector(".menu").style.width = "0";
        let checkVisibleButton = document.querySelector(".menuBtn");
        if (checkVisibleButton.style.display == "none") {
          checkVisibleButton.style.display = "block";
        } else {
          checkVisibleButton.style.display = "none";
        }
      });
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
      position: "bottomright",
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
      maxNativeZoom: 18,
      maxZoom: 100,
      accessToken:
        "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", //demo access token
    }
  ).addTo(map);

  return map; // return map as result of the function
}

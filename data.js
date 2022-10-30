// all things related to retriving data with axios
// goes here
const API_BASE_URL = "https://api.foursquare.com/v3/places/";
const API_KEY = "fsq3rT+BnzZfpnt9RT+lTVdV0GRtyUV5eohCbIrpLGZZ7kw=";

const headers = {
  // tells the FourSquare API server that the format of data we are sending is JSON
  Accept: "application/json",
  // API key to use; the API_KEY identifies which project it is
  Authorization: API_KEY,
};

// this is a global function
// therefore other JS files can  make use of it
async function search(ll, search, category) {
  let url = API_BASE_URL + "search";
  let response = await axios.get(url, {
    headers: headers,
    params: {
      ll: ll,
      query: search,
      radius: 15000,
      categories: category, // ok for category to be empty string
      limit: 50,
      // ne: "1.41,103.93",
      // sw: "1.30,103.62",
      v: "20210903", // (Unique FourSquare) YYMMDD format (its for version control). I want to use your version of API dated before this date
    },
  });

  return response.data; // return the search results from the function
}

async function getPhoto(fsq_id) {
  let response = await axios.get(API_BASE_URL + `${fsq_id}/photos`, {
    headers: headers,
  });
  return response.data;
}

async function getPlaceDetails(fsq_id) {
  let response = await axios.get(API_BASE_URL + `${fsq_id}/photos`, {
    headers: headers,
  });
  return response.data;
}

const API_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";
const API_WEATHER_KEY = "a7d4412c5faff421f4d323e4648b95a0";
const unit = "metric";
async function sendGetRequest() {
  let url = `${API_WEATHER_URL}lat=1.3521&lon=103.8198&appid=${API_WEATHER_KEY}&units=${unit}`;

  const resp = await axios.get(url);
  console.log(resp.data.main.temp);
}

sendGetRequest();

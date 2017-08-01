$(document).ready(function () {

    /*** #search-button - GET WEATHER DATA BY CITY NAME IN #search-input ***/

    $("#search-button").on("click vclick", function () {
        var city = $("#search-input").val();    // get user's input
        if (city === "") {
            popup();
        }
        else {
            // API call for current weather data using city name:
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=cf06e8902c9262fc044668302cbdc8b3", showCurrentData);
            // API call for 16-day daily forecast data using city name:
            $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&units=metric&APPID=cf06e8902c9262fc044668302cbdc8b3", showForecastData);
        }
    });

    // fire #search-button with Enter key
    $("#search-input").keyup(function (e) {
        if (e.keyCode === 13) {
            $("#search-button").click();
        }
    });

    /*** #access-button - GET WEATHER DATA BY USER'S LOCATION  ***/

    $("#access-button").on("click vclick", function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoordinates);
        }
        else {
            alert("Could not find your location. Please try again or type a location name.");
        }
    });

    function getCoordinates(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        // API call for current weather data using coordinates
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&APPID=cf06e8902c9262fc044668302cbdc8b3", showCurrentData);
        // API call for 16-day daily forecast data using city name:
        $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lon + "&units=metric&APPID=cf06e8902c9262fc044668302cbdc8b3", showForecastData);
    }

    /*** CALLBACK FUNCTIONS FOR API CALLS ***/

    function showCurrentData(data) {
        // turn to 'purple page':
        $("#red-content").hide();
        $("body").toggleClass("bg-red bg-purple");
        // append data to 'purple page' content:
        $("#location").html(data.name + ", " + data.sys.country);   // show location name & country
        var icon = getMeteocon(data.weather[0].icon);   // get appropriate Meteocon letter and store it to 'icon' variable
        $("#icon").attr("data-icon", icon);     // show Meteocon
        $("#max-temp").html(data.main.temp_max + " &#176;C");   // show max temperature
        $("#min-temp").html(data.main.temp_min + " &#176;C");   // show min temperature
        // show 'purple page' content:
        $("#favorites-button, #favorites-text, #purple-content").removeAttr("hidden");
    }

    function showForecastData(data) {
        // get daily data for next 5 days, starting from tomorrow:
        for (var i = 1; i <= 5; i++) {
            // get day from API's unix timestamp
            var unix = JSON.parse(data.list[i].dt);
            var day = unixToDay(unix);
            // append data to each day
            $("#day-" + i).html(day);
            var icon = getMeteocon(data.list[i].weather[0].icon);   // get appropriate Meteocon letter and store it to 'icon' variable
            $("#icon-" + i).attr("data-icon", icon);     // show Meteocon
            $("#max-temp-" + i).html(Math.round(data.list[i].temp.max) + " &#176;C"); // show max temperature
            $("#min-temp-" + i).html(Math.round(data.list[i].temp.min) + " &#176;C");   // show min temperature
        }
    }

    /*** OTHER FUNCTIONS ***/

    // get appropriate Meteocon letter according to API's icon code
    function getMeteocon(code) {
        switch (code) {
            case "01d":
                return "B";
            case "01n":
                return "C";
            case "02d":
                return "H";
            case "02n":
                return "I";
            case "03d":
            case "03n":
                return "N";
            case "04d":
            case "04n":
                return "Y";
            case "09d":
            case "09n":
            case "10d":
            case "10n":
                return "R";
            case "11d":
            case "11n":
                return "0";
            case "13d":
            case "13n":
                return "W";
            case "50d":
            case "50n":
                return "M";
        }   // end 'switch'
    }   // end 'getMeteocon()'

    // turn unix timestamp to day:
    function unixToDay(unix) {
        var ms = new Date(unix * 1000);       // turn unix timestamp to milliseconds
        var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        return days[ms.getDay()];       // use 'getDay()' result as index for 'days' array
    }

    // show popup message when location input is invalid:
    function popup() {
        $("#popup").removeAttr("hidden").show();
        $("#search-button, #access-button").prop("disabled", true);
        $("#menu-button").hide();
        $("#popup-button").click(function () {
            $("#popup").hide();
            $("#menu-button").show();
            $("#search-button, #access-button").prop("disabled", false);
        });
    }

});
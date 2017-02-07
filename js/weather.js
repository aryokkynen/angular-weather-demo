var apikey = "YOUR API KEY HERE";
angular.module('weather', [])
.factory('openweather', function($http) {
    var getWeather = function(town) {
        return $http({
            method: 'JSONP',
            url: 'http://api.openweathermap.org/data/2.5/weather?q='+ town +'&units=metric&callback=JSON_CALLBACK&APPID='+apikey
        });
    };

    var getForecast = function(town) {        
        return $http({
            method: 'JSONP',
            url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+ town + '&mode=json&units=metric&cnt=4&callback=JSON_CALLBACK&APPID='+ apikey
        });
    };

    return {
        event: function(town, call) {

            //Determine type of call, is call forecast or current weather
            var data;
            if (call == "forecast"){
                data = getForecast(town);
            } else {
                data = getWeather(town);
            }
            return data;
        }
    };
})
.controller('WeatherForecastCtrl', function($scope, $timeout, openweather){
    var timeout; 
    var call;

    $scope.$watch('town', function(newtown) {
        if(newtown) {
            if(timeout) $timeout.cancel(timeout);
            timeout = $timeout(function() {

                call = "weather"; // Get Current data
                openweather.event(newtown, call).success(function(data, status) {                
               //Determine Weather icon
                var icon = data.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

                //Real feel calculations
                var temp =  data.main.temp;
                var wind = data.wind.speed;
                var feels = 13.12 + 0.612 * temp - 11.37 * Math.pow(wind * 3.6, 0.16) + 0.3965 * temp * Math.pow(wind * 3.6, 0.16);

                //Scopes
                $scope.clouds = data.clouds.all;
                $scope.icon = iconUrl;
                $scope.weather = temp;
                $scope.feels = feels;
                $scope.weatherDescription = data.weather[0].description;
                $scope.humidity = data.main.humidity;
                $scope.windSpeed = wind;
                $scope.sunset = data.sys.sunset;
                $scope.sunrise = data.sys.sunrise;
                $scope.date = data.dt;
                $scope.city = data.name;
                $scope.country = data.sys.country;

                });

                call = "forecast"; // Get Forecast Data
                openweather.event(newtown, call).success(function(forecastdata, status){
                    $scope.forecast = forecastdata.list;
                });
            }, 1000);
        }
    });
});


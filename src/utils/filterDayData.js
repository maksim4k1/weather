function filterDayData(day, list, city, country){
  const dayData = {
    main: {
      city: city,
      country: country,
      minTemp: 0,
      maxTemp: 0,
      weather: "",
      date: day,
      pressure: 0,
      humidity: 0,
      windSpeed: 0,
    },
    list: []
  };
  let minTemp = 0;
  let maxTemp = 0;
  let weather = [];
  let pressure = 0;
  let humidity = 0;
  let windSpeed = 0;
  let dayDataCount = 0;

  for(let i = 0; i < list.length; i++){
    const value = list[i];
    let date = value.dt_txt.split(" ")[0].split("-")[2];

    if(date === day){
      dayData.list.push({
        temp: Math.floor(value.main.temp - 273.15),
        weather: value.weather[0].description,
        weatherIcon: value.weather[0].icon[0] + value.weather[0].icon[1] + "d",
        time: value.dt_txt.split(" ")[1].split(":")[0] + ":00",
      });
      if(minTemp === 0 || minTemp > (value.main.temp_min - 273.15)){
        minTemp = Math.floor(value.main.temp_min - 273.15);
      }
      if(maxTemp < (value.main.temp_max - 273.15)){
        maxTemp = Math.floor(value.main.temp_max - 273.15);
      }
      weather.push([value.weather[0].description, value.weather[0].icon[0] + value.weather[0].icon[1] + "d"]);
      pressure += value.main.pressure;
      humidity += value.main.humidity;
      windSpeed += value.wind.speed;
      dayDataCount++;
    }
  }

  weather.sort();
  let maxWeatherCount = 0
  let weatherCount = 0;
  let prevValue = "";
  let weatherValue = "";

  for(let i = 0; i < weather.length; i++){
    const value = weather[i];

    if(i === 0){
      weatherValue = value;
      prevValue = value;
    }
    if(value[0] === prevValue[0]) weatherCount++;
    else{
      if(weatherCount > maxWeatherCount){
        maxWeatherCount = weatherCount;
        weatherValue = prevValue;
      }
      weatherCount = 1;
      prevValue = value;
    }
    if(i === weather.length-1){
      if(weatherCount > maxWeatherCount){
        maxWeatherCount = weatherCount;
        weatherValue = prevValue;
      }
    }
  }

  dayData.main.minTemp = minTemp;
  dayData.main.maxTemp = maxTemp;
  dayData.main.weather = weatherValue[0];
  dayData.main.weatherIcon = weatherValue[1];
  dayData.main.pressure = Math.round(pressure / dayDataCount * 0.75);
  dayData.main.humidity = Math.round(humidity / dayDataCount);
  dayData.main.windSpeed = Math.round(windSpeed * 100 / dayDataCount) / 100;

  return dayData;
}

export default filterDayData;
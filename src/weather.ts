interface DayReport {
  datetime: string;
  temp: number;
  conditions: string;
  humidity: number;
  wind: number;
  icon: string;
}

class WeatherReport {
  private days: DayReport[];
  private location: string;
  constructor(report: any) {
    if (!report.days || !report.resolvedAddress) {
      throw new Error("Incorrect shape of data");
    }
    this.days = [];
    for (const item of report.days) {
      if (
        !item.datetime ||
        !item.temp ||
        !item.conditions ||
        !item.humidity ||
        !item.windspeed ||
        !item.icon
      ) {
        throw new Error("Incorrect shape of data");
      }
      const newDay: DayReport = {
        datetime: item.datetime,
        temp: item.temp,
        conditions: item.conditions,
        humidity: item.humidity,
        wind: item.windspeed,
        icon: item.icon,
      };
      this.days.push(newDay);
    }

    this.location = report.resolvedAddress;
  }

  public getDays(): DayReport[] {
    return this.days;
  }

  public getLocation(): string {
    return this.location;
  }
}

function makeWeatherReportUI(app: HTMLDivElement, data: WeatherReport): void {
  const days = data.getDays();
  const location = data.getLocation();
  app.innerHTML = "";
  for (const day of days) {
    app.appendChild(makeDayCard(day, location));
  }
}

function makeDayCard(day: DayReport, location: string): HTMLDivElement {
  const card: HTMLDivElement = document.createElement("div");
  card.innerHTML = `
  <div class="weather-card">
    <h2 class="location">${location}</h2>
    <h3 class="date">${day.datetime}</h3>
    
    <div class="main-info">
      <span class="temperature" id="temp-value">${day.temp}°C</span>
      <img class="condition-icon" id="weather-icon" src="./${day.icon}.svg" alt="${day.icon}">
    </div>
    
    <p class="condition-text" id="condition-text">${day.conditions}</p>
    
    <div class="details">
      <div class="detail-item">
        <span>💧 Humidity</span>
        <span id="humidity-value">${day.humidity}%</span>
      </div>
      <div class="detail-item">
        <span>💨 Wind</span>
        <span id="wind-value">${day.wind}km/h</span>
      </div>
    </div>
  </div>
`;

  return card;
}

async function getWeatherData(
  spinner: HTMLDivElement,
  location: string,
): Promise<WeatherReport | null> {
  try {
    if (!location || location == "") {
      throw new Error("Empty location");
    }
    spinner.style.display = "block";
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=current&key=T8VKKLXXD8JSQY7BZMWL8TQW9&contentType=json`,
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const report = await response.json();
    const weatherReport = new WeatherReport(report);
    return weatherReport;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    spinner.style.display = "none";
  }
}

export { makeWeatherReportUI, getWeatherData };

import "normalize.css/normalize.css"
import "./style.css"

import { makeWeatherReportUI, getWeatherData } from "./weather"

const app = document.getElementById("app") as HTMLDivElement
const input = document.getElementById("location") as HTMLInputElement
const button = document.querySelector("button") as HTMLButtonElement
const spinner = document.querySelector(".spin") as HTMLDivElement

button.addEventListener("click", async (): Promise<void> => {
  const value = input.value
  input.value = ""

  const weather = await getWeatherData(spinner, value)
  if (!weather) {
    alert("Fetch request failed")
    return
  }

  makeWeatherReportUI(app, weather)
})

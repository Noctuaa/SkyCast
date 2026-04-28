import { atom } from "nanostores";
import type { ForecastResponse } from "../types/weather";

export const $forecast = atom<ForecastResponse | null>(null);
export const $forecastLoading = atom<boolean>(false);
export const $forecastError = atom<string | null>(null);
export const $searchOpen = atom<boolean>(true);
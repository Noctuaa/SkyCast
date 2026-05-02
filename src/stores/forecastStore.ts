import { atom } from "nanostores";
import type { ForecastResponse, ForecastDays } from "../types/weather";

export const $forecast = atom<ForecastResponse | null>(null);
export const $forecastLoading = atom<boolean>(false);
export const $forecastError = atom<string | null>(null);
export const $searchOpen = atom<boolean>(false);
export const $selectedDate = atom<string | null>(null);
export const $selectedIndex = atom<number>(0);
export const $forecastDays = atom<ForecastDays | null>(null);
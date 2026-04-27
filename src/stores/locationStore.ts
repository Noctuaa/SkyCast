import { atom } from "nanostores";
import type { GeocodingResult } from "../types/weather";

export const $location = atom<GeocodingResult | null>(null);
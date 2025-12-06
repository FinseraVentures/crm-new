// utils/getServices.ts
import axios from "axios";
import CONFIG, { API_ENDPOINTS, getApiUrl } from "@/config/env";
import {
  getServicesFromIDB,
  saveServicesToIDB,
} from "@/lib/indexedDbServices";
import type { ApiService } from "@/lib/indexedDbServices";

const apiUrl = getApiUrl(API_ENDPOINTS.SERVICES.GET_ALL);

export interface Service {
  _id: string;
  label: string;
  value: string;
  status: boolean;
}

/** slugify and map helpers (inline or import from utils/serviceMappers) */
const slugify = (s: string) =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapApiToService = (a: ApiService): Service => {
  const value =
    a.value && a.value.trim() !== "" ? a.value : slugify(a.label || a._id);
  return {
    _id: a._id,
    label: a.label,
    value,
    status: Boolean(a.status),
  };
};

const mapApiArrayToServiceArray = (arr: ApiService[] = []): Service[] =>
  arr.map(mapApiToService);

/**
 * Main function:
 * - Returns cached services instantly (if valid)
 * - Fetches fresh services in background
 * - Saves updated list to IndexedDB (TTL: 1 month)
 */
export const getServices = async (token?: string): Promise<Service[]> => {
  let cachedServices: Service[] | null = null;

  // 1) Fetch from IndexedDB first (instant UI)
  try {
    const idbData = await getServicesFromIDB(); // returns ApiService[] | null
    if (idbData && idbData.length) {
      // map to Service[] and only active ones
      const mapped = mapApiArrayToServiceArray(idbData).filter((s) => s.status);
      cachedServices = mapped;
    }
  } catch (err) {
    console.warn("Failed loading services from IDB", err);
  }

  // 2) Immediately return cached version (if exists), and refresh in background
  if (cachedServices) {
    refreshServices(token).catch(() => {
      /* ignore background error */
    });
    return cachedServices;
  }

  // 3) No cache -> fetch fresh from API
  return await refreshServices(token);
};

/**
 * Fetches from API, saves to IndexedDB, returns the latest list (mapped).
 */
const refreshServices = async (token?: string): Promise<Service[]> => {
  try {
    const res = await axios.get<ApiService[]>(apiUrl, {
      headers: token ? { authorization: token } : undefined,
    });

    const apiServices: ApiService[] = res.data || [];

    // Save raw API objects to IDB (preserve original shape)
    await saveServicesToIDB(apiServices);

    // Map to Service[] and filter active
    const mapped = mapApiArrayToServiceArray(apiServices).filter(
      (s) => s.status
    );
    return mapped;
  } catch (error) {
    console.error("Failed to fetch services from API:", error);

    // If API fails but cache exists, return fallback mapped cache
    const fallback = await getServicesFromIDB(); // ApiService[] | null
    if (fallback && fallback.length) {
      return mapApiArrayToServiceArray(fallback).filter((s) => s.status);
    }
    return []; // empty fallback
  }
};

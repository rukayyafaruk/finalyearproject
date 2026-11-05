/**
 * useUserLocation — Automatic geolocation detection hook
 *
 * Uses the browser Geolocation API to obtain the user's coordinates,
 * then performs a reverse-geocode via a free public API to get
 * the city/state name for pre-filling the location filter.
 *
 * Gracefully degrades if the user denies permission or the device
 * doesn't support geolocation.
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Reverse geocode lat/lng → human-readable city.
 * Uses BigDataCloud's free API (no API key required, CORS-safe).
 */
async function reverseGeocode(lat, lng) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error('Geocode failed');
    return res.json();
}

/**
 * Map a city/state name from the geocoder to one of our known
 * location values in the DB (case-insensitive partial match).
 *
 * @param {string} cityName  - e.g. "Kano", "Lagos Island"
 * @param {string[]} knownLocations - array of available location strings from API
 * @returns {string}  matched location string, or ''
 */
function matchToKnownLocation(cityName, knownLocations) {
    if (!cityName || !knownLocations?.length) return '';
    const lower = cityName.toLowerCase();

    // Try to match city name against known DB locations
    const match = knownLocations.find((loc) => {
        const locLower = loc.toLowerCase();
        return locLower.includes(lower) || lower.includes(locLower.split(',')[0].trim());
    });

    return match || '';
}

/**
 * @typedef {Object} LocationState
 * @property {'idle'|'detecting'|'resolved'|'denied'|'error'} status
 * @property {number|null} lat
 * @property {number|null} lng
 * @property {string} city       - e.g. "Kano"
 * @property {string} state      - e.g. "Kano State"
 * @property {string} country    - e.g. "Nigeria"
 * @property {string} matched    - matched DB location string (may be '')
 * @property {string|null} error
 */

/**
 * @param {string[]} knownLocations - list of location strings available in DB
 * @param {object}  [options]
 * @param {boolean} [options.autoDetect=true] - automatically trigger detection on mount
 * @returns {{ location: LocationState, detect: Function, reset: Function }}
 */
export function useUserLocation(knownLocations = [], { autoDetect = true } = {}) {
    const [location, setLocation] = useState({
        status: 'idle',
        lat: null,
        lng: null,
        city: '',
        state: '',
        country: '',
        matched: '',
        error: null,
    });

    const detect = useCallback(async () => {
        if (!navigator.geolocation) {
            setLocation((p) => ({
                ...p,
                status: 'error',
                error: 'Geolocation is not supported by your browser.',
            }));
            return;
        }

        setLocation((p) => ({ ...p, status: 'detecting', error: null }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                try {
                    const geo = await reverseGeocode(lat, lng);

                    const city    = geo.city || geo.locality || geo.principalSubdivision || '';
                    const state   = geo.principalSubdivision || '';
                    const country = geo.countryName || '';
                    const matched = matchToKnownLocation(city, knownLocations);

                    setLocation({ status: 'resolved', lat, lng, city, state, country, matched, error: null });
                } catch {
                    // We have coordinates but geocoding failed — still useful for radius search
                    setLocation({ status: 'resolved', lat, lng, city: '', state: '', country: '', matched: '', error: null });
                }
            },
            (err) => {
                const denied = err.code === err.PERMISSION_DENIED;
                setLocation((p) => ({
                    ...p,
                    status: denied ? 'denied' : 'error',
                    error: denied
                        ? 'Location permission was denied. You can still search manually.'
                        : 'Unable to detect your location. Please search manually.',
                }));
            },
            {
                enableHighAccuracy: false,   // battery-friendly
                timeout: 8000,
                maximumAge: 300000,          // cache 5 minutes
            }
        );
    }, [knownLocations]);

    const reset = useCallback(() => {
        setLocation({ status: 'idle', lat: null, lng: null, city: '', state: '', country: '', matched: '', error: null });
    }, []);

    useEffect(() => {
        if (autoDetect) {
            // Small delay so the page renders first
            const t = setTimeout(detect, 600);
            return () => clearTimeout(t);
        }
    }, [autoDetect, detect]);

    return { location, detect, reset };
}

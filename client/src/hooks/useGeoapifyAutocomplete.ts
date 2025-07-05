import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export function useGeoapifyAutocomplete(
    value: string,
    type: 'country' | 'city' | 'street',
    countryCode?: string,
    city?: string
) {
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const fetchSuggestions = useCallback(
        debounce(async (text: string) => {
            if (text.length < 2) return setSuggestions([]);

            const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete');
            
            if (type === 'street' && city) {
                url.searchParams.set('text', `${text}, ${city}`);
            } else {
                url.searchParams.set('text', text);
            }
            
            url.searchParams.set('type', type);
            url.searchParams.set('limit', '5');
            url.searchParams.set('lang', 'en');

            const filters: string[] = [];
            if (countryCode) filters.push(`countrycode:${countryCode}`);
            if (filters.length > 0) url.searchParams.set('filter', filters.join(','));

            url.searchParams.set('apiKey', API_KEY);

            try {
                const res = await fetch(url.toString());
                const data = await res.json();
                setSuggestions(data.features || []);
            } catch (err) {
                console.error('Geoapify fetch error:', err);
                setSuggestions([]);
            }
        }, 300),
        [type, countryCode, city]
    );

    useEffect(() => {
        fetchSuggestions(value);
        return () => fetchSuggestions.cancel?.();
    }, [value, fetchSuggestions]);

    return suggestions;
}

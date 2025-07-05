
import { IFarm } from '@/types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    farmCreateSchema,
    farmEditSchema,
    FarmCreateSchema,
    FarmEditSchema
} from '@/schemas/farmFormSchema';
import { useState, useRef } from 'react';
import { useGeoapifyAutocomplete } from '@/hooks/useGeoapifyAutocomplete';

interface FarmFormProps {
    initialFarm?: IFarm;
    onSubmit: (farm: IFarm) => void;
    onCancel?: () => void;
    loading?: boolean;
    mode?: 'create' | 'edit';
}

const initialFarmState: IFarm = {
    title: '',
    description: '',
    country: '',
    city: '',
    street: '',
    apartment: '',
    latitude: undefined,
    longitude: undefined,
    tags: '',
    coverImage: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
};

export default function FarmForm({ initialFarm, onSubmit, onCancel, loading, mode = 'create' }: FarmFormProps) {
    const schema = mode === 'edit' ? farmEditSchema : farmCreateSchema;
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FarmCreateSchema | FarmEditSchema>({
        resolver: zodResolver(schema),
        defaultValues: initialFarm || initialFarmState,
    });

    const [countryInput, setCountryInput] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [cityInput, setCityInput] = useState('');
    const [streetInput, setStreetInput] = useState('');
    const [isOpen, setIsOpen] = useState<{ country: boolean; city: boolean; street: boolean }>({ country: false, city: false, street: false });

    const countryInputRef = useRef<HTMLInputElement>(null);
    const cityInputRef = useRef<HTMLInputElement>(null);
    const streetInputRef = useRef<HTMLInputElement>(null);

    const countrySuggestions = useGeoapifyAutocomplete(countryInput, 'country');
    const citySuggestions = useGeoapifyAutocomplete(cityInput, 'city', countryCode);
    const streetSuggestions = useGeoapifyAutocomplete(streetInput, 'street', countryCode, cityInput);

    const onFormSubmit = (data: any) => {
        const id = initialFarm?.id;
        onSubmit({ ...(data as IFarm), id } as IFarm);
    };



    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
                <label className="block font-medium">Title</label>
                <input {...register('title')} className="input w-full" placeholder="Farm title" />
                {errors.title && <div className="text-red-500 text-sm">{errors.title.message}</div>}
            </div>
            <div>
                <label className="block font-medium">Description</label>
                <textarea {...register('description')} className="input w-full" placeholder="Farm description" />
            </div>
            <div className="relative">
                <label className="block font-medium">Country</label>
                <input
                    ref={countryInputRef}
                    value={countryInput}
                    onChange={e => {
                        setCountryInput(e.target.value);
                        setIsOpen(prev => ({ ...prev, country: true }));
                    }}
                    placeholder="Start typing country..."
                    className="input w-full"
                    autoComplete="off"
                />
                {isOpen.country && countrySuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded shadow w-full max-h-48 overflow-auto">
                        {countrySuggestions.map(s => (
                            <li
                                key={s.properties.place_id || s.properties.country}
                                onClick={() => {
                                    setCountryInput(s.properties.country);
                                    setCountryCode(s.properties.country_code);
                                    setValue('country', s.properties.country);
                                    setCityInput('');
                                    setStreetInput('');
                                    setIsOpen(prev => ({ ...prev, country: false }));
                                    countryInputRef.current?.blur();

                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-green-100"
                            >
                                {s.properties.country}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="relative">
                <label className="block font-medium">City</label>
                <input
                    ref={cityInputRef}
                    value={cityInput}
                    onChange={e => {
                        setCityInput(e.target.value);
                        setIsOpen(prev => ({ ...prev, city: true }));
                    }}
                    placeholder="Start typing city..."
                    className="input w-full"
                    autoComplete="off"
                    disabled={!countryCode}
                />
                {isOpen.city && citySuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 w-full max-h-48 overflow-auto">
                        {citySuggestions.map(s => (
                            <li
                                key={s.properties.place_id || s.properties.city}
                                onClick={() => {
                                    setCityInput(s.properties.city);
                                    setValue('city', s.properties.city);
                                    setStreetInput('');
                                    setIsOpen(prev => ({ ...prev, city: false }));
                                    cityInputRef.current?.blur();
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-green-100"
                            >
                                {s.properties.city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="relative">
                <label className="block font-medium">Street</label>
                <input
                    ref={streetInputRef}
                    value={streetInput}
                    onChange={e => {
                        setStreetInput(e.target.value);
                        setIsOpen(prev => ({ ...prev, street: true }));
                    }}
                    placeholder="Start typing street..."
                    className="input w-full"
                    autoComplete="off"
                    disabled={!countryCode || !cityInput}
                />
                {isOpen.street && streetSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded shadow w-full max-h-48 overflow-auto">
                        {streetSuggestions.map(s => (
                            <li
                                key={s.properties.place_id || s.properties.street || s.properties.address_line1}
                                onClick={() => {
                                    let streetName = s.properties.street || s.properties.address_line1;
                                    
                                    if (streetName && cityInput && streetName.includes(cityInput)) {
                                        streetName = streetName.replace(`, ${cityInput}`, '').replace(cityInput, '').trim();
                                    }
                                    
                                    setStreetInput(streetName);
                                    setValue('street', streetName);
                                    setValue('latitude', s.properties.lat);
                                    setValue('longitude', s.properties.lon);
                                    setIsOpen(prev => ({ ...prev, street: false }));
                                    streetInputRef.current?.blur();
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-green-100"
                            >
                                {s.properties.street || s.properties.address_line1}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <label className="block font-medium">Apartment (optional)</label>
                <input {...register('apartment')} className="input w-full" placeholder="Apartment" />
            </div>
            <div>
                <label className="block font-medium">Tags (comma separated)</label>
                <input {...register('tags')} className="input w-full" placeholder="eco, organic, ..." />
            </div>
            <div>
                <label className="block font-medium">Cover Image URL</label>
                <input {...register('coverImage')} className="input w-full" placeholder="https://..." />
            </div>
            <div>
                <label className="block font-medium">Contact Email</label>
                <input {...register('contactEmail')} className="input w-full" placeholder="farm@email.com" />
                {errors.contactEmail && <div className="text-red-500 text-sm">{errors.contactEmail.message}</div>}
            </div>
            <div>
                <label className="block font-medium">Contact Phone</label>
                <input {...register('contactPhone')} className="input w-full" placeholder="+972..." />
                {errors.contactPhone && <div className="text-red-500 text-sm">{errors.contactPhone.message}</div>}
            </div>
            <div>
                <label className="block font-medium">Website</label>
                <input {...register('website')} className="input w-full" placeholder="https://example.com" />
                {errors.website && <div className="text-red-500 text-sm">{errors.website.message}</div>}
            </div>
            <div className="flex gap-4 mt-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                {onCancel && (
                    <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold transition" onClick={onCancel} disabled={loading}>Cancel</button>
                )}
            </div>
        </form>
    );
}

import { FC, FormEvent, ChangeEvent, useEffect } from 'react';
import { UpdateUserDto } from '@/types/types.ts';
import { UpdateFormSchemaData } from '@/schemas/updateFormSchema.ts';

type FormErrors = Partial<Record<keyof UpdateFormSchemaData, string[] | undefined>>;

interface EditProfileFormProps {
  user: any;
  onSave: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  formData: UpdateUserDto;
  formErrors: FormErrors | null;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputClass: (fieldName: keyof FormErrors) => string;
}

export const EditProfileForm: FC<EditProfileFormProps> = ({
  onSave,
  onCancel,
  formData,
  formErrors,
  onInputChange,
  inputClass,
}) => {
  useEffect(() => {
    const fetchCoords = async () => {
      const { country, city, street } = formData;
      if (country && city && street) {
        const query = encodeURIComponent(`${country}, ${city}, ${street}`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data[0]) {
          onInputChange({
            target: { name: 'latitude', value: data[0].lat }
          } as any);
          onInputChange({
            target: { name: 'longitude', value: data[0].lon }
          } as any);
        }
      }
    };
    fetchCoords();
    // eslint-disable-next-line
  }, [formData.country, formData.city, formData.street]);

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={onInputChange}
          className={inputClass('firstName')}
        />
        {formErrors?.firstName && <p className="mt-1 text-xs text-red-600">{formErrors.firstName[0]}</p>}
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          className={inputClass('lastName')}
        />
        {formErrors?.lastName && <p className="mt-1 text-xs text-red-600">{formErrors.lastName[0]}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          className={inputClass('email')}
        />
        {formErrors?.email && <p className="mt-1 text-xs text-red-600">{formErrors.email[0]}</p>}
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={onInputChange}
          className={inputClass('phoneNumber')}
        />
        {formErrors?.phoneNumber && <p className="mt-1 text-xs text-red-600">{formErrors.phoneNumber[0]}</p>}
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country || ''}
          onChange={onInputChange}
          className={inputClass('country')}
        />
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city || ''}
          onChange={onInputChange}
          className={inputClass('city')}
        />
      </div>
      <div>
        <label htmlFor="street" className="block text-sm font-medium">Street and house</label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street || ''}
          onChange={onInputChange}
          className={inputClass('street')}
        />
      </div>
      <div>
        <label htmlFor="apartment" className="block text-sm font-medium">Apartment (optional)</label>
        <input
          type="text"
          id="apartment"
          name="apartment"
          value={formData.apartment || ''}
          onChange={onInputChange}
          className={inputClass('apartment')}
        />
      </div>
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium">Current Password</label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={onInputChange}
          className={inputClass('currentPassword')}
        />
        {formErrors?.currentPassword && <p className="mt-1 text-xs text-red-600">{formErrors.currentPassword[0]}</p>}
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={onInputChange}
          className={inputClass('newPassword')}
        />
        {formErrors?.newPassword && <p className="mt-1 text-xs text-red-600">{formErrors.newPassword[0]}</p>}
      </div>
      <div>
        <label htmlFor="confirmNewPassword" className="block text-sm font-medium">Confirm New Password</label>
        <input
          type="password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={onInputChange}
          className={inputClass('confirmNewPassword')}
        />
        {formErrors?.confirmNewPassword && <p className="mt-1 text-xs text-red-600">{formErrors.confirmNewPassword[0]}</p>}
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </form>
  );
}; 
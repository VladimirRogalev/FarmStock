import  { FC } from 'react';
import { IResponseUser } from '@/types/types.ts';

interface ProfileDetailsProps {
  user: IResponseUser;
}

export const ProfileDetails: FC<ProfileDetailsProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <div>
        <span className="font-semibold">First Name:</span> {user.firstName}
      </div>
      <div>
        <span className="font-semibold">Last Name:</span> {user.lastName}
      </div>
      <div>
        <span className="font-semibold">Email:</span> {user.email}
      </div>
      <div>
        <span className="font-semibold">Phone Number:</span> {user.phoneNumber || <span className="text-gray-400">Not specified</span>}
      </div>
      <div>
        <span className="font-semibold">Role:</span> {user.roles?.join(', ') || 'CUSTOMER'}
      </div>
    </div>
  );
}; 
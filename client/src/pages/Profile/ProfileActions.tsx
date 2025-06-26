import { FC } from 'react';

interface ProfileActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onBecomeFarmer: () => void;
  isFarmer: boolean;
}

export const ProfileActions: FC<ProfileActionsProps> = ({ isEditing, onEdit, onDelete, onBecomeFarmer, isFarmer }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {!isEditing && (
        <button
          onClick={onEdit}
          className="bg-green-300 text-green-900 px-4 py-2 rounded hover:bg-green-400 flex-1 min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
        >
          Edit
        </button>
      )}
      <button
        onClick={onDelete}
        className="bg-green-300 text-green-900 px-4 py-2 rounded hover:bg-green-400 flex-1 min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
      >
        Delete account
      </button>
      {!isFarmer && (
        <button
          onClick={onBecomeFarmer}
          className="bg-green-300 text-green-900 px-4 py-2 rounded hover:bg-green-400 flex-1 min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
        >
          Become a farmer
        </button>
      )}
    </div>
  );
}; 
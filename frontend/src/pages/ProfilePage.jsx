import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../features/users/ProfileForm';
import { profileFormDefaultValues } from '../features/users/profileSchema';
import { useCurrentUser, useUpdateUser } from '../features/users/api';

function ProfilePage() {
  const {
    data: currentUserData,
    isLoading,
    isError,
    error: userError,
  } = useCurrentUser();

  const { mutate, isPending, error: updateError } = useUpdateUser();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const defaultValues = useMemo(() => {
    if (!currentUserData) {
      return profileFormDefaultValues;
    }
    return {
      name: currentUserData.name ?? '',
      email: currentUserData.email ?? '',
      phoneNumber: currentUserData.phoneNumber ?? '',
      password: '',
      confirmPassword: '',
    };
  }, [currentUserData]);

  const handleSubmit = (formData) => {
    setServerError('');
    setSuccessMessage('');
    const { password, confirmPassword, ...rest } = formData;

    const payload = { ...rest };

    if (password) {
      payload.password = password;
    }

    mutate(
      { id: currentUserData.id, data: payload },
      {
        onSuccess: () => {
          setSuccessMessage('Profile updated successfully.');
        },
        onError: (err) => {
          setServerError(err.message || 'Failed to update profile.');
          setSuccessMessage('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        Loading your profile...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        {userError.message || 'Failed to load your profile.'}
      </div>
    );
  }

  return (
    <section>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Hello, {currentUserData.name}
        </h1>
        <p className="text-sm text-slate-500">
          Keep your personal information up to date and update your password
          when needed.
        </p>
      </header>

      {successMessage && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="mt-8">
        <ProfileForm
          defaultValues={defaultValues}
          submitLabel="Update Profile"
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          serverError={serverError || updateError?.message}
        />
      </div>
    </section>
  );
}

export default ProfilePage;

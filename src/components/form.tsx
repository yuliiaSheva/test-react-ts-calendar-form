import { useState } from 'react';
import Calendar from './atoms/calendar';
import Input from './atoms/input';
import FileUpload from './atoms/fileUpload';
import Slider from './atoms/slider';
import Button from './atoms/button';

const Form = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string, name: string, size: number, type: string, url: string, file: File
  }>>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [filesError, setFilesError] = useState('');

  const validateFirstName = (value: string) => {
    if (value.trim() === '') {
      setFirstNameError('First name is required');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  const validateLastName = (value: string) => {
    if (value.trim() === '') {
      setLastNameError('Last name is required');
      return false;
    }
    setLastNameError('');
    return true;
  };

  const validateEmail = (value: string) => {
    if (value.trim() === '') {
      setEmailError('Email is required');
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailError('Please use correct formatting. Example: address@email.com');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateFiles = (files: Array<{id: string, name: string, size: number, type: string, url: string, file: File}>) => {
    if (files.length === 0) {
      setFilesError('Please upload a file');
      return false;
    }
    setFilesError('');
    return true;
  };

  const isFormComplete =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    uploadedFiles.length > 0 &&
    selectedDate !== null &&
    selectedTime !== null &&
    firstNameError === '' &&
    lastNameError === '' &&
    emailError === '' &&
    filesError === '';

  const submitFormData = async (formData: FormData) => {
    try {
      const response = await fetch('http://letsworkout.pl/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        alert('Application submitted successfully!');
      } else {
        console.error('Form submission failed:', response.statusText);
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const areFilesValid = validateFiles(uploadedFiles);

    if (isFirstNameValid && isLastNameValid && isEmailValid && areFilesValid && selectedDate && selectedTime) {
      const formData = new FormData();

      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('age', sliderValue.toString());

      formData.append('selectedDate', selectedDate.toISOString());
      formData.append('selectedTime', selectedTime);

      if (uploadedFiles.length > 0) {
        const file = uploadedFiles[0];
        formData.append('file', file.file);
      }

      await submitFormData(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-base font-medium text-gray-800 mb-4 text-[24px] text-left">Personal info</h2>
      <Input
        label="First name"
        name="firstName"
        value={firstName}
        error={firstNameError !== ''}
        errorMessage={firstNameError}
        onChange={(e) => {
          setFirstName(e.target.value);
          if (firstNameError) validateFirstName(e.target.value);
        }}
        onBlur={() => validateFirstName(firstName)}
      />
      <Input
        label="Last name"
        name="lastName"
        value={lastName}
        error={lastNameError !== ''}
        errorMessage={lastNameError}
        onChange={(e) => {
          setLastName(e.target.value);
          if (lastNameError) validateLastName(e.target.value);
        }}
        onBlur={() => validateLastName(lastName)}
      />
      <Input
        label="Email"
        name="email"
        value={email}
        error={emailError !== ''}
        errorMessage={emailError}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) validateEmail(e.target.value);
        }}
        onBlur={() => validateEmail(email)}
      />
      <Slider
        label="Age"
        min={8}
        max={100}
        value={sliderValue}
        onChange={setSliderValue}
        className="mb-4"
      />
      <FileUpload
        maxFiles={1}
        label='Photo'
        onFileSelect={(files) => {
          setUploadedFiles(files);
          validateFiles(files);
        }}
        onFileRemove={(fileId) => {
          const newFiles = uploadedFiles.filter(f => f.id !== fileId);
          setUploadedFiles(newFiles);
          validateFiles(newFiles);
        }}
        className="mt-4"
      />
      {filesError && <p className="text-red-500 text-sm mt-1">{filesError}</p>}

      <h2 className="text-base font-medium text-gray-800 text-[24px] text-left">Your workout</h2>
      <Calendar
        onDateSelect={(date) => {
          setSelectedDate(date);
        }}
        onTimeSelect={(time) => {
          setSelectedTime(time);
        }}
      />

      <Button
        type="submit"
        disabled={!isFormComplete}
      >
        Send Application
      </Button>
    </form>
  );
};

export default Form;

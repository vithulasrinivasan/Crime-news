import React, { useState } from 'react';

const FormWithoutYup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    birthDate: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; // Phone number should be 10 digits
    return phoneRegex.test(phoneNumber);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.birthDate) {
      newErrors.birthDate = "Date of birth is required";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (isValid) {
      alert(`Form Submitted Successfully:
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phoneNumber}
      Address: ${formData.address}
      Date of Birth: ${formData.birthDate}
      Gender: ${formData.gender}`);
    } else {
      console.log("Form Validation Failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          placeholder='Enter your name'
          onChange={handleChange}
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>

      <div>
        <label>Email:</label>
        <input
          type='text'
          name='email'
          value={formData.email}
          placeholder='Enter your Email'
          onChange={handleChange}
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>

      <div>
        <label>Phone Number:</label>
        <input
          type='text'
          name='phoneNumber'
          value={formData.phoneNumber}
          placeholder='Enter your Phone number'
          onChange={handleChange}
        />
        {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
      </div>

      <div>
        <label>Address:</label>
        <textarea
          name='address'
          value={formData.address}
          placeholder='Enter your Address'
          onChange={handleChange}
        />
        {errors.address && <div className="error">{errors.address}</div>}
      </div>

      <div>
        <label>Date of Birth:</label>
        <input
          type='date'
          name='birthDate'
          value={formData.birthDate}
          onChange={handleChange}
        />
        {errors.birthDate && <div className="error">{errors.birthDate}</div>}
      </div>

      <div>
        <label>Gender:</label>
        <div>
          <label>
            <input
              type='radio'
              name='gender'
              value='male'
              checked={formData.gender === 'male'}
              onChange={handleChange}
            />
            Male
          </label>
          <label>
            <input
              type='radio'
              name='gender'
              value='female'
              checked={formData.gender === 'female'}
              onChange={handleChange}
            />
            Female
          </label>
          <label>
            <input
              type='radio'
              name='gender'
              value='other'
              checked={formData.gender === 'other'}
              onChange={handleChange}
            />
            Other
          </label>
        </div>
        {errors.gender && <div className="error">{errors.gender}</div>}
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default FormWithoutYup;

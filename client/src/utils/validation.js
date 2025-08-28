// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 8 characters, one uppercase, one lowercase, one number, one special character)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Name validation (at least 2 characters, only letters, spaces, hyphens, and apostrophes)
const nameRegex = /^[a-zA-Z\s\-']+$/;

// Company name validation (at least 2 characters, letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands)
const companyRegex = /^[a-zA-Z0-9\s\-'.&]+$/;

export const validateEmail = (email) => {
  if (!email) {
    return "Email is required";
  }
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!passwordRegex.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  }
  return null;
};

export const validateName = (name) => {
  if (!name) {
    return "Name is required";
  }
  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (!nameRegex.test(name)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  return null;
};

export const validateCompanyName = (company) => {
  if (!company) {
    return "Company name is required";
  }
  if (company.length < 2) {
    return "Company name must be at least 2 characters long";
  }
  if (!companyRegex.test(company)) {
    return "Company name contains invalid characters";
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

// Generic validation function for forms
export const validateForm = (formData, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const value = formData[field];
    const rule = rules[field];
    
    if (rule.required && !value) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      continue;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters long`;
      continue;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.maxLength} characters long`;
      continue;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `Invalid ${field}`;
      continue;
    }
  }
  
  return errors;
};
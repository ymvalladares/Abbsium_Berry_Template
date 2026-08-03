import * as yup from 'yup';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const Schema_Login_Validation = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username must not exceed 20 characters.')
    .matches(/^\S+$/, 'Username cannot have spaces.'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordRules, 'Password must include uppercase, lowercase, and a number')
});

export const Schema_ForgetPassword_Validation = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Required')
});

export const Schema_Reset_Password_Validation = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required(),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters').matches(passwordRules, { message: 'Password must include uppercase, lowercase, and a number' }).required(),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required()
});

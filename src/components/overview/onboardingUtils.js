import * as Yup from 'yup';

const userSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phone: Yup.string().required().min(4),
});

export const isUserDetailsFilled = user => userSchema.isValidSync(user);

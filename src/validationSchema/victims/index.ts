import * as yup from 'yup';

export const victimValidationSchema = yup.object().shape({
  incident_date: yup.date().nullable(),
  incident_description: yup.string().nullable(),
  incident_location: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
  allegation_id: yup.string().nullable().required(),
});

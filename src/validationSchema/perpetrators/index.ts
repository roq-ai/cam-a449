import * as yup from 'yup';

export const perpetratorValidationSchema = yup.object().shape({
  incident_role: yup.string().nullable(),
  incident_consequence: yup.string().nullable(),
  incident_remarks: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
  allegation_id: yup.string().nullable().required(),
});

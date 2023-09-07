import * as yup from 'yup';

export const investigatorValidationSchema = yup.object().shape({
  investigation_status: yup.string().nullable(),
  investigation_result: yup.string().nullable(),
  investigation_date: yup.date().nullable(),
  user_id: yup.string().nullable().required(),
  assigned_allegation_id: yup.string().nullable().required(),
});

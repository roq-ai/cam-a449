import * as yup from 'yup';

export const allegationValidationSchema = yup.object().shape({
  description: yup.string().required(),
  status: yup.string().required(),
  victim_id: yup.string().nullable().required(),
  investigator_id: yup.string().nullable().required(),
  perpetrator_id: yup.string().nullable().required(),
});

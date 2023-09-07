import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getPerpetratorById, updatePerpetratorById } from 'apiSdk/perpetrators';
import { perpetratorValidationSchema } from 'validationSchema/perpetrators';
import { PerpetratorInterface } from 'interfaces/perpetrator';
import { UserInterface } from 'interfaces/user';
import { AllegationInterface } from 'interfaces/allegation';
import { getUsers } from 'apiSdk/users';
import { getAllegations } from 'apiSdk/allegations';

function PerpetratorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<PerpetratorInterface>(
    () => (id ? `/perpetrators/${id}` : null),
    () => getPerpetratorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PerpetratorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePerpetratorById(id, values);
      mutate(updated);
      resetForm();
      router.push('/perpetrators');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<PerpetratorInterface>({
    initialValues: data,
    validationSchema: perpetratorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Perpetrators',
              link: '/perpetrators',
            },
            {
              label: 'Update Perpetrator',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Perpetrator
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.incident_role}
            label={'Incident Role'}
            props={{
              name: 'incident_role',
              placeholder: 'Incident Role',
              value: formik.values?.incident_role,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.incident_consequence}
            label={'Incident Consequence'}
            props={{
              name: 'incident_consequence',
              placeholder: 'Incident Consequence',
              value: formik.values?.incident_consequence,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.incident_remarks}
            label={'Incident Remarks'}
            props={{
              name: 'incident_remarks',
              placeholder: 'Incident Remarks',
              value: formik.values?.incident_remarks,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<AllegationInterface>
            formik={formik}
            name={'allegation_id'}
            label={'Select Allegation'}
            placeholder={'Select Allegation'}
            fetcher={getAllegations}
            labelField={'description'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/perpetrators')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'perpetrator',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PerpetratorEditPage);

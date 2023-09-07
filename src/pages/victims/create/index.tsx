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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createVictim } from 'apiSdk/victims';
import { victimValidationSchema } from 'validationSchema/victims';
import { UserInterface } from 'interfaces/user';
import { AllegationInterface } from 'interfaces/allegation';
import { getUsers } from 'apiSdk/users';
import { getAllegations } from 'apiSdk/allegations';
import { VictimInterface } from 'interfaces/victim';

function VictimCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: VictimInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createVictim(values);
      resetForm();
      router.push('/victims');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<VictimInterface>({
    initialValues: {
      incident_date: new Date(new Date().toDateString()),
      incident_description: '',
      incident_location: '',
      user_id: (router.query.user_id as string) ?? null,
      allegation_id: (router.query.allegation_id as string) ?? null,
    },
    validationSchema: victimValidationSchema,
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
              label: 'Victims',
              link: '/victims',
            },
            {
              label: 'Create Victim',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Victim
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="incident_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Incident Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.incident_date ? new Date(formik.values?.incident_date) : null}
              onChange={(value: Date) => formik.setFieldValue('incident_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.incident_description}
            label={'Incident Description'}
            props={{
              name: 'incident_description',
              placeholder: 'Incident Description',
              value: formik.values?.incident_description,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.incident_location}
            label={'Incident Location'}
            props={{
              name: 'incident_location',
              placeholder: 'Incident Location',
              value: formik.values?.incident_location,
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
              onClick={() => router.push('/victims')}
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
    entity: 'victim',
    operation: AccessOperationEnum.CREATE,
  }),
)(VictimCreatePage);

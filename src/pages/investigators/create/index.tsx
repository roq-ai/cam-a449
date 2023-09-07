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

import { createInvestigator } from 'apiSdk/investigators';
import { investigatorValidationSchema } from 'validationSchema/investigators';
import { UserInterface } from 'interfaces/user';
import { AllegationInterface } from 'interfaces/allegation';
import { getUsers } from 'apiSdk/users';
import { getAllegations } from 'apiSdk/allegations';
import { InvestigatorInterface } from 'interfaces/investigator';

function InvestigatorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InvestigatorInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInvestigator(values);
      resetForm();
      router.push('/investigators');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InvestigatorInterface>({
    initialValues: {
      investigation_status: '',
      investigation_result: '',
      investigation_date: new Date(new Date().toDateString()),
      user_id: (router.query.user_id as string) ?? null,
      assigned_allegation_id: (router.query.assigned_allegation_id as string) ?? null,
    },
    validationSchema: investigatorValidationSchema,
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
              label: 'Investigators',
              link: '/investigators',
            },
            {
              label: 'Create Investigator',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Investigator
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.investigation_status}
            label={'Investigation Status'}
            props={{
              name: 'investigation_status',
              placeholder: 'Investigation Status',
              value: formik.values?.investigation_status,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.investigation_result}
            label={'Investigation Result'}
            props={{
              name: 'investigation_result',
              placeholder: 'Investigation Result',
              value: formik.values?.investigation_result,
              onChange: formik.handleChange,
            }}
          />

          <FormControl id="investigation_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Investigation Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.investigation_date ? new Date(formik.values?.investigation_date) : null}
              onChange={(value: Date) => formik.setFieldValue('investigation_date', value)}
            />
          </FormControl>
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
            name={'assigned_allegation_id'}
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
              onClick={() => router.push('/investigators')}
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
    entity: 'investigator',
    operation: AccessOperationEnum.CREATE,
  }),
)(InvestigatorCreatePage);

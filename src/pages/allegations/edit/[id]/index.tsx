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
import { getAllegationById, updateAllegationById } from 'apiSdk/allegations';
import { allegationValidationSchema } from 'validationSchema/allegations';
import { AllegationInterface } from 'interfaces/allegation';
import { VictimInterface } from 'interfaces/victim';
import { InvestigatorInterface } from 'interfaces/investigator';
import { PerpetratorInterface } from 'interfaces/perpetrator';
import { getVictims } from 'apiSdk/victims';
import { getInvestigators } from 'apiSdk/investigators';
import { getPerpetrators } from 'apiSdk/perpetrators';

function AllegationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<AllegationInterface>(
    () => (id ? `/allegations/${id}` : null),
    () => getAllegationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AllegationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAllegationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/allegations');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<AllegationInterface>({
    initialValues: data,
    validationSchema: allegationValidationSchema,
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
              label: 'Allegations',
              link: '/allegations',
            },
            {
              label: 'Update Allegation',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Allegation
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.description}
            label={'Description'}
            props={{
              name: 'description',
              placeholder: 'Description',
              value: formik.values?.description,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.status}
            label={'Status'}
            props={{
              name: 'status',
              placeholder: 'Status',
              value: formik.values?.status,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<VictimInterface>
            formik={formik}
            name={'victim_id'}
            label={'Select Victim'}
            placeholder={'Select Victim'}
            fetcher={getVictims}
            labelField={'incident_description'}
          />
          <AsyncSelect<InvestigatorInterface>
            formik={formik}
            name={'investigator_id'}
            label={'Select Investigator'}
            placeholder={'Select Investigator'}
            fetcher={getInvestigators}
            labelField={'investigation_status'}
          />
          <AsyncSelect<PerpetratorInterface>
            formik={formik}
            name={'perpetrator_id'}
            label={'Select Perpetrator'}
            placeholder={'Select Perpetrator'}
            fetcher={getPerpetrators}
            labelField={'incident_role'}
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
              onClick={() => router.push('/allegations')}
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
    entity: 'allegation',
    operation: AccessOperationEnum.UPDATE,
  }),
)(AllegationEditPage);

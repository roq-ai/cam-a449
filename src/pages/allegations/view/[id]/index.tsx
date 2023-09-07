import { Box, Center, Flex, Link, List, ListItem, Spinner, Stack, Text, Image, Button } from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import { Error } from 'components/error';
import { FormListItem } from 'components/form-list-item';
import { FormWrapper } from 'components/form-wrapper';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { routes } from 'routes';
import useSWR from 'swr';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { UserPageTable } from 'components/user-page-table';
import { EntityImage } from 'components/entity-image';
import { FiEdit2 } from 'react-icons/fi';

import { getAllegationById } from 'apiSdk/allegations';
import { AllegationInterface } from 'interfaces/allegation';
import { InvestigatorListPage } from 'pages/investigators';
import { PerpetratorListPage } from 'pages/perpetrators';
import { VictimListPage } from 'pages/victims';

function AllegationViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AllegationInterface>(
    () => (id ? `/allegations/${id}` : null),
    () =>
      getAllegationById(id, {
        relations: [
          'victim_allegation_victim_idTovictim',
          'investigator_allegation_investigator_idToinvestigator',
          'perpetrator_allegation_perpetrator_idToperpetrator',
        ],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

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
              label: 'Allegation Details',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormWrapper wrapperProps={{ border: 'none', gap: 3, p: 0 }}>
              <Flex alignItems="center" w="full" justifyContent={'space-between'}>
                <Box>
                  <Text
                    sx={{
                      fontSize: '1.875rem',
                      fontWeight: 700,
                      color: 'base.content',
                    }}
                  >
                    Allegation Details
                  </Text>
                </Box>
                {hasAccess('allegation', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                  <NextLink href={`/allegations/edit/${id}`} passHref legacyBehavior>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      mr={2}
                      padding="0rem 0.5rem"
                      height="24px"
                      fontSize="0.75rem"
                      variant="outline"
                      color="state.info.main"
                      borderRadius="6px"
                      border="1px"
                      borderColor="state.info.transparent"
                      leftIcon={<FiEdit2 width="12px" height="12px" color="state.info.main" />}
                    >
                      Edit
                    </Button>
                  </NextLink>
                )}
              </Flex>

              <List
                w="100%"
                css={{
                  '> li:not(:last-child)': {
                    borderBottom: '1px solid var(--chakra-colors-base-300)',
                  },
                }}
              >
                <FormListItem label="Description" text={data?.description} />

                <FormListItem label="Status" text={data?.status} />

                <FormListItem
                  label="Created At"
                  text={data?.created_at ? format(parseISO(data?.created_at as unknown as string), 'dd-MM-yyyy') : ''}
                />

                <FormListItem
                  label="Updated At"
                  text={data?.updated_at ? format(parseISO(data?.updated_at as unknown as string), 'dd-MM-yyyy') : ''}
                />

                {hasAccess('victim', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Victim Allegation Victim Id Tovictim"
                    text={
                      <Link as={NextLink} href={`/victims/view/${data?.victim_allegation_victim_idTovictim?.id}`}>
                        {data?.victim_allegation_victim_idTovictim?.incident_description}
                      </Link>
                    }
                  />
                )}
                {hasAccess('investigator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Investigator Allegation Investigator Id Toinvestigator"
                    text={
                      <Link
                        as={NextLink}
                        href={`/investigators/view/${data?.investigator_allegation_investigator_idToinvestigator?.id}`}
                      >
                        {data?.investigator_allegation_investigator_idToinvestigator?.investigation_status}
                      </Link>
                    }
                  />
                )}
                {hasAccess('perpetrator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Perpetrator Allegation Perpetrator Id Toperpetrator"
                    text={
                      <Link
                        as={NextLink}
                        href={`/perpetrators/view/${data?.perpetrator_allegation_perpetrator_idToperpetrator?.id}`}
                      >
                        {data?.perpetrator_allegation_perpetrator_idToperpetrator?.incident_role}
                      </Link>
                    }
                  />
                )}
              </List>
            </FormWrapper>
          </>
        )}
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
    operation: AccessOperationEnum.READ,
  }),
)(AllegationViewPage);

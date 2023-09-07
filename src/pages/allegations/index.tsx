import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
} from '@roq/nextjs';
import { compose } from 'lib/compose';
import { Box, Button, Flex, IconButton, Link, Text, TextProps } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { Error } from 'components/error';
import { SearchInput } from 'components/search-input';
import Table from 'components/table';
import { useDataTableParams, ListDataFiltersType } from 'components/table/hook/use-data-table-params.hook';
import { DATE_TIME_FORMAT } from 'const';
import d from 'dayjs';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash } from 'react-icons/fi';
import useSWR from 'swr';
import { PaginatedInterface } from 'interfaces';
import { withAppLayout } from 'lib/hocs/with-app-layout.hoc';
import { AccessInfo } from 'components/access-info';
import { getAllegations, deleteAllegationById } from 'apiSdk/allegations';
import { AllegationInterface } from 'interfaces/allegation';

type ColumnType = ColumnDef<AllegationInterface, unknown>;

interface AllegationListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
  tableOnly?: boolean;
  hideActions?: boolean;
}

export function AllegationListPage(props: AllegationListPageProps) {
  const {
    filters = {},
    titleProps = {},
    showSearchFilter = true,
    hidePagination,
    hideTableBorders,
    pageSize,
    tableOnly,
    hideActions,
  } = props;
  const { hasAccess } = useAuthorizationApi();
  const { onFiltersChange, onSearchTermChange, params, onPageChange, onPageSizeChange, setParams } = useDataTableParams(
    {
      filters,
      searchTerm: '',
      pageSize,
      order: [
        {
          desc: true,
          id: 'created_at',
        },
      ],
    },
  );

  const fetcher = useCallback(
    async () =>
      getAllegations({
        relations: [
          'victim_allegation_victim_idTovictim',
          'investigator_allegation_investigator_idToinvestigator',
          'perpetrator_allegation_perpetrator_idToperpetrator',
          'investigator_investigator_assigned_allegation_idToallegation.count',
          'perpetrator_perpetrator_allegation_idToallegation.count',
          'victim_victim_allegation_idToallegation.count',
        ],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: ['description.contains', 'status.contains'],
        ...(params.filters || {}),
      }),
    [params.pageSize, params.pageNumber, params.searchTerm, params.order, params.filters],
  );

  const { data, error, isLoading, mutate } = useSWR<PaginatedInterface<AllegationInterface>>(
    () => `/allegations?params=${JSON.stringify(params)}`,
    fetcher,
  );

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAllegationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: AllegationInterface) => {
    if (hasAccess('allegation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/allegations/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    { id: 'description', header: 'Description', accessorKey: 'description' },
    { id: 'status', header: 'Status', accessorKey: 'status' },
    hasAccess('victim', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'victim_allegation_victim_idTovictim',
          header: 'Victim Allegation Victim Id Tovictim',
          accessorKey: 'victim_allegation_victim_idTovictim',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/victims/view/${record.victim_allegation_victim_idTovictim?.id}`}
            >
              {record.victim_allegation_victim_idTovictim?.incident_description}
            </Link>
          ),
        }
      : null,
    hasAccess('investigator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'investigator_allegation_investigator_idToinvestigator',
          header: 'Investigator Allegation Investigator Id Toinvestigator',
          accessorKey: 'investigator_allegation_investigator_idToinvestigator',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/investigators/view/${record.investigator_allegation_investigator_idToinvestigator?.id}`}
            >
              {record.investigator_allegation_investigator_idToinvestigator?.investigation_status}
            </Link>
          ),
        }
      : null,
    hasAccess('perpetrator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'perpetrator_allegation_perpetrator_idToperpetrator',
          header: 'Perpetrator Allegation Perpetrator Id Toperpetrator',
          accessorKey: 'perpetrator_allegation_perpetrator_idToperpetrator',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/perpetrators/view/${record.perpetrator_allegation_perpetrator_idToperpetrator?.id}`}
            >
              {record.perpetrator_allegation_perpetrator_idToperpetrator?.incident_role}
            </Link>
          ),
        }
      : null,
    hasAccess('investigator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'investigator_investigator_assigned_allegation_idToallegation',
          header: 'Investigator Investigator Assigned Allegation Id Toallegation',
          accessorKey: 'investigator_investigator_assigned_allegation_idToallegation',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.investigator_investigator_assigned_allegation_idToallegation,
        }
      : null,
    hasAccess('perpetrator', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'perpetrator_perpetrator_allegation_idToallegation',
          header: 'Perpetrator Perpetrator Allegation Id Toallegation',
          accessorKey: 'perpetrator_perpetrator_allegation_idToallegation',
          cell: ({ row: { original: record } }: any) =>
            record?._count?.perpetrator_perpetrator_allegation_idToallegation,
        }
      : null,
    hasAccess('victim', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'victim_victim_allegation_idToallegation',
          header: 'Victim Victim Allegation Id Toallegation',
          accessorKey: 'victim_victim_allegation_idToallegation',
          cell: ({ row: { original: record } }: any) => record?._count?.victim_victim_allegation_idToallegation,
        }
      : null,

    !hideActions
      ? {
          id: 'actions',
          header: '',
          accessorKey: 'actions',
          cell: ({ row: { original: record } }: any) => (
            <Flex justifyContent="flex-end">
              <NextLink href={`/allegations/view/${record.id}`} passHref legacyBehavior>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  mr={2}
                  padding="0rem 8px"
                  height="24px"
                  fontSize="0.75rem"
                  variant="solid"
                  backgroundColor="state.neutral.transparent"
                  color="state.neutral.main"
                  borderRadius="6px"
                >
                  View
                </Button>
              </NextLink>
              {hasAccess('allegation', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                <NextLink href={`/allegations/edit/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('allegation', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(record.id);
                  }}
                  padding="0rem 0.5rem"
                  variant="outline"
                  aria-label="edit"
                  height={'24px'}
                  fontSize="0.75rem"
                  color="state.error.main"
                  borderRadius="6px"
                  borderColor="state.error.transparent"
                  icon={<FiTrash width="12px" height="12px" color="error.main" />}
                />
              )}
            </Flex>
          ),
        }
      : null,
  ].filter(Boolean) as ColumnType[];
  const table = (
    <Table
      hidePagination={hidePagination}
      hideTableBorders={hideTableBorders}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      columns={columns}
      data={data?.data}
      totalCount={data?.totalCount || 0}
      pageSize={params.pageSize}
      pageIndex={params.pageNumber}
      order={params.order}
      setParams={setParams}
      onRowClick={handleView}
    />
  );
  if (tableOnly) {
    return table;
  }

  return (
    <Flex direction="column" gap={{ md: 6, base: 7 }} shadow="none">
      <Flex justifyContent={{ md: 'space-between' }} direction={{ base: 'column', md: 'row' }} gap={{ base: '28px' }}>
        <Flex alignItems="center" gap={1}>
          <Text as="h1" fontSize="1.875rem" fontWeight="bold" color="base.content" {...titleProps}>
            Allegations
          </Text>
          <AccessInfo entity="allegation" />
        </Flex>

        {hasAccess('allegation', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <NextLink href={`/allegations/create`} passHref legacyBehavior>
            <Button
              onClick={(e) => e.stopPropagation()}
              height={'2rem'}
              padding="0rem 0.75rem"
              fontSize={'0.875rem'}
              fontWeight={600}
              bg="state.info.main"
              borderRadius={'6px'}
              color="base.100"
              _hover={{
                bg: 'state.info.focus',
              }}
              as="a"
            >
              <FiPlus size={16} color="state.info.content" style={{ marginRight: '0.25rem' }} />
              Create
            </Button>
          </NextLink>
        )}
      </Flex>
      {showSearchFilter && (
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'flex-start', md: 'space-between' }}
          gap={{ base: 2, md: 0 }}
        >
          <Box>
            <SearchInput value={params.searchTerm} onChange={onSearchTermChange} />
          </Box>
        </Flex>
      )}

      {error && (
        <Box>
          <Error error={error} />
        </Box>
      )}
      {deleteError && (
        <Box>
          <Error error={deleteError} />{' '}
        </Box>
      )}
      {table}
    </Flex>
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
  withAppLayout(),
)(AllegationListPage);

import { CustomAvatar } from "@/Components/custom-avatar";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { SearchOutlined} from "@ant-design/icons";
import { CreateButton, FilterDropdown, List, useTable, EditButton, DeleteButton} from "@refinedev/antd";
import { getDefaultFilter, useGo } from "@refinedev/core";
import { Table, Input, Space } from 'antd';
import {Text} from '@/Components/text';
import { Company } from "@/graphql/schema.types";
import { currencyNumber } from "@/utilities";



export const CompanyList = ({ children}: React.PropsWithChildren) => {
  const go = useGo();
  const { tableProps, filters} = useTable({
    resource: 'companies',
    onSearch : (value) => {
      return [
        {
          field: 'name',
          operator: 'contains',
          value: value.name
        }
       ]
    },

    pagination: {

      pageSize: 12,
    },

    sorters: {
      initial: [
        {
        field: 'createdAt',
        order: 'desc'
      }
    ]
    },

    filter: {
      initial: [
        {
        field: 'name',
        operator: 'containes',
        value: undefined
      }
    ]
    },

    meta: {
      gqlQuery: COMPANIES_LIST_QUERY
    }
  })


  return (
    <div>
    <List
      breadcrumb={false}
      headerButtons={() => (
        <CreateButton
          onClick={() => {
            go({
              to: {
                resource: "companies",
                action: "create",
              },
              options: {
                keepQuery: true,
              },

              type: "replace",
            });
          }}
        />
      )}
    >
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
        }}
      >
        <Table.Column<Company>
          dataIndex="name"
          title="Company Title"
          defaultFilteredValue={getDefaultFilter("id", filters)}
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Company" />
            </FilterDropdown>
          )}
          render={(value, record) => (
            <Space>
              <CustomAvatar
                shape="square"
                name={record.name}
                src={record.avatarUrl}
              />

              <Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {record.name}
              </Text>
            </Space>
          )}
        />

        <Table.Column<Company>
          dataIndex="totalRevenue"
          title="Open deals amount"
          render={(value, company) => (
            <Text>
              {currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0)}

            </Text>
          )}
        />


<Table.Column<Company>
          dataIndex="id"
          title="Actions"
          fixed="right"
          render={(value) => (
           <Space>

            <EditButton hideText size="small" recordItemId={value}/>
            <DeleteButton hideText size="small" recordItemId={value}/>
           </Space>
          )}
        />
      </Table>
    </List>
    {children}
    </div>
  );
};

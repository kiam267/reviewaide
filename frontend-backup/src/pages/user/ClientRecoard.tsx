import CustomeContainer from 'Components/Common/CustomeContainer';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Empty, Input, Space, Table, Tag } from 'antd';
import type { GetRef, TableColumnType, TableProps } from 'antd';
import UsersLayout from 'Layouts/user';
import { SearchOutlined } from '@ant-design/icons';
import { useGetUser } from 'api/userApi';
// import UserAuth from 'pages/user-auth/user-auth';
import { Navigate } from 'react-router-dom';
// import UserForm from 'Components/UserForm';
import { Rating } from 'react-simple-star-rating';
import { useGetClient } from 'api/clientApi';
import dateFormat from 'dateformat';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { InputRef, TableColumnsType } from 'antd';
import Highlighter from 'react-highlight-words';
type Method = 'facebook' | 'google' | 'private';
export interface DataType {
  companyName?: string;
  method: Method;
  private?: string;
  rating: number;
  clientName: string;
  date: any;
}

function ClientRecoard() {
  const sesstion = localStorage.getItem('user-token');
  const { getUerInfo, isPending } = useGetUser(sesstion as string);
  const [clientSearch, setClientSearch] = useState<ClientSearchState>({
    page: 1,
    clientName: '',
    method: '',
  });

  const { getClientInfo, refetch } = useGetClient(sesstion, clientSearch);

  const userData = getUerInfo;
  // console.log(searchText);

  useEffect(() => {
    refetch();
  }, [clientSearch]);

  const handlePageChange = (page: number) => {
    setClientSearch(prevState => ({
      ...prevState,
      page,
    }));
  };
  const data: DataType[] = [
    {
      clientName: 'John Brown',
      rating: 3,
      method: 'google',
      date: '34897534895',
    },
  ];

  type InputRef = GetRef<typeof Input>;
  // cloumn setup
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof DataType;

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        //  setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',

      render: (_, data) => {
        if (data.companyName === '') {
          return <>unknown</>;
        }

        return data.companyName;
      },
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      ...getColumnSearchProps('clientName'),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (_, data) => {
        if (data.method === 'private') {
          return (
            <Tag color="error" className="fs-6 fw-bold">
              {data.method}
            </Tag>
          );
        }
        if (data.method === 'facebook') {
          return (
            <Tag color="green" className="fs-6 fw-bold">
              {data.method}
            </Tag>
          );
        }
        return (
          <Tag color="geekblue" className="fs-6 fw-bold">
            {data.method}
          </Tag>
        );
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (_, data) => {
        return (
          <Rating
            className="d-block pb-2"
            size={20}
            initialValue={data.rating}
            transition
            readonly
          />
        );
      },
    },
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date',
      render: (_, data) => {
        const dateData = dateFormat(data.date, 'ddd, mmm dS, yyyy');
        return <p>{dateData}</p>;
      },
    },
  ];

  if (getClientInfo?.tokenInvalid) {
    return <Navigate to="/logout" />;
  }

  if (isPending) {
    return <>Loading... </>;
  }

  return (
    <>
      <UsersLayout>
        <CustomeContainer>
          {getClientInfo?.pagination?.total ? (
            <Table
              key={Math.random() * Date.now()}
              columns={columns}
              dataSource={getClientInfo?.data as unknown as DataType[]}
              pagination={{
                pageSize: 10,
                //@ts-ignore
                total: getClientInfo?.pagination?.total | 0,
                current: getClientInfo?.pagination?.page || 0, // Set the current page
                onChange: handlePageChange, // Pass the handlePageChange function
              }}
            />
          ) : (
            <Empty />
          )}
          {/* <App /> */}
        </CustomeContainer>
      </UsersLayout>
    </>
  );
}

export default ClientRecoard;

// const App= () => {
//   const [searchText, setSearchText] = useState('');
//   const [searchedColumn, setSearchedColumn] = useState('');
//   const searchInput = useRef<InputRef>(null);
//   type DataIndex = keyof DataType;

//   const handleSearch = (
//     selectedKeys: string[],
//     confirm: FilterDropdownProps['confirm'],
//     dataIndex: DataIndex
//   ) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters: () => void) => {
//     clearFilters();
//     setSearchText('');
//   };

//   const getColumnSearchProps = (
//     dataIndex: DataIndex
//   ): TableColumnType<DataType> => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//       close,
//     }) => (
//       <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={e =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() =>
//             handleSearch(selectedKeys as string[], confirm, dataIndex)
//           }
//           style={{ marginBottom: 8, display: 'block' }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() =>
//               handleSearch(selectedKeys as string[], confirm, dataIndex)
//             }
//             icon={<SearchOutlined />}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => clearFilters && handleReset(clearFilters)}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Reset
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               confirm({ closeDropdown: false });
//               setSearchText((selectedKeys as string[])[0]);
//               setSearchedColumn(dataIndex);
//             }}
//           >
//             Filter
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               close();
//             }}
//           >
//             close
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered: boolean) => (
//       <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex]
//         .toString()
//         .toLowerCase()
//         .includes((value as string).toLowerCase()),
//     onFilterDropdownOpenChange: visible => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: text =>
//       searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//           searchWords={[searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ''}
//         />
//       ) : (
//         text
//       ),
//   });

//   const columns: TableColumnsType<DataType> = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       width: '30%',
//       ...getColumnSearchProps('name'),
//     },
//     {
//       title: 'Age',
//       dataIndex: 'age',
//       key: 'age',
//       width: '20%',
//       ...getColumnSearchProps('age'),
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       key: 'address',
//       ...getColumnSearchProps('address'),
//       sorter: (a, b) => a.address.length - b.address.length,
//       sortDirections: ['descend', 'ascend'],
//     },
//   ];

//   return <Table columns={columns} dataSource={data} />;
// };

import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table, Tag, message } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import CustomeContainer from 'Components/Common/CustomeContainer';
import axios from 'axios';
import Header from 'Layouts/admin/Header';
import { CLIENT_VISITOR } from '../../helpers/url_helper';
import Logout from 'pages/auth/Logout';

type InputRef = GetRef<typeof Input>;
interface DataType {
  method: string;
  name: string;
  email: string;
  number: string;
  date: string;
  review_method: string;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
  {
    method: 'Both',
    name: 'Abid Hasan',
    email: 'kiamhsan@gmail.com',
    number: '01305420085',
    date: 'sun, 12-02-204',
    review_method: 'facebook',
  },
  {
    method: 'Email',
    name: 'Abid Hasan',
    email: 'kiamhsan@gmail.com',
    number: '01305420085',
    date: 'sun, 12-02-204',
    review_method: 'sms',
  },
  {
    method: 'SMS',
    name: 'Abid Hasan',
    email: 'kiamhsan267@gmail.com',
    number: '01305420085',
    date: 'sun, 12-02-204',
    review_method: 'pending',
  },
  {
    method: 'SMS',
    name: 'Abid Hasan',
    email: 'kiamhsan267@gmail.com',
    number: '01305420085',
    date: 'sun, 12-02-204',
    review_method: 'Private',
  },
];

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [allData, setAllData] = useState<DataType[]>([
    {
      method: '',
      name: '',
      email: '',
      number: '',
      date: '',
      review_method: '',
    },
  ]);
  console.log(allData);
  
  const searchInput = useRef<InputRef>(null);
  const [validCookie, setValidCookie] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    axios.get(CLIENT_VISITOR, { headers: { token } }).then(res => {
      if (res?.msg?.name === 'error') {
        message.error(res?.msg?.msg);
      }
      if (res?.msg?.name === 'success') {
        setAllData(res.msg[0].data);
      }

      if (res.msg.name === 'auth') {
        return setValidCookie(true);
      }
    });
  }, []);
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
        // setTimeout(() => searchInput.current?.select(), 100);
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

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      ...getColumnSearchProps('method'),
      render: (_, { method }) => {
        return (
          <Tag color="geekblue" className="fs-6 fw-bold">
            {method}
          </Tag>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date'),
    },
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      ...getColumnSearchProps('number'),
      // sorter: (a, b) => a.address.length - b.address.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Review Method',
      dataIndex: 'review_method',
      key: 'review_method',
      ...getColumnSearchProps('review_method'),
      render: (_, { review_method }) => {
        if (review_method === 'pending' || review_method === 'Private') {
          return (
            <Tag color="volcano" className="fs-6 fw-bold">
              {review_method}
            </Tag>
          );
        }
        return (
          <Tag color="geekblue" className="fs-6 fw-bold">
            {review_method}
          </Tag>
        );
      },
      // sorter: (a, b) => a.address.length - b.address.length,
      // sortDirections: ['descend', 'ascend'],
    },
  ];

  if (validCookie) {
    return <Logout />;
  }
  return (
    <CustomeContainer>
      <Table columns={columns} dataSource={allData} />
    </CustomeContainer>
  );
};

export default App;

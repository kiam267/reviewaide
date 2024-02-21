import React, { useEffect, useRef, useState } from 'react';
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import {
  Row,
  Col,
  Card,
  Skeleton,
  Avatar,
  message,
  Drawer,
  Button,
  Space,
  Table,
  Tag,
  Pagination,
  Input as ANTInput,
} from 'antd';
import axios from 'axios';
import AdminLogout from 'pages/auth/AdminLogout';
import {
  GET_USERS,
  SERVER_LINK,
  ADMIN_USER_EDIT,
} from '../../helpers/url_helper';
import CustomeContainer from 'Components/Common/CustomeContainer';
import user from 'Layouts/user';
import { Alert, Form, FormFeedback, Input, Label } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
const { Meta } = Card;

function Allusers(props) {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [users, setUsers] = useState<UserData[]>([
    {
      company_name: '',
      date: '',
      email: '',
      facebook_link: '',
      google_link: '',
      phato_path: '',
      phone: '',
      temporaray_lock: '',
      uniqueId: '',
      username: '',
    },
  ]);
  const [Sglusers, setSglUsers] = useState<UserData>({
    company_name: '',
    date: '',
    email: '',
    facebook_link: '',
    google_link: '',
    phato_path: '',
    phone: '',
    temporaray_lock: '',
    uniqueId: '',
    username: '',
  });
  const [validCookie, setValidCookie] = useState(true);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  type InputRef = GetRef<typeof ANTInput>;

  interface DataType {
    company_name: string;
    date: string;
    email: string;
    facebook_link: string;
    google_link: string;
    phato_path: string;
    phone: string;
    temporaray_lock: string;
    uniqueId: string;
    username: string;
  }

  type DataIndex = keyof DataType;

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const token = localStorage.getItem('adToken');
    axios.get(GET_USERS, { headers: { token } }).then(resp => {
      const res = resp.data;
      if (res?.msg?.name === 'error') {
        return message.error(res?.msg?.msg);
      }

      if (res?.msg?.name === 'success') {
        setUsers(res.msg[0]);

        return;
      }
      if (res.msg.name === 'auth') {
        setValidCookie(false);
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const onHadelEdit = id => {
    const singleUser = users.filter(user => (user.uniqueId === id ? user : ''));
    setSglUsers(singleUser[0]);

    return;
  };
  const onHadelDelete = id => {
    const singleUser = users.filter(user => (user.uniqueId === id ? user : ''));
    const token = localStorage.getItem('adToken');
    axios
      .delete(ADMIN_USER_EDIT, {
        data: singleUser[0],
        headers: { token },
      })
      .then(resp => {
        const res = resp.data;
        if (res?.msg?.name === 'error') {
          return message.error(res?.msg?.msg);
        }

        if (res?.msg?.name === 'success') {
          setUsers(res.msg[0]);
          return message.success('User deleted successfully');
        }
        if (res.msg.name === 'auth') {
          setValidCookie(false);
        }
      });
    return;
  };

  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );

  const { error } = useSelector(selectProperties);

  // Form validation

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: Sglusers.username,
      email: Sglusers.email,
      phone: Sglusers.phone,
      date: Sglusers.date,
      company_name: Sglusers.company_name,
      facebook_link: Sglusers.facebook_link,
      google_link: Sglusers.google_link,
      temporaray_lock: Sglusers.temporaray_lock,
    },
    // validationSchema: Yup.object({
    //   username: Yup.string(),
    //   email: Yup.string().email().trim(),
    //   phone: Yup.number(),
    //   date: Yup.string(),
    //   company_name: Yup.string(),
    //   facebook_link: Yup.string(),
    //   google_link: Yup.string(),
    //   temporaray_lock: Yup.string(),
    // }),
    onSubmit: (values: any, { resetForm }) => {
      const token = localStorage.getItem('adToken');
      axios
        .put(ADMIN_USER_EDIT, { ...values }, { headers: { token } })
        .then(resp => {
          const res = resp.data;
          if (res?.msg?.name === 'error') {
            return message.error(res?.msg?.msg);
          }

          if (res?.msg?.name === 'success') {
            setOpen(false);
            return message.success('User update successfully');
          }
          if (res.msg.name === 'auth') {
            setValidCookie(false);
          }
        });
    },
  });
  if (!validCookie) {
    return <AdminLogout />;
  }
  //  const [currentPage, setCurrentPage] = useState(1);

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
        <ANTInput
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
      title: 'User Image',
      dataIndex: 'phato_path',
      key: 'phato_path',
      render: (_, record, inx) => {
        return (
          <Avatar
            src={
              record.phato_path
                ? ` ${SERVER_LINK}api/uploads/${record.phato_path}`
                : `https://api.dicebear.com/7.x/miniavs/svg?seed=${inx}`
            }
          ></Avatar>
        );
      },
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      width: '30%',
      // ...getColumnSearchProps('username'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
      ...getColumnSearchProps('date'),
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="rounded-5"
            style={{ border: ' 1px solid #F6653F' }}
            onClick={showDrawer}
          >
            <i
              className="bx bxs-edit-alt text-black fs-4"
              onClick={() => onHadelEdit(record.uniqueId)}
            ></i>
          </Button>
          <Button
            danger
            className="rounded-5"
            style={{ border: ' 1px solid #F6653F' }}
            onClick={() => onHadelDelete(record.uniqueId)}
          >
            <i className="bx bxs-trash-alt"></i>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <CustomeContainer>
      <Drawer className="py-5" onClose={onClose} open={open}>
        <Form
          className="form-horizontal"
          onSubmit={e => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Name</Label>
            <Input
              name="username"
              className="form-control"
              placeholder="jon"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.username || ''}
              invalid={
                validation.touched.username && validation.errors.username
                  ? true
                  : false
              }
            />
            {validation.touched.username && validation.errors.username ? (
              <FormFeedback type="invalid">
                {validation.errors.username}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Email</Label>
            <Input
              name="email"
              className="form-control"
              placeholder="jon@gmail.com"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.email || ''}
              invalid={
                validation.touched.email && validation.errors.email
                  ? true
                  : false
              }
            />
            {validation.touched.email && validation.errors.email ? (
              <FormFeedback type="invalid">
                {validation.errors.email}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Phone</Label>
            <Input
              name="phone"
              className="form-control"
              placeholder="+1 4843734025"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.phone || ''}
              invalid={
                validation.touched.phone && validation.errors.phone
                  ? true
                  : false
              }
            />
            {validation.touched.phone && validation.errors.phone ? (
              <FormFeedback type="invalid">
                {validation.errors.phone}
              </FormFeedback>
            ) : null}
          </div>

          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Date</Label>
            <Input
              name="date"
              className="form-control"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.date || ''}
              invalid={
                validation.touched.date && validation.errors.date ? true : false
              }
            />
            {validation.touched.date && validation.errors.date ? (
              <FormFeedback type="invalid">
                {validation.errors.date}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Company Name</Label>
            <Input
              name="company_name"
              className="form-control"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.company_name || ''}
              invalid={
                validation.touched.company_name &&
                validation.errors.company_name
                  ? true
                  : false
              }
            />
            {validation.touched.company_name &&
            validation.errors.company_name ? (
              <FormFeedback type="invalid">
                {validation.errors.company_name}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Facebook Link</Label>
            <Input
              name="facebook_link"
              className="form-control"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.facebook_link || ''}
              invalid={
                validation.touched.facebook_link &&
                validation.errors.facebook_link
                  ? true
                  : false
              }
            />
            {validation.touched.facebook_link &&
            validation.errors.facebook_link ? (
              <FormFeedback type="invalid">
                {validation.errors.facebook_link}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">google Link</Label>
            <Input
              name="google_link"
              className="form-control"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.google_link || ''}
              invalid={
                validation.touched.google_link && validation.errors.google_link
                  ? true
                  : false
              }
            />
            {validation.touched.google_link && validation.errors.google_link ? (
              <FormFeedback type="invalid">
                {validation.errors.google_link}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3">
            {error ? <Alert color="danger">{error}</Alert> : null}
            <Label className="form-label">Temporaray Lock</Label>
            <Input
              name="temporaray_lock"
              className="form-control"
              type="text"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.temporaray_lock || ''}
              invalid={
                validation.touched.temporaray_lock &&
                validation.errors.temporaray_lock
                  ? true
                  : false
              }
            />
            {validation.touched.temporaray_lock &&
            validation.errors.temporaray_lock ? (
              <FormFeedback type="invalid">
                {validation.errors.temporaray_lock}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mt-3 d-grid">
            <button
              className="btn btn-block fw-bold text-white "
              type="submit"
              style={{ background: '#F6653F' }}
            >
              Update
            </button>
          </div>
        </Form>
      </Drawer>
      <Table columns={columns} dataSource={users} />
    </CustomeContainer>
  );
}

export default Allusers;

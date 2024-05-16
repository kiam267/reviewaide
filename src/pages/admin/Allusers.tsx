import React, { useEffect, useRef, useState } from 'react';

import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import dateFormat from 'dateformat';
import Highlighter from 'react-highlight-words';
import {
  Avatar,
  Drawer,
  Button,
  Space,
  Table,
  Tag,
  Input as ANTInput,
  Empty,
  Select,
  Modal,
  Spin,
} from 'antd';
import { REACT_APP_SERVER_API } from '../../helpers/url_helper';
import CustomeContainer from 'Components/Common/CustomeContainer';
import user from 'Layouts/user';
import { Alert, Form, FormFeedback, Input, Label } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import {
  UserViaAdminSeachState,
  useDeletUserViaAdmin,
  useGetUserViaAdmin,
  useUpdateUserViaAdmin,
} from 'api/adminApi';
import { Navigate } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';

type UserStatus = 'active' | 'pending' | 'deactivated';
interface DataType {
  id: number;
  fullName: string;
  password: string;
  email: string;
  phone: number;
  companyLogo: string;
  companyName: string;
  googleLink: string;
  facebookLink: string;
  userStatus: UserStatus;
  createdAt: string;
}
function Allusers(props) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [selectedUser, setSelectedUser] = useState<DataType>();
  const { confirm } = Modal;
  const [userSearch, setUserSearch] = useState<UserViaAdminSeachState>({
    page: 1,
    searchCompanyName: '',
    searchPhoneNumber: '',
    searchUserEmail: '',
    searchUserName: '',
    searchUserStatus: '',
  });
  const token = localStorage.getItem('admin-token');
  //@ts-ignore
  const { getUserInfo, refetch } = useGetUserViaAdmin(token, userSearch);
  const { deleteUserViaAdmin, isSuccess: isDelteSuccess } =
    useDeletUserViaAdmin();

  useEffect(() => {
    refetch();
  }, [userSearch, isDelteSuccess]);

  const handePageChange = (page: number) => {
    setUserSearch(pre => ({
      ...pre,
      page,
    }));
  };

  const [open, setOpen] = useState(false);



  type InputRef = GetRef<typeof ANTInput>;

  type DataIndex = keyof DataType;

  const onClose = () => {
    setOpen(false);
  };

  // DELETE Model Fun

  const showDeleteConfirm = (email: string) => {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        //@ts-ignore
        await deleteUserViaAdmin({ email, token });
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
    });
  };
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
  const handelUpdateUser = ({ isChange }: { isChange: boolean }) => {
    if (isChange) {
      refetch();
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
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
            onClick={() => {
              setUserSearch(pre => ({
                ...pre,
                searchUserName:
                  searchedColumn === 'fullName'
                    ? (selectedKeys[0] as string)
                    : pre.searchUserName,
                searchUserEmail:
                  searchedColumn === 'email'
                    ? (selectedKeys[0] as string)
                    : pre.searchUserEmail,
                searchPhoneNumber:
                  searchedColumn === 'phone'
                    ? (selectedKeys[0] as string)
                    : pre.searchPhoneNumber,
                searchCompanyName:
                  searchedColumn === 'companyName'
                    ? (selectedKeys[0] as string)
                    : pre.searchCompanyName,
                searchUserStatus:
                  searchedColumn === 'userStatus'
                    ? (selectedKeys[0] as string)
                    : pre.searchUserStatus,
              }));

              handleSearch(selectedKeys as string[], confirm, dataIndex);
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
              setUserSearch({
                page: 1,
                searchCompanyName: '',
                searchPhoneNumber: '',
                searchUserEmail: '',
                searchUserName: '',
                searchUserStatus: '',
              });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
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
      dataIndex: 'companyLogo',
      key: 'companyLogo',
      render: (_, item) => {
        return <Avatar>{item?.fullName.trim().substring(0, 1)}</Avatar>;
      },
    },
    {
      title: 'User Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '30%',
      ...getColumnSearchProps('fullName'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      ...getColumnSearchProps('phone'),
    },
    // {
    //   title: 'Company Name',
    //   dataIndex: 'companyName',
    //   key: 'companyName',
    //   ...getColumnSearchProps('companyName'),
    // },
    // {
    //   title: 'Google Link',
    //   dataIndex: 'googleLink',
    //   key: 'googleLink',
    // },
    // {
    //   title: 'Facebook Link',
    //   dataIndex: 'facebookLink',
    //   key: 'facebookLink',
    // },
    {
      title: 'Mode',
      dataIndex: 'userStatus',
      key: 'userStatus',
      ...getColumnSearchProps('userStatus'),
      render: (_, data) => {
        if (data.userStatus === 'active') {
          return (
            <Tag color="green" className="fs-6 fw-bold">
              {data.userStatus}
            </Tag>
          );
        }

        if (data.userStatus === 'deactivated') {
          return (
            <Tag color="yellow" className="fs-6 fw-bold">
              {data.userStatus}
            </Tag>
          );
        }
        return (
          <Tag color="geekblue" className="fs-6 fw-bold">
            {data.userStatus}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '30%',
      render: (_, data) => {
        const dateData = dateFormat(data.createdAt, 'ddd, mmm dS, yyyy');
        return <p>{dateData}</p>;
      },
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              key={record.id}
              className="rounded-5"
              style={{ border: ' 1px solid #F6653F' }}
              onClick={() => {
                setSelectedUser(record as DataType);
                setOpen(true);
              }}
            >
              <i className="bx bxs-edit-alt text-black fs-4"></i>
            </Button>
            <UserEdit
              key={record.email}
              onClose={onClose}
              open={open}
              user={selectedUser}
              handelUpdateUser={isChange => handelUpdateUser({ isChange })}
            />
            <Button
              danger
              className="rounded-5"
              style={{ border: ' 1px solid #F6653F' }}
              onClick={() => showDeleteConfirm(record.email)}
              type="dashed"
            >
              <i className="bx bxs-trash-alt"></i>
            </Button>
          </Space>
        );
      },
    },
  ];

  if (getUserInfo?.tokenInvalid) {
    return <Navigate to="/super-admin/logout" />;
  }
  return (
    <CustomeContainer>
      {getUserInfo?.pagination?.total ? (
        <Table
          key={getUserInfo?.data?.email}
          columns={columns}
          //@ts-ignore
          dataSource={getUserInfo?.data as (User | undefined)[]}
          pagination={{
            pageSize: 10,
            current: getUserInfo?.pagination?.page || 1,
            total: getUserInfo?.pagination?.total,
            onChange: handePageChange,
          }}
          scroll={{ x: 700 }}
        />
      ) : (
        <Empty />
      )}
    </CustomeContainer>
  );
}

function UserEdit({
  onClose,
  open,
  user,
  handelUpdateUser,
}: {
  onClose: () => void;
  open: boolean;
  user: DataType | undefined;
  handelUpdateUser: (isChange: boolean) => void;
}) {
  const selectProperties = createSelector(
    (state: any) => state.Login,
    login => ({
      error: login.error,
    })
  );


  const { error } = useSelector(selectProperties);
  const { updateUserViaAdmin, isPending, isSuccess } = useUpdateUserViaAdmin();
  const token = localStorage.getItem('admin-token');
  const dateData = dateFormat(user?.createdAt, 'ddd, mmm dS, yyyy');
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      fullName: user?.fullName,
      email: user?.email,
      phone: user?.phone,
      createdAt: dateData,
      companyName: user?.companyName,
      facebookLink: user?.facebookLink,
      googleLink: user?.googleLink,
      userStatus: user?.userStatus,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Enter your name'),
      email: Yup.string().email().trim().required('Enter your email'),
      phone: Yup.number().required('Enter your phone number'),
      // companyName: Yup.string(),
      // facebookLink: Yup.string(),
      // googleLink: Yup.string(),
      userStatus: Yup.string(),
    }),
    onSubmit: async (values: any) => {
      //@ts-ignore
      await updateUserViaAdmin({ token, user: values });
    },
  });


  

  useEffect(() => {
    if (isSuccess) handelUpdateUser(isSuccess);
  }, [isSuccess]);

  return (
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
            name="fullName"
            className="form-control"
            placeholder="jon"
            type="text"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.fullName || ''}
            invalid={
              validation.touched.fullName && validation.errors.fullName
                ? true
                : false
            }
          />
          {validation.touched.fullName && validation.errors.fullName ? (
            <FormFeedback type="invalid">
              {validation.errors.fullName}
            </FormFeedback>
          ) : null}
        </div>
        <div className="mb-3">
          {error ? <Alert color="danger">{error}</Alert> : null}
          <Label className="form-label">Email</Label>
          <Input
            name="email"
            disabled
            className="form-control"
            placeholder="jon@gmail.com"
            type="text"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.email || ''}
            invalid={
              validation.touched.email && validation.errors.email ? true : false
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
              validation.touched.phone && validation.errors.phone ? true : false
            }
          />
          {validation.touched.phone && validation.errors.phone ? (
            <FormFeedback type="invalid">
              {validation.errors.phone}
            </FormFeedback>
          ) : null}
        </div>
        {/* <div className="mb-3">
          {error ? <Alert color="danger">{error}</Alert> : null}
          <Label className="form-label">Company Name</Label>
          <Input
            name="companyName"
            className="form-control"
            type="text"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.companyName || ''}
            invalid={
              validation.touched.companyName && validation.errors.companyName
                ? true
                : false
            }
          />
          {validation.touched.companyName && validation.errors.companyName ? (
            <FormFeedback type="invalid">
              {validation.errors.companyName}
            </FormFeedback>
          ) : null}
        </div> */}
        {/* <div className="mb-3">
          {error ? <Alert color="danger">{error}</Alert> : null}
          <Label className="form-label">Facebook Link</Label>
          <Input
            name="facebookLink"
            className="form-control"
            type="text"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.facebookLink || ''}
            invalid={
              validation.touched.facebookLink && validation.errors.facebookLink
                ? true
                : false
            }
          />
          {validation.touched.facebookLink && validation.errors.facebookLink ? (
            <FormFeedback type="invalid">
              {validation.errors.facebookLink}
            </FormFeedback>
          ) : null}
        </div> */}
        {/* <div className="mb-3">
          {error ? <Alert color="danger">{error}</Alert> : null}
          <Label className="form-label">google Link</Label>
          <Input
            name="googleLink"
            className="form-control"
            type="text"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.googleLink || ''}
            invalid={
              validation.touched.googleLink && validation.errors.googleLink
                ? true
                : false
            }
          />
          {validation.touched.googleLink && validation.errors.googleLink ? (
            <FormFeedback type="invalid">
              {validation.errors.googleLink}
            </FormFeedback>
          ) : null}
        </div> */}
        <div className="mb-3 ">
          {' '}
          <Label className="form-label">Select Status</Label>
          <Space>
            <Select
              value={validation.values.userStatus}
              style={{ width: 320 }}
              onChange={selectedOption => {
                validation.setFieldValue('userStatus', selectedOption);
              }}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'active', label: 'Active' },
                { value: 'deactived', label: 'Deactived' },
              ]}
            />
          </Space>
        </div>
        <div className="mt-3 d-grid">
          <button
            className="btn btn-block fw-bold text-white "
            type="submit"
            style={{ background: '#F6653F' }}
          >
            {isPending ? (
              <Spin
                style={{
                  color: '#FFFFFF',
                }}
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            ) : (
              <>Update</>
            )}
          </button>
        </div>
      </Form>
    </Drawer>
  );
}
export default Allusers;

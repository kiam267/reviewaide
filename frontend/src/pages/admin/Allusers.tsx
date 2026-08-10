import React, { useEffect, useRef, useState } from 'react';

import {
  SearchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type {
  GetRef,
  TableColumnsType,
  TableColumnType,
} from 'antd';
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
import CustomeContainer from '@/components/Common/CustomeContainer';
import {
  Alert,
  Form,
  FormFeedback,
  Input,
  Label,
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import {
  useDeleteUserViaAdmin,
  useGetUserViaAdmin,
  useUpdateUserViaAdmin,
} from '@/hook/useAdmin';
import { Navigate } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';

function Allusers(props) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [selectedUser, setSelectedUser] =
    useState<RawUser>();
  const { confirm } = Modal;
  const [userSearch, setUserSearch] =
    useState<UserViaAdminSeachState>({
      page: 1,
      searchCompanyName: '',
      searchPhoneNumber: '',
      searchUserEmail: '',
      searchUserName: '',
      searchUserStatus: '',
    });

  //@ts-ignore
  const { data: getUserInfo, refetch } =
    useGetUserViaAdmin(userSearch);
  const {
    mutate: deleteUserViaAdmin,
    isSuccess: isDelteSuccess,
  } = useDeleteUserViaAdmin();

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

  type DataIndex = keyof RawUser;

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
          setTimeout(
            Math.random() > 0.5 ? resolve : reject,
            1000,
          );
        }).catch(() => console.log('Oops errors!'));
      },
    });
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const handelUpdateUser = ({
    isChange,
  }: {
    isChange: boolean;
  }) => {
    if (isChange) {
      refetch();
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): TableColumnType<RawUser> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={e => e.stopPropagation()}
      >
        <ANTInput
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(
              e.target.value ? [e.target.value] : [],
            )
          }
          onPressEnter={() =>
            handleSearch(
              selectedKeys as string[],
              confirm,
              dataIndex,
            )
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

              handleSearch(
                selectedKeys as string[],
                confirm,
                dataIndex,
              );
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
      <SearchOutlined
        style={{ color: filtered ? '#1677ff' : undefined }}
      />
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
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<RawUser> = [
    {
      title: 'User Image',
      dataIndex: 'companyLogo',
      key: 'companyLogo',
      render: (_, item) => {
        return (
          <div>
            {item?.username
              ?.trim()
              ?.charAt(0)
              ?.toUpperCase() || 'U'}
          </div>
        );
      },
    },

    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '30%',
      ...getColumnSearchProps('username'),
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

    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      ...getColumnSearchProps('companyName'),
    },

    {
      title: 'Google Link',
      dataIndex: 'googleLink',
      key: 'googleLink',
    },

    {
      title: 'Facebook Link',
      dataIndex: 'facebookLink',
      key: 'facebookLink',
    },

    // {
    //   title: 'Mode',
    //   dataIndex: 'userStatus',
    //   key: 'userStatus',
    //   ...getColumnSearchProps('userStatus'),
    //   render: (_, data) => {
    //     if (data.userStatus === 'active') {
    //       return (
    //         <span style={{ color: 'green' }}>Active</span>
    //       );
    //     }

    //     if (data.userStatus === 'deactivated') {
    //       return (
    //         <span style={{ color: 'orange' }}>
    //           Deactivated
    //         </span>
    //       );
    //     }

    //     return (
    //       <span style={{ color: 'blue' }}>
    //         {data.userStatus}
    //       </span>
    //     );
    //   },
    // },

    // {
    //   title: 'Date',
    //   dataIndex: 'createdAt',
    //   key: 'createdAt',
    //   width: '30%',
    //   render: (_, data) => {
    //     if (!data.createdAt) return '-';
    //     const date = new Date(
    //       data.createdAt,
    //     ).toLocaleDateString();
    //     return <span>{date}</span>;
    //   },
    // },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              key={record.id}
              onClick={() => {
                setSelectedUser(record);
                setOpen(true);
              }}
            >
              Edit
            </Button>

            <Button
              danger
              onClick={() =>
                showDeleteConfirm(record.email)
              }
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <CustomeContainer>
      {getUserInfo?.response?.data?.pagination?.total ? (
        <Table<RawUser>
          key={getUserInfo?.response.data.data.at(0)?.id}
          columns={columns}
          //@ts-ignore
          dataSource={
            getUserInfo.response.data
              .data as unknown as UserViaAdmin
          }
          pagination={{
            pageSize: 10,
            current:
              getUserInfo?.response.data.pagination?.page ||
              1,
            total:
              getUserInfo?.response.data.pagination?.total,
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
    }),
  );

  const { error } = useSelector(selectProperties);
  const {
    data: updateUserViaAdmin,
    isPending,
    isSuccess,
  } = useUpdateUserViaAdmin();
  const token = localStorage.getItem('admin-token');
  const dateData = dateFormat(
    user?.createdAt,
    'ddd, mmm dS, yyyy',
  );
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
      email: Yup.string()
        .email()
        .trim()
        .required('Enter your email'),
      phone: Yup.number().required(
        'Enter your phone number',
      ),
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
          {error ? (
            <Alert color="danger">{error}</Alert>
          ) : null}
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
              validation.touched.fullName &&
              validation.errors.fullName
                ? true
                : false
            }
          />
          {validation.touched.fullName &&
          validation.errors.fullName ? (
            <FormFeedback type="invalid">
              {validation.errors.fullName}
            </FormFeedback>
          ) : null}
        </div>
        <div className="mb-3">
          {error ? (
            <Alert color="danger">{error}</Alert>
          ) : null}
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
              validation.touched.email &&
              validation.errors.email
                ? true
                : false
            }
          />
          {validation.touched.email &&
          validation.errors.email ? (
            <FormFeedback type="invalid">
              {validation.errors.email}
            </FormFeedback>
          ) : null}
        </div>
        <div className="mb-3">
          {error ? (
            <Alert color="danger">{error}</Alert>
          ) : null}
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
              validation.touched.phone &&
              validation.errors.phone
                ? true
                : false
            }
          />
          {validation.touched.phone &&
          validation.errors.phone ? (
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
          <Label className="form-label">
            Select Status
          </Label>
          <Space>
            <Select
              value={validation.values.userStatus}
              style={{ width: 320 }}
              onChange={selectedOption => {
                validation.setFieldValue(
                  'userStatus',
                  selectedOption,
                );
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
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 24 }}
                    spin
                  />
                }
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

import UserForm from 'Components/UserForm';
import UserAuth from 'pages/user-auth/user-auth';


function Profile() {
  return (
    <UserAuth>
      <UserForm />
    </UserAuth>
  );
}

export default Profile
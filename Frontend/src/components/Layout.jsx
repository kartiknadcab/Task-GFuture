import { Container } from 'react-bootstrap';
import Navbar from './Navbar';

const Layout = ({ user, logout, children }) => {
  console.log(user, logout, children,"")
  return (
    <>
      <Navbar user={user} logout={logout} />
      <Container className="my-4">{children}</Container>
    </>
  );
};

export default Layout;
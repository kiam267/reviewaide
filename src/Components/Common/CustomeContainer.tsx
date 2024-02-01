import { Container } from 'reactstrap';
function CustomeContainer(props) {
  return (
    <div className="page-content">
      <Container fluid>{props.children}</Container>
    </div>
  );
}

export default CustomeContainer;

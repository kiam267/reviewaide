import { Container } from 'reactstrap';
function AllContainer(props) {
  return (
    <div className="page-content">
      <Container fluid>{props.children}</Container>
    </div>
  );
}

export default AllContainer;

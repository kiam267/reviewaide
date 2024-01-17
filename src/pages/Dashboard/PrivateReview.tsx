import React from 'react'
import { Container } from 'reactstrap';
import Breadcrumb from 'Components/Common/Breadcrumb';
interface Props {}

function PrivateReview(props: Props) {
  const {} = props

  return (
      <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboards" breadcrumbItem="Dashboards" />
          <h1>Hello Bangladesh</h1>
        </Container>
      </div>
    </React.Fragment >
  )
}

export default PrivateReview

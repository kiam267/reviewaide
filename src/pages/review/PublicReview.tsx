import CustomeContainer from 'Components/Common/CustomeContainer';
import React from 'react';
import { Breadcrumb } from 'reactstrap';

interface Props {}

function PublicReview(props: Props) {
  const {} = props;

  return (
    <CustomeContainer>
      <Breadcrumb title="private Review" breadcrumbItem="Publice Review" />
    </CustomeContainer>
  );
}

export default PublicReview;

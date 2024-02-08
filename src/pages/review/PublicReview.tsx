import CustomeContainer from 'Components/Common/CustomeContainer';
import React from 'react';
import { Breadcrumb } from 'reactstrap';

interface Props {}

function PublicReview(props: Props) {
  const {} = props;

  return (
    <CustomeContainer>
      <h5 className='text-gray opacity-5 '>🌟 Exciting News: Something Amazing is Coming Soon! 🌟 .</h5>
      <Breadcrumb title="private Review" breadcrumbItem="Publice Review" />
    </CustomeContainer>
  );
}

export default PublicReview;

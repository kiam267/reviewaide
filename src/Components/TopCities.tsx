import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Progress,
  Table,
  Col,
  Row,
} from 'reactstrap';

const TopCities = ({ name, method, total, data }) => {
  const p1 = (40 / 100) * 100;
  const p2 = (25 / 100) * 100;
  return (
    <React.Fragment>
      <Col lg={6}>
        <Card>
          <CardBody>
            <CardTitle className="mb-4">{name}</CardTitle>
            <div className="text-center">
              <div className="mb-4">
                <i
                  className="bx bxs-send text-primary display-4"
                  style={{ transform: 'rotate(-20deg)' }}
                />
              </div>
              <h3>{total}</h3>
              <p>{method}</p>
            </div>

            <div className="table-responsive mt-4">
              <Table className="align-middle table-nowrap">
                <tbody>
                  {data.map((method, inx) => (
                    <tr key={inx}>
                      <td style={{ width: '30%' }}>
                        <p className="mb-0">{method.name}</p>
                      </td>
                      <td style={{ width: '25%' }}>
                        <h5 className="mb-0">{method.total}</h5>
                      </td>
                      <td>
                        <Progress
                          value={method.percentage}
                          color={method.color}
                          className="bg-gray progress-sm"
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TopCities;

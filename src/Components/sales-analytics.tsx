import React from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import getChartColorsArray from '../Components/Common/ChartDynamicColor';

interface ChartOptions {
  labels: string[];
  colors: string[];
  legend: {
    show: boolean;
  };
  plotOptions: {
    pie: {
      donut: {
        size: string;
      };
    };
  };
}

const SalesAnalytics = ({ name, data }: any) => {
  interface DataItem {
    total: number;
    name: string;
    color: string;
    // Add other properties as needed
  }

  const labels: string[] = [];
  const series: number[] = [];
  const colors: string[] = [];
  console.log(data);

  data.map((label: DataItem) => labels.push(label?.name));
  data.map((label: DataItem) => series.push(label?.total));
  data.map((label: DataItem) => colors.push(label?.color));

  const options: ChartOptions = {
    labels: labels,
    colors: colors,
    legend: { show: !1 },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
        },
      },
    },
  };

  return (
    <React.Fragment>
      <Col xl={6}>
        <Card>
          <CardBody>
            <CardTitle tag="h4" className="mb-4">
              {name}
            </CardTitle>
            <div>
              <div id="donut-chart">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="donut"
                  height={260}
                  className="apex-charts"
                />
              </div>
            </div>

            <div className="text-center text-muted">
              <Row>
                {data?.map((chartData, inx) => (
                  <Col key={inx}>
                    <div className="mt-4">
                      <p className="mb-2 text-truncate">
                        <i
                          className="mdi mdi-circle me-1"
                          style={{ color: chartData.color }}
                        />
                        {chartData.name}
                      </p>
                      <h5> {chartData.total}</h5>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default SalesAnalytics;

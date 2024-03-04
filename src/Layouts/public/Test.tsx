import React, { useEffect, useState } from 'react';
import Papa, { ParseResult } from 'papaparse';


const CsvToJsonConverter: React.FC = () => {
  const [jsonData, setJsonData] = useState<ParseResult<any>['data']>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api-generator.retool.com/C1sJ6m/data'
        );
        const csvData = await response.text();

        Papa.parse(csvData, {
          header: true,
          complete: function (result) {
            setJsonData(result.data);
          },
          error: function (error) {
            console.error('CSV parsing error:', error.message);
          },
        });
      } catch (error) {
        console.error('Error fetching CSV:');
      }
    };

    fetchData();
  }, []); // Run once on component mount

  console.log(JSON.stringify(jsonData));
  
  return (
    <div>
      <h1>CSV to JSON Converter</h1>
      <pre>{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  );
};

export default CsvToJsonConverter;

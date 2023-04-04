import React, { useState } from 'react';
import Papa from 'papaparse';
function App() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        setData(result.data);
      },
    });
  };

  const calculateDaysWorked = (dateFrom, dateTo) => {
    const from = new Date(dateFrom);
    const to = dateTo ? new Date(dateTo) : new Date();
    const diff = Math.abs(to.getTime() - from.getTime());
    console.log('sad: ', Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const findLongestProject = () => {
    let longestProject = {
      empID1: null,
      empID2: null,
      daysWorked: -1,
      projectID: null,
    };
    const projects = {};

    data.forEach((record) => {
      const { EmpID, ProjectID, DateFrom, DateTo } = record;
      if (!projects[ProjectID]) {
        projects[ProjectID] = [];
      }
      projects[ProjectID].push({ EmpID, ProjectID, DateFrom, DateTo });
    });

    Object.values(projects).forEach((project) => {
      for (let i = 0; i < project.length; i++) {
        for (let j = i + 1; j < project.length; j++) {
          const days = calculateDaysWorked(
            project[i].DateFrom,
            project[j].DateTo
          );
          if (days > longestProject.daysWorked) {
            longestProject = {
              empID1: project[i].EmpID,
              empID2: project[j].EmpID,
              daysWorked: days,
              projectID: project[i].ProjectID,
            };
          }
        }
      }
    });
    return longestProject;
  };

  const longestProject = findLongestProject();

  return (
    <main>
      <div className="card">
        <input id="file_input" type="file" onChange={handleFileUpload} />
        <div className="card-body">
          <table>
            <thead>
              <tr>
                <th>
                  <p>Employer ID #1</p>
                </th>
                <th>
                  <p>Employer ID #2</p>
                </th>
                <th>
                  <p>Project ID</p>
                </th>
                <th>
                  <p>Days worked</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{longestProject.empID1}</td>
                <td>{longestProject.empID2}</td>
                <td>{longestProject.projectID}</td>
                <td>{longestProject.daysWorked}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default App;

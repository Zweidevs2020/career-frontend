// import React, { useState, useEffect } from "react";
// import Table from "./table";
// import { StudentInformation } from "./studentInformation";
// import axios from "axios";
// import { message } from "antd";
// import { API_URL } from "../../utils/constants";
// import { useParams } from "react-router-dom";
// import {
//   CircularProgressbarWithChildren,
//   buildStyles,
// } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";

// const CounselorCao = () => {
//   const { id } = useParams();
//   const [columns, setColumns] = useState([
//     { key: "subject", label: "Subject" },
//     { key: "level", label: "Level" },
//     { key: "grade", label: "Grade" },
//     { key: "point", label: "Points" },
//     { key: "total_points", label: "Total Points" },
//     // { key: "total_points", label: "Total Points" },
//   ]);
//   const finalData = {
//     total_points: 750, // Example score
//   };

//   const value = 0.66;
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const getCookie = (name) => {
//     const cookies = document.cookie.split("; ");
//     for (const cookie of cookies) {
//       const [key, value] = cookie.split("=");
//       if (key === name) {
//         return value;
//       }
//     }
//     return null;
//   };
//   useEffect(() => {
//     if (id) fetchStudentData();
//   }, [id]);
//   const fetchStudentData = async () => {
//     setLoading(true);
//     const token = getCookie("conselorToken");

//     if (!token) {
//       message.error("Unauthorized access. Please log in.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/cao-points/`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200) {
//         setData(response.data);
//       } else {
//         message.error("Failed to fetch student CAO points.");
//       }
//     } catch (error) {
//       console.error("Error Fetching Student CAO Points:", error);
//       message.error("An error occurred while fetching the data.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchStudentData();
//   }, []);
//   const totalSum = data.reduce(
//     (acc, item) => acc + item.total_points + item.bonus_points,
//     0
//   );

//   console.log("Total Sum:", totalSum); // Output: 125

//   return (
//     <div className="p-6">
//       <StudentInformation />
//       <h1 className="text-2xl font-bold mb-4">CAO Points</h1>
//       <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//         <div className="w-full md:w-2/3">
//           <Table columns={columns} data={data} loading={loading} />
//         </div>
//         <h1 className="text-2xl font-bold mb-4 text-left w-full">
//           Total Points
//         </h1>

//         <div className="w-full md:w-1/3 flex justify-center relative bg-gray-100 rounded-lg shadow-md p-4">
//           {/* <div className="bg-gray-100 rounded-lg shadow-md p-4 absolute inset-0 md:hidden"></div> */}
//           <div className="relative w-36 h-36">
//             <CircularProgressbarWithChildren
//               value={totalSum}
//               minValue={0}
//               maxValue={1000}
//               styles={buildStyles({
//                 rotation: 0.72,
//                 strokeLinecap: "round",
//                 textSize: "19px",
//                 pathTransitionDuration: 0.5,
//                 pathColor: "#1476B7",
//                 textColor: "#263238",
//                 trailColor: "#d6d6d6",
//               })}
//             >
//               <div className="text-lg font-bold">{totalSum}</div>
//               <div className="text-sm">
//                 <strong>Total Points</strong>
//               </div>
//             </CircularProgressbarWithChildren>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CounselorCao;

import React, { useState, useEffect } from "react";
import Table from "./table";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CounselorCao = () => {
  const { id } = useParams();
  const [columns, setColumns] = useState([
    { key: "subject", label: "Subject" },
    { key: "level", label: "Level" },
    { key: "grade", label: "Grade" },
    { key: "point", label: "Points" },
    { key: "total_points", label: "Total Points" },
    // { key: "total_points", label: "Total Points" },
  ]);
  const finalData = {
    total_points: 750, // Example score
  };

  const value = 0.66;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return value;
      }
    }
    return null;
  };

  useEffect(() => {
    if (id) fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    setLoading(true);
    const token = getCookie("conselorToken");

    if (!token) {
      message.error("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/cao-points/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setData(response.data);
      } else {
        message.error("Failed to fetch student CAO points.");
      }
    } catch (error) {
      console.error("Error Fetching Student CAO Points:", error);
      message.error("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const totalSum = data.reduce(
    (acc, item) => acc + item.total_points + item.bonus_points,
    0
  );

  console.log("Total Sum:", totalSum); // Output: 125

  return (
    <div className="p-6">
      <StudentInformation />
      <h1 className="text-2xl font-bold mb-4">CAO Points</h1>
      <div className="  gap-6">
        {/* Table Container */}
        <div className="w-full ">
          <Table columns={columns} data={data} loading={loading} />
        </div>
        {/* Total Points Container */}
        <div className="w-full ">
          <h1 className="text-2xl font-bold mb-4 text-left md:text-center">
            Total Points
          </h1>
          <div className="flex justify-center relative bg-gray-100 rounded-lg shadow-md p-4">
            <div className="relative w-36 h-36">
              <CircularProgressbarWithChildren
                value={totalSum}
                minValue={0}
                maxValue={1000}
                styles={buildStyles({
                  rotation: 0.72,
                  strokeLinecap: "round",
                  textSize: "19px",
                  pathTransitionDuration: 0.5,
                  pathColor: "#1476B7",
                  textColor: "#263238",
                  trailColor: "#d6d6d6",
                })}
              >
                <div className="text-lg font-bold">{totalSum}</div>
                <div className="text-sm">
                  <strong>Total Points</strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorCao;

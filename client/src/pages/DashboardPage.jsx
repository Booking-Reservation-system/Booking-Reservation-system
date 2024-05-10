import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../src/theme";
import { useState, useEffect } from "react";
// import { mockTransactions } from "../../src/data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AddHomeIcon from '@mui/icons-material/AddHome';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import Header from "../../src/components/Heading"
import LineChart from "../../src/components/dashboards/LineChart"
import BarChart from "../../src/components/dashboards/BarChart";
import StatBox from "../../src/components/dashboards/StatBox";
import ProgressCircle from "../../src/components/dashboards/ProgressCircle";
import useAuth from "../../src/hooks/useAuth";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalCustomer, setTotalCustomer] = useState("");
  const [totalReservation, setTotalReservation] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const { authToken } = useAuth()
  
  useEffect(() => {
    // Fetch data from backend API
    fetch("http://localhost:8080/api/dashboard/total-data", {
      headers: {
        Authorization: "Bearer " + authToken,
      },
      withCredentials: true
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalCustomer(data.totalCustomer);
        setTotalReservation(data.totalReservation);
        setTotalPayment(data.totalPayment);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  
  return (
    <div className="pt-[200px] px-80">
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="50px"
        mt="40px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalCustomer}
            subtitle="Total Customer"
            progress="0.75"
            increase="+14%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalReservation}
            subtitle="Total Reservation"
            progress="0.50"
            increase="+21%"
            icon={
              <AddHomeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalPayment}
            subtitle="Total Booking Amount"
            progress="0.30"
            increase="+5%"
            icon={
              <LocalAtmIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                House in Each Category
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Line Chart View
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* */}

        {/* <Box
          gridColumn="span 5"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
    </div>
  );
};

export default Dashboard;
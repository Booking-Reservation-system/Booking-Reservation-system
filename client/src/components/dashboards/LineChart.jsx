import axios from "axios";
import {ResponsiveLine} from "@nivo/line";
import {useTheme} from "@mui/material";
import {tokens} from "../../theme";
import {useEffect, useState} from "react";
import useCountries from "../../hooks/useCountries";
import {mockLineData as data} from "../../data/mockData";
import useAuth from "../../hooks/useAuth";

const LineChart = ({isCustomLineColors = false, isDashboard = false}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [LineChartData, setLineChartData] = useState([]);
    const {authToken} = useAuth()
    const {getByValue} = useCountries(); // call useCountries
  
    useEffect(() => {
        axios.get("http://localhost:8080/api/admin/dashboard/line-chart", {
            headers: {
                Authorization: "Bearer " + authToken,
            },
            withCredentials: true
        })
            .then((response) => {
                // Map over the data array and replace each "x" value with the corresponding country name
                const updatedData = response.data.map(item => ({
                    ...item,
                    data: item.data.map(point => ({
                        ...point,
                        x: getByValue(point.x)?.label || point.x, // replace "x" with country name
                    })),
                }));

                setLineChartData(updatedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <ResponsiveLine
            data={LineChartData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.grey[100],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.grey[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                },
                legends: {
                    text: {
                        fill: colors.grey[100],
                    },
                },
                tooltip: {
                    container: {
                        color: colors.primary[500],
                    },
                },
            }}
            enableArea={true} // added
            enableSlices="x" // added
            enableCrosshair={true} // added
            colors={isDashboard ? {datum: "color"} : {scheme: "nivo"}} // added
            margin={{top: 50, right: 110, bottom: 50, left: 60}}
            xScale={{type: "point"}}
            yScale={{
                type: "linear",
                min: 0,
                max: "auto",
                stacked: true,
                reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: "bottom",
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "transportation", // added
                legendOffset: 36,
                legendPosition: "middle",
            }}
            axisLeft={{
                orient: "left",
                tickValues: 5, // added
                tickSize: 3,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "count", // added
                legendOffset: -40,
                legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={8}
            pointColor={{theme: "background"}}
            pointBorderWidth={2}
            pointBorderColor={{from: "serieColor"}}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemBackground: "rgba(0, 0, 0, .03)",
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

export default LineChart;
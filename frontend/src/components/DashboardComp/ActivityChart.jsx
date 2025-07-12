import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const ActivityChart = ({ data, analyticsData }) => {
  const hasData = data && data.length > 0;
  const hasAnalytics =
    analyticsData &&
    (analyticsData.reportTypeDistribution?.length > 0 ||
      analyticsData.statusDistribution?.length > 0);

  // Custom colors for status chart
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "#10B981";
      case "PENDING":
        return "#F59E0B";
      case "REJECTED":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  // Custom tooltip component for status distribution
  const CustomStatusTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{`Status: ${label}`}</p>
          <p className="text-blue-600">{`Total: ${data.count}`}</p>
          {data.reportTypes && Object.keys(data.reportTypes).length > 0 && (
            <div className="mt-2 border-t pt-2">
              <p className="text-sm font-medium text-gray-600 mb-1">
                By Report Type:
              </p>
              {Object.entries(data.reportTypes).map(([reportType, count]) => (
                <p key={reportType} className="text-sm text-gray-700">
                  {reportType}: {count}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Monthly Activity Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Monthly Report Activity
        </h2>
        {hasData ? (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis tick={{ fontSize: 12 }} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "14px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Reports Submitted"
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500 italic">
            No activity data available
          </div>
        )}
      </div>

      {/* Report Status Distribution */}
      {hasAnalytics && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Report Status Distribution
          </h2>
          {analyticsData.statusDistribution &&
          analyticsData.statusDistribution.length > 0 ? (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.statusDistribution}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip content={<CustomStatusTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Reports"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                  >
                    {analyticsData.statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStatusColor(entry.status)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 italic">
              No status data available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityChart;

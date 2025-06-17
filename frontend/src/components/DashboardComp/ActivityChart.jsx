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
} from "recharts";

const ActivityChart = ({ data }) => (
  <div className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
      Weekly System Activity
    </h2>
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
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
          <Line
            type="monotone"
            dataKey="users"
            stroke="#10B981"
            strokeWidth={2}
            name="Active Users"
            dot={{ strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ActivityChart;

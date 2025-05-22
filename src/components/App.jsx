import React, { useState, useEffect, useMemo } from "react";
import {
  FiCpu,
  FiHardDrive,
  FiWifi,
  FiList,
  FiActivity,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { Line } from "react-chartjs-2";
import { useFetchReports } from "../hook/useFetchReports";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const { data, loading, error } = useFetchReports();
  const [activeTab, setActiveTab] = useState("processes");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [processes, setProcesses] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    cpu: [],
    memory: [],
    disk: [],
    network: [],
  });

  // Mock data generation
  useEffect(() => {
    const generateProcesses = () => {
      const mockProcesses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Process${i + 1}`,
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 1000),
        pid: Math.floor(Math.random() * 10000),
        status: Math.random() > 0.8 ? "Critical" : "Running",
      }));
      setProcesses(mockProcesses);
    };

    const updatePerformanceData = () => {
      setPerformanceData((prev) => ({
        cpu: [...prev.cpu.slice(-10), Math.floor(Math.random() * 100)],
        memory: [...prev.memory.slice(-10), Math.floor(Math.random() * 100)],
        disk: [...prev.disk.slice(-10), Math.floor(Math.random() * 100)],
        network: [...prev.network.slice(-10), Math.floor(Math.random() * 100)],
      }));
    };

    generateProcesses();
    const interval = setInterval(updatePerformanceData, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredProcesses = useMemo(
    () =>
      processes.filter((process) =>
        process.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [processes, searchTerm]
  );

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const getChartData = (data, label) => ({
    labels: Array.from({ length: data.length }, (_, i) => i + 1),
    datasets: [
      {
        label,
        data,
        borderColor: "#3B82F6",
        tension: 0.4,
      },
    ],
  });

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`w-64 h-screen fixed ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="p-4">
            <h2
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              System Monitor
            </h2>
            <div className="mt-8 space-y-2">
              <button
                onClick={() => setActiveTab("processes")}
                className={`w-full p-3 text-left rounded-lg flex items-center ${
                  activeTab === "processes"
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiList className="mr-2" /> Processes
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`w-full p-3 text-left rounded-lg flex items-center ${
                  activeTab === "performance"
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiActivity className="mr-2" /> Performance
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {activeTab === "processes" ? "Processes" : "Performance"}
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Toggle Theme
            </button>
          </div>

          {activeTab === "processes" ? (
            <div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search processes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute right-3 top-3 text-gray-400" />
              </div>

              <div
                className={`rounded-lg overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <table className="w-full">
                  <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      <th className="p-4 text-left">Process Name</th>
                      <th className="p-4 text-left">CPU Usage</th>
                      <th className="p-4 text-left">Memory</th>
                      <th className="p-4 text-left">PID</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProcesses.map((process) => (
                      <tr
                        key={process.id}
                        className={`border-t ${
                          darkMode
                            ? "border-gray-700 hover:bg-gray-700"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {process.name}
                        </td>
                        <td
                          className={`p-4 ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {process.cpu}%
                        </td>
                        <td
                          className={`p-4 ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {process.memory} MB
                        </td>
                        <td
                          className={`p-4 ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {process.pid}
                        </td>
                        <td className={`p-4`}>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              process.status === "Critical"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {process.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            className="p-2 hover:bg-red-100 rounded-full text-red-500"
                            aria-label="End Process"
                          >
                            <FiX />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    CPU Usage
                  </h3>
                  <FiCpu
                    className={darkMode ? "text-white" : "text-gray-600"}
                  />
                </div>
                <Line
                  data={getChartData(performanceData.cpu, "CPU")}
                  options={chartOptions}
                />
              </div>

              <div
                className={`p-6 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Memory Usage
                  </h3>
                  <FiHardDrive
                    className={darkMode ? "text-white" : "text-gray-600"}
                  />
                </div>
                <Line
                  data={getChartData(performanceData.memory, "Memory")}
                  options={chartOptions}
                />
              </div>

              <div
                className={`p-6 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Disk Activity
                  </h3>
                  <FiHardDrive
                    className={darkMode ? "text-white" : "text-gray-600"}
                  />
                </div>
                <Line
                  data={getChartData(performanceData.disk, "Disk")}
                  options={chartOptions}
                />
              </div>

              <div
                className={`p-6 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Network Activity
                  </h3>
                  <FiWifi
                    className={darkMode ? "text-white" : "text-gray-600"}
                  />
                </div>
                <Line
                  data={getChartData(performanceData.network, "Network")}
                  options={chartOptions}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

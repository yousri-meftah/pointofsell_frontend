import React, { useEffect, useState } from "react";
import { Doughnut, Pie, Line, Bar } from "react-chartjs-2";
import api from "../services/api";
import "chart.js/auto";

function Dashboard() {
  const [revenuePerCategory, setRevenuePerCategory] = useState(null);
  const [inventoryLevels, setInventoryLevels] = useState(null);
  const [salesPerMonth, setSalesPerMonth] = useState(null);
  const [topSellingProducts, setTopSellingProducts] = useState(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState(null);
  useEffect(() => {
    const fetchRevenuePerCategory = async () => {
      try {
        const response = await api.get("/dashboard/revenue-per-category", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRevenuePerCategory(response.data);
      } catch (error) {
        console.error("Error fetching revenue per category:", error);
      }
    };

    // Fetch Inventory Levels
    const fetchInventoryLevels = async () => {
      try {
        const response = await api.get("/dashboard/inventory-levels", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setInventoryLevels(response.data);
      } catch (error) {
        console.error("Error fetching inventory levels:", error);
      }
    };

    // Fetch Sales Per Month
    const fetchSalesPerMonth = async () => {
      try {
        const response = await api.get("/dashboard/sales-per-month", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSalesPerMonth(response.data);
      } catch (error) {
        console.error("Error fetching sales per month:", error);
      }
    };

    // Fetch Top-Selling Products
    const fetchTopSellingProducts = async () => {
      try {
        const response = await api.get("/dashboard/top-selling-products/2024/12", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTopSellingProducts(response.data);
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
      }
    };

    // Fetch Monthly Earnings by Employee
    const fetchMonthlyEarnings = async () => {
      try {
        const response = await api.get("/dashboard/monthly-earnings", {
          params: {
            year: 2024, // Example year, make it dynamic if needed
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMonthlyEarnings(response.data);
      } catch (error) {
        console.error("Error fetching monthly earnings:", error);
      }
    };

    fetchRevenuePerCategory();
    fetchInventoryLevels();
    fetchSalesPerMonth();
    fetchTopSellingProducts();
    fetchMonthlyEarnings();
  }, []);

  // Chart Data Preparation

  // Revenue Per Category Doughnut Chart
  const doughnutData = revenuePerCategory
    ? {
        labels: revenuePerCategory.categories.map((item) => item.category),
        datasets: [
          {
            data: revenuePerCategory.categories.map((item) => item.revenue),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          },
        ],
      }
    : null;

  // Inventory Levels Pie Chart
  const pieData = inventoryLevels
    ? {
        labels: inventoryLevels.products.map((item) => item.product),
        datasets: [
          {
            data: inventoryLevels.products.map((item) => item.inventory),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          },
        ],
      }
    : null;

  // Sales Per Month Line Chart
  const salesLineData = salesPerMonth
    ? {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Sales",
            data: salesPerMonth.sales_per_month.map((item) => item.sales),
            fill: false,
            borderColor: "#36A2EB",
            tension: 0.1,
          },
        ],
      }
    : null;

  // Top-Selling Products Bar Chart
  const barChartData = topSellingProducts
    ? {
        labels: topSellingProducts.top_selling_products.map((item) => item.product),
        datasets: [
          {
            label: "Quantity Sold",
            data: topSellingProducts.top_selling_products.map(
              (item) => item.quantity_sold
            ),
            backgroundColor: "#FFCE56",
            borderColor: "#FF6384",
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Monthly Earnings Line Chart
  const lineChartData = monthlyEarnings
    ? {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: Object.entries(monthlyEarnings.earnings_by_employee).map(
          ([employee, earnings]) => ({
            label: employee,
            data: earnings,
            fill: false,
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            tension: 0.1,
          })
        ),
      }
    : null;

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Revenue Per Category */}
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Revenue Per Category</h2>
            {doughnutData ? <Doughnut data={doughnutData} /> : <p>Loading...</p>}
          </div>
    
          {/* Inventory Levels */}
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Inventory Levels</h2>
            {pieData ? <Pie data={pieData} /> : <p>Loading...</p>}
          </div>
    
          {/* Sales Per Month */}
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Sales Per Month</h2>
            {salesLineData ? <Line data={salesLineData} /> : <p>Loading...</p>}
          </div>
    
          {/* Top-Selling Products */}
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Top-Selling Products</h2>
            {barChartData ? <Bar data={barChartData} /> : <p>Loading...</p>}
          </div>
    
          {/* Monthly Earnings */}
          <div className="bg-white shadow-md rounded-md p-4 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Monthly Earnings by Employee</h2>
            {lineChartData ? <Line data={lineChartData} /> : <p>Loading...</p>}
          </div>
        </div>
      </div>
    );
    
}

export default Dashboard;

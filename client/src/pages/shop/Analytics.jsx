import React, { useState } from 'react';
import { useEffect } from 'react';

import Navbar from '../../components/Navbar';
import {  
  TrendingUp, 
  DollarSign, 
  Users,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  ShoppingCart,
  X
} from 'lucide-react';

const SalesAnalytics = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for analytics data
  const [metricsSummary, setMetricsSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    dateRange: selectedPeriod,
    includeMetrics: true,
    includeSalesChart: true,
    includeTopProducts: true,
  });

  const handleExport = () => {
    try {
      const exportData = {
        period: selectedPeriod,
        exportDate: new Date().toLocaleString(),
        metrics: exportOptions.includeMetrics ? {
          totalRevenue: totalRevenue,
          totalOrders: totalOrders,
          totalCustomers: totalCustomers,
          revenueChange: metricsSummary?.revenueChange || '0.0%',
          ordersChange: metricsSummary?.ordersChange || '0.0%',
          customersChange: metricsSummary?.customersChange || '0.0%',
        } : null,
        salesData: exportOptions.includeSalesChart ? salesData : null,
        topProducts: exportOptions.includeTopProducts ? topProducts : null,
      };

      if (exportOptions.format === 'csv') {
        exportToCSV(exportData);
      } else if (exportOptions.format === 'json') {
        exportToJSON(exportData);
      } else if (exportOptions.format === 'pdf') {
        exportToPDF(exportData);
      }

      setShowExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const exportToCSV = (data) => {
    let csvContent = "Analytics Report\n";
    csvContent += `Generated: ${data.exportDate}\n`;
    csvContent += `Period: ${selectedPeriod}\n\n`;

    if (data.metrics) {
      csvContent += "METRICS SUMMARY\n";
      csvContent += "Metric,Value,Change\n";
      csvContent += `Total Revenue,Rs. ${data.metrics.totalRevenue.toLocaleString()},${data.metrics.revenueChange}\n`;
      csvContent += `Total Orders,${data.metrics.totalOrders},${data.metrics.ordersChange}\n`;
      csvContent += `Total Customers,${data.metrics.totalCustomers},${data.metrics.customersChange}\n\n`;
    }

    if (data.salesData && data.salesData.length > 0) {
      csvContent += "SALES DATA\n";
      csvContent += "Month,Revenue,Orders,Customers\n";
      data.salesData.forEach(item => {
        csvContent += `${item.month},${item.revenue},${item.orders},${item.customers}\n`;
      });
      csvContent += "\n";
    }

    if (data.topProducts && data.topProducts.length > 0) {
      csvContent += "TOP PRODUCTS\n";
      csvContent += "Rank,Product Name,Category,Sales,Revenue\n";
      data.topProducts.slice(0, 5).forEach((product, index) => {
        csvContent += `${index + 1},${product.name},${product.category},${product.sales},Rs. ${product.revenue.toLocaleString()}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_report_${new Date().getTime()}.csv`;
    link.click();
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_report_${new Date().getTime()}.json`;
    link.click();
  };

  const exportToPDF = (data) => {
    // Create PDF content as HTML
    const pdfWindow = window.open('', '_blank');
    
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Analytics Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            background: white;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #D87C5A;
          }
          .header h1 { 
            color: #5D3A00; 
            font-size: 32px;
            margin-bottom: 10px;
          }
          .header p { 
            color: #666; 
            font-size: 14px;
          }
          .section { 
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          .section-title { 
            color: #5D3A00; 
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            padding-left: 10px;
            border-left: 4px solid #D87C5A;
          }
          .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 20px;
            margin-bottom: 20px;
          }
          .metric-card { 
            background: linear-gradient(135deg, #FFF5E1 0%, #FFE4D6 100%);
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #FFE4D6;
          }
          .metric-label { 
            color: #5D3A00; 
            font-size: 12px;
            margin-bottom: 8px;
            opacity: 0.7;
          }
          .metric-value { 
            color: #D87C5A; 
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .metric-change { 
            color: #388e3c; 
            font-size: 12px;
            font-weight: bold;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin-top: 10px;
          }
          th { 
            background: #5D3A00; 
            color: white; 
            padding: 12px;
            text-align: left;
            font-size: 14px;
          }
          td { 
            padding: 12px;
            border-bottom: 1px solid #FFE4D6;
            font-size: 13px;
          }
          tr:nth-child(even) { 
            background: #FFF5E1;
          }
          tr:hover { 
            background: #FFE4D6;
          }
          .rank-badge {
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            background: linear-gradient(135deg, #D87C5A, #5D3A00);
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #FFE4D6;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Analytics Report</h1>
          <p>Generated on ${data.exportDate} | Period: ${selectedPeriod}</p>
        </div>
    `;

    if (data.metrics) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">📈 Performance Metrics</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Total Revenue</div>
              <div class="metric-value">Rs. ${data.metrics.totalRevenue.toLocaleString()}</div>
              <div class="metric-change">${data.metrics.revenueChange}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total Orders</div>
              <div class="metric-value">${data.metrics.totalOrders}</div>
              <div class="metric-change">${data.metrics.ordersChange}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total Customers</div>
              <div class="metric-value">${data.metrics.totalCustomers}</div>
              <div class="metric-change">${data.metrics.customersChange}</div>
            </div>
          </div>
        </div>
      `;
    }

    if (data.salesData && data.salesData.length > 0) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">📊 Sales Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Customers</th>
              </tr>
            </thead>
            <tbody>
      `;
      data.salesData.forEach(item => {
        htmlContent += `
          <tr>
            <td><strong>${item.month}</strong></td>
            <td>Rs. ${Number(item.revenue || 0).toLocaleString()}</td>
            <td>${item.orders}</td>
            <td>${item.customers}</td>
          </tr>
        `;
      });
      htmlContent += `
            </tbody>
          </table>
        </div>
      `;
    }

    if (data.topProducts && data.topProducts.length > 0) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">⭐ Top Performing Products</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
      `;
      data.topProducts.slice(0, 5).forEach((product, index) => {
        htmlContent += `
          <tr>
            <td><span class="rank-badge">${index + 1}</span></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>${product.sales}</td>
            <td>Rs. ${product.revenue.toLocaleString()}</td>
          </tr>
        `;
      });
      htmlContent += `
            </tbody>
          </table>
        </div>
      `;
    }

    htmlContent += `
        <div class="footer">
          <p>© ${new Date().getFullYear()} ArtAura - Analytics Report</p>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    pdfWindow.document.write(htmlContent);
    pdfWindow.document.close();
  };

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const shopId = localStorage.getItem("shopId");

        if (!shopId) {
          throw new Error("Shop ID not found. Please log in again.");
        }

        const response = await fetch(
          `${API_URL}/api/shop/analytics?shopId=${shopId}&period=${selectedPeriod}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();
        
        // Update state with backend data
        setMetricsSummary(data.metricsSummary);
        setSalesData(data.salesData || []);
        setTopProducts(data.topProducts || []);

        setLoading(false);

      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsChartVisible(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Calculate totals from backend data with proper number conversion
  const totalRevenue = Number(metricsSummary?.totalRevenue || 0);
  const totalOrders = Number(metricsSummary?.totalOrders || 0);
  const totalCustomers = Number(metricsSummary?.totalCustomers || 0);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-4 px-1 sm:px-2 lg:px-4 max-w-full mx-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D87C5A] mx-auto mb-4"></div>
              <p className="text-[#5D3A00] font-semibold">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-4 px-1 sm:px-2 lg:px-4 max-w-full mx-0">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-[#5D3A00] font-semibold text-lg mb-2">Failed to load analytics</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Analytics Container - Aligned with navbar */}
      <div className="pt-4 px-1 sm:px-2 lg:px-4 max-w-full mx-0">
        
        {/* Header Section with Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Period Selector */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-white border border-[#FFE4D6] rounded-lg px-4 py-2 pr-8 focus:ring-0 outline-none hover:border-[#D87C5A] focus:border-[#D87C5A] shadow text-sm"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="12months">Last 12 months</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Calendar className="w-4 h-4 text-[#5D3A00]" />
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="w-full md:w-auto flex justify-end">
            <button 
              onClick={() => setShowExportModal(true)}
              className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Metric Cards Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { 
                icon: DollarSign, 
                title: 'Total Revenue', 
                value: `Rs. ${totalRevenue.toLocaleString()}`, 
                change: metricsSummary?.revenueChange || '0.0%', 
                trend: metricsSummary?.revenueChange?.startsWith('+') ? 'up' : 'down',
                iconBg: 'bg-[#D87C5A]',
                textColor: 'text-[#D87C5A]'
              },
              { 
                icon: ShoppingCart, 
                title: 'Total Orders', 
                value: totalOrders.toString(), 
                change: metricsSummary?.ordersChange || '0.0%', 
                trend: metricsSummary?.ordersChange?.startsWith('+') ? 'up' : 'down',
                iconBg: 'bg-[#FFD95A]',
                textColor: 'text-[#bfa100]'
              },
              { 
                icon: Users, 
                title: 'Customers', 
                value: totalCustomers.toString(), 
                change: metricsSummary?.customersChange || '0.0%', 
                trend: metricsSummary?.customersChange?.startsWith('+') ? 'up' : 'down',
                iconBg: 'bg-[#66bb6a]',
                textColor: 'text-[#2e7d32]'
              }
            ].map((metric, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#f3f3f3] bg-white shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.iconBg} shadow-lg transform transition-transform duration-500 hover:rotate-3`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${
                    metric.trend === 'up' ? 'text-[#388e3c] bg-[#e8f5e9]' : 'text-red-700 bg-red-100'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#5D3A00] mb-1">{metric.title}</h3>
                  <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
          
          {/* Sales Chart */}
          <div className="bg-white rounded-2xl shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] p-6 lg:p-8 border border-[#FFE4D6] animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#D87C5A]" />
                Sales Overview
              </h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-white border border-[#FFE4D6] rounded-lg px-3 py-2 text-sm focus:ring-0 outline-none focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="customers">Customers</option>
              </select>
            </div>
            <div className="h-96 flex items-end justify-between space-x-2 p-4 bg-[#FFF5E1] rounded-xl">
              {salesData && salesData.length > 0 ? (
                salesData.map((data, index) => {
                  const value = selectedMetric === 'revenue' ? Number(data.revenue || 0) : 
                               selectedMetric === 'orders' ? Number(data.orders || 0) : Number(data.customers || 0);
                  const maxValue = Math.max(...salesData.map(d => 
                    selectedMetric === 'revenue' ? Number(d.revenue || 0) : 
                    selectedMetric === 'orders' ? Number(d.orders || 0) : Number(d.customers || 0)
                  ), 1); // Ensure at least 1 to avoid division by zero
                  const height = maxValue > 0 ? (value / maxValue) * 200 : 0;
                  const barColors = ['#D87C5A', '#FFD95A', '#66BB6A', '#A1887F', '#BA68C8', '#5D3A00'];
                  const barColor = barColors[index % barColors.length];
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group">
                      <div className="w-full relative">
                        <div 
                          className="w-full bg-[#D87C5A] rounded-t-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-[#c06949] relative"
                          style={{ 
                            height: isChartVisible ? `${height}px` : '0px',
                            backgroundColor: barColor,
                            transitionDelay: `${index * 120}ms` 
                          }}
                        >
                          <div
                            className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold whitespace-nowrap"
                            style={{
                              color: 'white',
                              backgroundColor: barColor,
                              border: `1px solid ${barColor}`,
                              boxShadow: `0 0 5px ${barColor}`,
                            }}
                          >
                            {selectedMetric === 'revenue' ? `Rs. ${value.toLocaleString()}` : value}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#5D3A00] mt-2 font-semibold">{data.month}</span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#5D3A00] opacity-50">
                  No sales data available
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] p-6 lg:p-8 border border-[#FFE4D6] animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#D87C5A] to-[#5D3A00] rounded-xl shadow-lg">
                  <Star className="w-6 h-6 text-white" fill="white" />
                </div>
                Top Performing Products
              </h2>
              <p className="text-sm text-[#5D3A00] opacity-60 mt-2 ml-14">Best sellers by quantity</p>
            </div>
            
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => {
                const gradients = [
                  'from-[#D87C5A] to-[#c06949]',
                  'from-[#FFD95A] to-[#e6c24d]',
                  'from-[#66BB6A] to-[#52a356]',
                  'from-[#BA68C8] to-[#a155b5]',
                  'from-[#5D3A00] to-[#3d2600]'
                ];
                const gradient = gradients[index];
                const medals = ['🥇', '🥈', '🥉'];
                const showMedal = index < 3;

                return (
                  <div 
                    key={product.id} 
                    className="group relative bg-gradient-to-r from-white to-[#FFF5E1] rounded-2xl p-5 border-2 border-[#FFE4D6] hover:border-[#D87C5A] transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Rank Badge */}
                    <div className="absolute -left-3 -top-3 z-10">
                      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform duration-300`}>
                        <span className="text-white text-xl font-black">{index + 1}</span>
                      </div>
                      {showMedal && (
                        <div className="absolute -top-1 -right-1 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
                          {medals[index]}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="ml-12">
                      <div className="flex-1">
                        <h4 className="font-bold text-[#5D3A00] text-xl leading-tight mb-3 group-hover:text-[#D87C5A] transition-colors">
                          {product.name}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Category Badge */}
                          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border-2 border-[#FFE4D6] shadow-sm group-hover:border-[#D87C5A] transition-all">
                            <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${gradient} shadow-sm`}></div>
                            <span className="text-sm font-semibold text-[#5D3A00]">{product.category}</span>
                          </div>
                          
                          {/* Sales Count - Prominent Display */}
                          <div className={`flex items-center gap-2.5 bg-gradient-to-br ${gradient} text-white rounded-xl px-4 py-2 shadow-lg group-hover:shadow-xl transition-all`}>
                            <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
                            <span className="text-lg font-black">{product.sales}</span>
                            <span className="text-sm font-medium opacity-90">units sold</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Bar */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                  </div>
                );
              })}
            </div>

            {/* Summary Footer */}
            {topProducts.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-[#FFE4D6]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5D3A00] opacity-60 font-medium">
                    Showing top {Math.min(5, topProducts.length)} products
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse"></div>
                    <span className="text-[#5D3A00] font-semibold">
                      Total: {topProducts.slice(0, 5).reduce((sum, p) => sum + p.sales, 0)} units sold
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r p-6 rounded-t-2xl border-b border-[#FFE4D6]">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
                    <Download className="w-6 h-6 text-[#D87C5A]" />
                    Export Orders
                  </h2>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Format */}
                <div>
                  <label className="block text-sm font-bold text-[#5D3A00] mb-3">Export Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'csv', label: 'CSV', icon: '📊', desc: 'Spreadsheet' },
                      { value: 'json', label: 'JSON', icon: '📄', desc: 'Data File' },
                      { value: 'pdf', label: 'PDF', icon: '📑', desc: 'Document' }
                    ].map((format) => (
                      <button
                        key={format.value}
                        onClick={() => setExportOptions({ ...exportOptions, format: format.value })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          exportOptions.format === format.value
                            ? 'border-[#D87C5A] bg-[#FFF5E1] shadow-md'
                            : 'border-[#FFE4D6] hover:border-[#D87C5A] hover:bg-[#FFF5E1]'
                        }`}
                      >
                        <div className="text-2xl mb-1">{format.icon}</div>
                        <div className="font-bold text-[#5D3A00] text-sm">{format.label}</div>
                        <div className="text-xs text-[#5D3A00] opacity-60">{format.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period Info */}
                <div className="bg-[#FFF5E1] rounded-xl p-4 border-2 border-[#FFE4D6]">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#D87C5A]" />
                    <span className="font-semibold text-[#5D3A00]">Current Period:</span>
                    <span className="text-[#D87C5A] font-bold">
                      {selectedPeriod === '7days' ? 'Last 7 days' :
                       selectedPeriod === '30days' ? 'Last 30 days' :
                       selectedPeriod === '90days' ? 'Last 90 days' : 'Last 12 months'}
                    </span>
                  </div>
                </div>

                {/* Include Checkboxes */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-[#5D3A00]">Include in Export</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#FFE4D6] hover:border-[#D87C5A] hover:bg-[#FFF5E1] transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeMetrics}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeMetrics: e.target.checked })}
                        className="w-5 h-5 rounded border-[#D87C5A] text-[#D87C5A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#5D3A00]">📈 Performance Metrics</div>
                        <div className="text-xs text-[#5D3A00] opacity-60">Revenue, Orders, Customers</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#FFE4D6] hover:border-[#D87C5A] hover:bg-[#FFF5E1] transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeSalesChart}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeSalesChart: e.target.checked })}
                        className="w-5 h-5 rounded border-[#D87C5A] text-[#D87C5A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#5D3A00]">📊 Sales Overview</div>
                        <div className="text-xs text-[#5D3A00] opacity-60">Monthly/Weekly breakdown</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#FFE4D6] hover:border-[#D87C5A] hover:bg-[#FFF5E1] transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeTopProducts}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeTopProducts: e.target.checked })}
                        className="w-5 h-5 rounded border-[#D87C5A] text-[#D87C5A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#5D3A00]">⭐ Top Products</div>
                        <div className="text-xs text-[#5D3A00] opacity-60">Best performing items</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 px-4 py-3 text-[#5D3A00] border-2 border-[#FFE4D6] focus:ring-0 outline-none rounded-xl hover:bg-[#FFF5E1] hover:border-[#D87C5A] transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SalesAnalytics;
import React, { useState } from "react";
import { CreditCard, Wallet, MoreVertical, Edit2, Trash } from "lucide-react"; // Icon for dropdown

// Mock data for orders
const mockOrders = [
  {
    orderId: "OD001",
    customerName: "John Doe",
    totalAmount: 250000,
    paymentMethod: "ZaloPay",
    orderDate: "2024-12-01",
    status: "Completed",
  },
  {
    orderId: "OD002",
    customerName: "Jane Smith",
    totalAmount: 450000,
    paymentMethod: "SolaceWallet",
    orderDate: "2024-12-03",
    status: "Pending",
  },
  {
    orderId: "OD003",
    customerName: "Alice Brown",
    totalAmount: 150000,
    paymentMethod: "ZaloPay",
    orderDate: "2024-12-05",
    status: "Cancelled",
  },
];

// Badge configuration for status and payment method
const badgeConfig = {
  status: {
    Completed: { label: "Completed", color: "bg-green-100", textColor: "text-green-700" },
    Pending: { label: "Pending", color: "bg-yellow-100", textColor: "text-yellow-700" },
    Cancelled: { label: "Cancelled", color: "bg-red-100", textColor: "text-red-700" },
  },
  paymentMethod: {
    ZaloPay: { label: "ZaloPay", color: "bg-blue-100", textColor: "text-blue-700" },
    SolaceWallet: { label: "SolaceWallet", color: "bg-purple-100", textColor: "text-purple-700" },
  },
};

const OrderPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Headers for the table
  const headers = [
    { label: "Order ID", key: "orderId", sortable: true },
    { label: "Customer Name", key: "customerName" },
    { label: "Total Amount (VND)", key: "totalAmount" },
    { label: "Payment Method", key: "paymentMethod" },
    { label: "Order Date", key: "orderDate" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", sortable: false },
  ];

  // Filter and map payment method to icons
  const renderPaymentMethodIcon = (method) => {
    switch (method) {
      case "ZaloPay":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case "SolaceWallet":
        return <Wallet className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  // Dropdown menu for actions
  const renderActionMenu = (order) => (
    <Menu
    items={[
      {
        label: (
          <div onClick={() => handleViewDetails(order)} className="flex items-center space-x-2">
            <Edit2 className="w-4 h-4 text-blue-500" />
            <span>Order Detail</span>
          </div>
        ),
        key: 'view',
      },
      {
        label: (
          <div onClick={() => handleUpdateStatus(order)} className="flex items-center space-x-2">
            <Trash className="w-4 h-4 text-red-500" />
            <span>Delete</span>
          </div>
        ),
        key: 'delete',
      },
    ]}
  />
  );

  // Handlers
  const handleViewDetails = (order) => {
    console.log("Viewing details for:", order.orderId);
  };

  const handleUpdateStatus = (order) => {
    console.log("Updating status for:", order.orderId);
  };

  // Enhance data for rendering badges and icons
  const enhancedData = mockOrders.map((order) => ({
    ...order,
    paymentMethod: (
      <div className="flex items-center space-x-2">
        {renderPaymentMethodIcon(order.paymentMethod)}
        <span>{order.paymentMethod}</span>
      </div>
    ),
    status: (
      <span
        className={`px-2 py-1 text-sm rounded-lg ${badgeConfig.status[order.status].color} ${badgeConfig.status[order.status].textColor}`}
      >
        {badgeConfig.status[order.status].label}
      </span>
    ),
    actions: (
      <Dropdown overlay={renderActionMenu(order)} trigger={["click"]}>
        <button className="text-gray-600 hover:text-gray-900">
          <MoreVertical className="w-5 h-5" />
        </button>
      </Dropdown>
    ),
  }));

  return (
    // <div className="p-6 bg-gray-50 min-h-screen">
    //   <h1 className="text-xl font-bold mb-4">Order Management</h1>

    //   <Table
    //     headers={headers}
    //     data={enhancedData}
    //     onSearch={(query) => setSearchQuery(query)}
    //     filters={[
    //       {
    //         key: "status",
    //         values: ["Completed", "Pending", "Cancelled"],
    //       },
    //     ]}
    //     badgeConfig={badgeConfig}
    //   />
    // </div>
    <h1>hello</h1>

  );
};

export default OrderPage;

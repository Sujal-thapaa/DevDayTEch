import React from 'react';
import { ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const MarketPage: React.FC = () => {
  const orders = [
    {
      id: 'ord-001',
      type: 'Buy',
      volume: 5000,
      price: 42.5,
      status: 'active',
      expires: '2025-11-15',
    },
    {
      id: 'ord-002',
      type: 'Sell',
      volume: 3000,
      price: 45.0,
      status: 'matched',
      expires: '2025-10-20',
    },
  ];

  const certificates = [
    {
      id: 'cert-001',
      volume: 25000,
      facility: 'Port Allen Ethanol',
      issued: '2025-09-30',
      status: 'active',
    },
    {
      id: 'cert-002',
      volume: 18500,
      facility: 'Geismar Ammonia',
      issued: '2025-09-30',
      status: 'active',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CO₂ Marketplace</h1>
          <p className="text-gray-600 mt-1">
            Trade carbon credits and manage certificates
          </p>
        </div>
        <Button variant="primary" size="md">
          <ShoppingCart size={18} className="mr-2" />
          Create Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <span className="text-sm font-medium text-gray-600 block mb-2">
            Market Price
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">$43.75</span>
            <span className="text-sm text-gray-600">/tCO₂</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp size={16} />
            <span className="text-sm font-medium">+2.4% today</span>
          </div>
        </Card>

        <Card className="p-6">
          <span className="text-sm font-medium text-gray-600 block mb-2">
            Available Credits
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-[#174B7A]">43,500</span>
            <span className="text-sm text-gray-600">tCO₂</span>
          </div>
          <span className="text-sm text-gray-600">Across all facilities</span>
        </Card>

        <Card className="p-6">
          <span className="text-sm font-medium text-gray-600 block mb-2">
            Total Trading Volume
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-[#1AAE9F]">127K</span>
            <span className="text-sm text-gray-600">tCO₂</span>
          </div>
          <span className="text-sm text-gray-600">Last 30 days</span>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Volume
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Expires
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{order.id}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={order.type === 'Buy' ? 'info' : 'success'}
                      size="sm"
                    >
                      {order.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {order.volume.toLocaleString()} tCO₂
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ${order.price}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        order.status === 'matched'
                          ? 'success'
                          : order.status === 'active'
                          ? 'info'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.expires}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Carbon Credit Certificates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-[#174B7A] transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.id}</h3>
                  <p className="text-sm text-gray-600">{cert.facility}</p>
                </div>
                <Badge variant="success" size="sm">
                  {cert.status}
                </Badge>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-[#174B7A]">
                  {cert.volume.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">tCO₂</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Issued: {cert.issued}
              </p>
              <Button variant="outline" size="sm">
                Download Certificate
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Transport & Logistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600 block mb-2">
              Pipeline Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">$8.20</span>
              <span className="text-sm text-gray-600">/tCO₂</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600 block mb-2">
              Truck Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">$12.40</span>
              <span className="text-sm text-gray-600">/tCO₂</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600 block mb-2">
              Rail Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">$10.50</span>
              <span className="text-sm text-gray-600">/tCO₂</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

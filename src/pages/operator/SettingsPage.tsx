import React, { useState } from 'react';
import { Users, Link2, Archive, Shield, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'integrations' | 'retention' | 'privacy' | 'audit'>('team');

  const tabs = [
    { id: 'team' as const, label: 'Team & Roles', icon: Users },
    { id: 'integrations' as const, label: 'Integrations', icon: Link2 },
    { id: 'retention' as const, label: 'Data Retention', icon: Archive },
    { id: 'privacy' as const, label: 'Privacy Controls', icon: Shield },
    { id: 'audit' as const, label: 'Audit Logs', icon: FileText },
  ];

  const teamMembers = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Operator', status: 'active' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'active' },
  ];

  const integrations = [
    { name: 'EPA ECHO', status: 'connected', lastSync: '2025-10-11 08:30' },
    { name: 'IRS 45Q Portal', status: 'connected', lastSync: '2025-10-10 14:20' },
    { name: 'LDEQ EDocs', status: 'disconnected', lastSync: 'Never' },
  ];

  const auditLogs = [
    { timestamp: '2025-10-11 09:15', user: 'John Doe', action: 'Updated report Q3-2025', ip: '192.168.1.100' },
    { timestamp: '2025-10-11 08:42', user: 'Jane Smith', action: 'Exported data from Analysis module', ip: '192.168.1.101' },
    { timestamp: '2025-10-10 16:30', user: 'John Doe', action: 'Created incident INC-003', ip: '192.168.1.100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your organization, integrations, and security settings
        </p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#174B7A] text-[#174B7A]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'team' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              <Button variant="primary" size="sm">
                Invite Member
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {member.email}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="info" size="sm">
                          {member.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="success" size="sm">
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h2>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Admin</h3>
                <p className="text-sm text-gray-600">
                  Full access to all modules, settings, and user management
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Operator</h3>
                <p className="text-sm text-gray-600">
                  Can view and edit operational data, create reports, manage incidents
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Viewer</h3>
                <p className="text-sm text-gray-600">
                  Read-only access to dashboards and reports
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'integrations' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Connected Systems
          </h2>
          <div className="space-y-4">
            {integrations.map((integration, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Last sync: {integration.lastSync}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      integration.status === 'connected' ? 'success' : 'neutral'
                    }
                    size="sm"
                  >
                    {integration.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'retention' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Data Retention Policies
          </h2>
          <div className="space-y-4">
            <Select
              label="Operational Data Retention"
              options={[
                { value: '1y', label: '1 Year' },
                { value: '3y', label: '3 Years' },
                { value: '5y', label: '5 Years (Recommended)' },
                { value: '10y', label: '10 Years' },
                { value: 'indefinite', label: 'Indefinite' },
              ]}
            />
            <Select
              label="Compliance Reports Retention"
              options={[
                { value: '5y', label: '5 Years' },
                { value: '7y', label: '7 Years (Regulatory Minimum)' },
                { value: '10y', label: '10 Years' },
                { value: 'indefinite', label: 'Indefinite' },
              ]}
            />
            <Select
              label="Audit Logs Retention"
              options={[
                { value: '1y', label: '1 Year' },
                { value: '3y', label: '3 Years (Recommended)' },
                { value: '5y', label: '5 Years' },
              ]}
            />
            <div className="pt-4">
              <Button variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'privacy' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Privacy Controls
          </h2>
          <div className="space-y-6">
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Public Data Sharing
                </h3>
                <p className="text-sm text-gray-600">
                  Allow aggregated data to be shared in public portal
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#174B7A]"></div>
              </label>
            </div>

            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Anonymous Usage Analytics
                </h3>
                <p className="text-sm text-gray-600">
                  Help improve the platform by sharing anonymous usage data
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#174B7A]"></div>
              </label>
            </div>

            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Receive alerts for incidents, compliance, and system updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#174B7A]"></div>
              </label>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Audit Logs</h2>
            <Button variant="outline" size="sm">
              Export Logs
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {log.user}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

import React from 'react';
import { FileText, Check, AlertCircle, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const ReportsPage: React.FC = () => {
  const reports = [
    {
      id: 'r-001',
      title: 'Q3 2025 Compliance Report',
      period: 'Jul-Sep 2025',
      status: 'draft',
      completeness: 87,
      issues: 3,
    },
    {
      id: 'r-002',
      title: 'Q2 2025 Compliance Report',
      period: 'Apr-Jun 2025',
      status: 'submitted',
      completeness: 100,
      issues: 0,
    },
    {
      id: 'r-003',
      title: 'Q1 2025 Compliance Report',
      period: 'Jan-Mar 2025',
      status: 'approved',
      completeness: 100,
      issues: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate, validate, and submit regulatory compliance reports
          </p>
        </div>
        <Button variant="primary" size="md">
          <FileText size={18} className="mr-2" />
          Create New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {report.title}
                  </h3>
                  <Badge
                    variant={
                      report.status === 'approved'
                        ? 'success'
                        : report.status === 'submitted'
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{report.period}</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          report.completeness === 100
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${report.completeness}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {report.completeness}% Complete
                    </span>
                  </div>
                  {report.issues > 0 ? (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <AlertCircle size={16} />
                      <span className="text-sm font-medium">
                        {report.issues} Issue{report.issues > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check size={16} />
                      <span className="text-sm font-medium">No Issues</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {report.status === 'draft' && (
                  <>
                    <Button variant="primary" size="sm">
                      Continue Editing
                    </Button>
                    <Button variant="outline" size="sm">
                      Validate
                    </Button>
                  </>
                )}
                {report.status !== 'draft' && (
                  <Button variant="outline" size="sm">
                    <Download size={16} className="mr-1" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Regulatory Requirements
        </h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check size={14} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  EPA Class VI Well Monitoring
                </h3>
                <p className="text-sm text-gray-600">
                  40 CFR Part 146 - Quarterly monitoring reports submitted on time
                </p>
              </div>
              <Badge variant="success" size="sm">
                Compliant
              </Badge>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check size={14} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  45Q Tax Credit Documentation
                </h3>
                <p className="text-sm text-gray-600">
                  IRS Section 45Q - Annual capture verification and attestation
                </p>
              </div>
              <Badge variant="success" size="sm">
                Compliant
              </Badge>
            </div>
          </div>

          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={14} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  LDEQ Air Quality Reporting
                </h3>
                <p className="text-sm text-gray-600">
                  LAC 33:III.Chapter 5 - Annual emissions inventory due Nov 1
                </p>
              </div>
              <Badge variant="warning" size="sm">
                Due Soon
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

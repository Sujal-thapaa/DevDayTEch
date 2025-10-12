import React, { useState } from 'react';
import { Upload, FileText, File, Plus, X, Save, Download, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface ManualEntryData {
  facilityName: string;
  facilityType: string;
  date: string;
  co2Emissions: string;
  unit: string;
  captureRate: string;
  location: string;
  coordinates: string;
  notes: string;
}

export const DataEntryPage: React.FC = () => {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [manualData, setManualData] = useState<ManualEntryData>({
    facilityName: '',
    facilityType: '',
    date: '',
    co2Emissions: '',
    unit: 't CO2e 100yr',
    captureRate: '',
    location: '',
    coordinates: '',
    notes: '',
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleManualInputChange = (field: keyof ManualEntryData, value: string) => {
    setManualData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting manual entry:', manualData);
    
    // Simulate manual entry processing
    setIsProcessing(true);
    setProcessingProgress(0);
    
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setIsProcessing(false);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Reset form
      setManualData({
        facilityName: '',
        facilityType: '',
        date: '',
        co2Emissions: '',
        unit: 't CO2e 100yr',
        captureRate: '',
        location: '',
        coordinates: '',
        notes: '',
      });
      setShowManualEntry(false);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }, 1500);
  };

  const handleProcessFiles = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file');
      return;
    }
    
    // ========================================
    // IMPORTANT: This is a SIMULATION for demo purposes
    // The uploaded files are NOT actually being parsed or processed
    // We're just showing a realistic "processing" animation
    // Then displaying pre-existing mock data across all pages
    // In production, this would call an API to process the actual files
    // ========================================
    
    // Start processing simulation
    setIsProcessing(true);
    setProcessingProgress(0);
    console.log('🔄 Simulating file processing for:', uploadedFiles.map(f => f.name));
    
    // Simulate realistic file processing with progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200); // Update every 200ms (total: 2 seconds)
    
    // Complete processing after 2.5 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setIsProcessing(false);
      
      // Show success message
      setShowSuccessMessage(true);
      
      console.log('✅ Processing complete');
      
      // Clear files after a moment
      setTimeout(() => {
        setUploadedFiles([]);
      }, 1500);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }, 2500);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="text-red-600" size={24} />;
    if (ext === 'csv') return <File className="text-green-600" size={24} />;
    if (ext === 'xlsx' || ext === 'xls') return <File className="text-blue-600" size={24} />;
    return <File className="text-gray-600" size={24} />;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      {/* Processing Message */}
      {isProcessing && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-md animate-fade-in">
          <div className="flex items-center mb-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900">Processing Data...</h3>
              <p className="text-blue-700 text-sm mt-1">
                Analyzing and importing data from {uploadedFiles.length} file(s)
              </p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-blue-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-600 mt-2">{processingProgress}% complete</p>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && !isProcessing && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md animate-fade-in">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Data Processed Successfully!</h3>
              <p className="text-green-700 text-sm mt-1">
                All data has been imported and is now available across all pages. Navigate to Analytics, Analysis, Reports, Incidents, or ROI Calculator to view your data.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Entry</h1>
        <p className="text-gray-600">
          Upload emissions data files or enter data manually
        </p>
      </div>

      {/* File Upload Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">File Upload</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#174B7A]"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/templates/emissions_template.csv';
              link.download = 'emissions_template.csv';
              link.click();
            }}
          >
            <Download size={18} className="mr-2" />
            Download Template
          </Button>
        </div>

        <div className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1AAE9F] transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.xlsx,.xls,.pdf"
              multiple
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="text-gray-400 mb-4" size={48} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                Supports CSV, Excel (.xlsx, .xls), and PDF files
              </p>
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Uploaded Files ({uploadedFiles.length})</h3>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <Button
                variant="primary"
                className="w-full mt-4"
                onClick={handleProcessFiles}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Process Uploaded Files'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Manual Entry Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manual Data Entry</h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter emissions data manually for individual facilities
            </p>
          </div>
          {!showManualEntry && (
            <Button
              variant="primary"
              onClick={() => setShowManualEntry(true)}
            >
              <Plus size={18} className="mr-2" />
              Add Manual Entry
            </Button>
          )}
        </div>

        {showManualEntry && (
          <form onSubmit={handleSubmitManualEntry} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facility Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Facility Information
                </h3>
              </div>

              <Input
                label="Facility Name *"
                type="text"
                value={manualData.facilityName}
                onChange={(e) => handleManualInputChange('facilityName', e.target.value)}
                placeholder="e.g., Port Sulphur"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Type *
                </label>
                <select
                  value={manualData.facilityType}
                  onChange={(e) => handleManualInputChange('facilityType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AAE9F] focus:border-transparent"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Power plant">Power Plant</option>
                  <option value="Refinery">Refinery</option>
                  <option value="Chemicals plant">Chemicals Plant</option>
                  <option value="Waste disposal site">Waste Disposal Site</option>
                  <option value="Domestic Shipping">Domestic Shipping</option>
                  <option value="International Shipping">International Shipping</option>
                  <option value="Other metals plant">Other Metals Plant</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Location *"
                type="text"
                value={manualData.location}
                onChange={(e) => handleManualInputChange('location', e.target.value)}
                placeholder="e.g., Plaquemines Parish"
                required
              />

              <Input
                label="Coordinates (Lat, Lng)"
                type="text"
                value={manualData.coordinates}
                onChange={(e) => handleManualInputChange('coordinates', e.target.value)}
                placeholder="e.g., 29.478, -89.684"
              />

              {/* Emissions Data */}
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Emissions Data
                </h3>
              </div>

              <Input
                label="Date *"
                type="date"
                value={manualData.date}
                onChange={(e) => handleManualInputChange('date', e.target.value)}
                required
              />

              <Input
                label="CO₂ Emissions *"
                type="number"
                step="0.01"
                value={manualData.co2Emissions}
                onChange={(e) => handleManualInputChange('co2Emissions', e.target.value)}
                placeholder="e.g., 103630"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  value={manualData.unit}
                  onChange={(e) => handleManualInputChange('unit', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AAE9F] focus:border-transparent"
                  required
                >
                  <option value="t CO2e 100yr">t CO2e 100yr</option>
                  <option value="kg CO2e">kg CO2e</option>
                  <option value="Mt CO2e">Mt CO2e</option>
                </select>
              </div>

              <Input
                label="Capture Rate (%)"
                type="number"
                step="0.1"
                value={manualData.captureRate}
                onChange={(e) => handleManualInputChange('captureRate', e.target.value)}
                placeholder="e.g., 85.5"
              />

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={manualData.notes}
                  onChange={(e) => handleManualInputChange('notes', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AAE9F] focus:border-transparent"
                  rows={4}
                  placeholder="Enter any additional information or notes..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" variant="primary" className="flex-1">
                <Save size={18} className="mr-2" />
                Submit Data
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowManualEntry(false)}
                className="flex-1"
              >
                <X size={18} className="mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}

        {!showManualEntry && (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <p>No manual entries yet. Click "Add Manual Entry" to get started.</p>
          </div>
        )}
      </Card>

      {/* Recent Entries */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Entries</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No recent entries to display</p>
        </div>
      </Card>
    </div>
  );
};


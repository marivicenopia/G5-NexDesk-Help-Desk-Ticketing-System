import React, { useState, useRef, useEffect } from "react";
import { TicketService } from "../../../../../services/ticket/TicketService";
import { DepartmentService, type Department } from "../../../../../services/departments/DepartmentService";
import {
  FiFileText,
  FiUpload,
  FiX,
  FiFile,
  FiImage,
  FiPaperclip,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

type PriorityOption = "low" | "medium" | "high" | "urgent";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file: File;
}

const CreateTicket: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PriorityOption>("medium");
  const [department, setDepartment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  // File attachment states
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const deptList = await DepartmentService.getActive();
        setDepartments(deptList);
        // Set first department as default if available
        if (deptList.length > 0) {
          setDepartment(deptList[0].name);
        }
      } catch (error) {
        console.error('Error loading departments:', error);
        // Set fallback departments if API fails
        const fallbackDepts = [
          { id: '1', name: 'IT' },
          { id: '2', name: 'HR' },
          { id: '3', name: 'Finance' },
          { id: '4', name: 'Marketing' },
          { id: '5', name: 'Operations' }
        ];
        setDepartments(fallbackDepts);
        setDepartment(fallbackDepts[0].name);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    loadDepartments();
  }, []);

  // Contact information states
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerContact, setCustomerContact] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload configuration
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 5;
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  // File validation
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type "${file.type}" is not supported.`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    if (attachedFiles.length + fileArray.length > MAX_FILES) {
      setFileErrors(prev => [...prev, `Maximum ${MAX_FILES} files allowed. You have ${attachedFiles.length} files already attached.`]);
      return;
    }

    const validFiles: AttachedFile[] = [];
    const newErrors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        const attachedFile: AttachedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        };
        validFiles.push(attachedFile);
      }
    });

    if (newErrors.length > 0) {
      setFileErrors(prev => [...prev, ...newErrors]);
    }

    if (validFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...validFiles]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Remove attached file
  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
    setFileErrors([]);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FiImage className="w-5 h-5 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FiFile className="w-5 h-5 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FiFile className="w-5 h-5 text-blue-600" />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FiFile className="w-5 h-5 text-green-600" />;
    }
    return <FiFile className="w-5 h-5 text-gray-500" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newTicket = await TicketService.create({
        title,
        description,
        priority,
        department,
        customerName: customerName || "Anonymous User",
        customerEmail: customerEmail || "user@example.com",
        customerContact: customerContact || "",
        // Send actual files for backend FormData handling
        files: attachedFiles.map(f => f.file) as any,
      } as any);
      alert(`Ticket created successfully with ID: ${newTicket.id}`);

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDepartment(departments.length > 0 ? departments[0].name : "");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerContact("");
      setAttachedFiles([]);
      setFileErrors([]);
    } catch (err: any) {
      setError(err.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FiFileText className="w-6 h-6 mr-3 text-blue-600" />
          Create Support Ticket
        </h1>
        <p className="text-gray-600 mt-2">
          Please provide detailed information about your issue to help us assist you better.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ticket Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Brief summary of your issue"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityOption)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                disabled={departmentsLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{departmentsLoading ? 'Loading departments...' : 'Choose Department'}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description *
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Please provide a detailed description of your issue, including any error messages, steps you've taken, and when the problem started..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* File Attachments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiPaperclip className="w-5 h-5 mr-2" />
            File Attachments
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Attach screenshots, documents, or other files to help us understand your issue better.
          </p>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Supported: Images, PDF, Word, Excel, Text files (Max 10MB per file, up to {MAX_FILES} files)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.xls,.xlsx"
              className="hidden"
            />
          </div>

          {/* File Upload Errors */}
          {fileErrors.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              {fileErrors.map((error, index) => (
                <p key={index} className="text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Attached Files List */}
          {attachedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Attached Files ({attachedFiles.length}/{MAX_FILES})
              </h3>
              <div className="space-y-2">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove file"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="customerContact" className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                id="customerContact"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="Your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Ticket...
              </>
            ) : (
              'Create Ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;

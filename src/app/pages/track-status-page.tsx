import { Search, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useState } from 'react';
import { useComplaints } from '../context/complaints-context';
import { motion } from 'motion/react';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Resolved':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case 'In Progress':
      return <Clock className="w-5 h-5 text-blue-600" />;
    case 'Pending':
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    case 'Rejected':
      return <XCircle className="w-5 h-5 text-red-600" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolved':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'In Progress':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Medium':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Low':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return 'bg-green-600';
  if (progress >= 50) return 'bg-blue-600';
  if (progress > 0) return 'bg-yellow-600';
  return 'bg-gray-300';
};

export function TrackStatusPage() {
  const { complaints } = useComplaints();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Track Complaint Status
        </h1>
        <p className="text-gray-600">
          Monitor the progress of your submitted complaints
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by ticket ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-xl border-gray-200 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Complaints Grid or Empty State */}
      {complaints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-16 border border-gray-100 text-center"
        >
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No complaints to track
          </h3>
          <p className="text-gray-600 mb-6">
            Submit your first complaint to start tracking its status
          </p>
          <a
            href="/app/submit"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            Submit Complaint
          </a>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredComplaints.map((complaint, index) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Section */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900 text-lg">
                          {complaint.id}
                        </span>
                        <Badge
                          className={`${getPriorityColor(
                            complaint.priority
                          )} border rounded-full px-3 py-1`}
                        >
                          {complaint.priority}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {complaint.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Category: {complaint.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status)}
                      <Badge
                        className={`${getStatusColor(
                          complaint.status
                        )} border rounded-full px-4 py-1.5 font-medium`}
                      >
                        {complaint.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {complaint.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${complaint.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className={`${getProgressColor(
                          complaint.progress
                        )} h-2 rounded-full`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-6 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Assigned To
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {complaint.assignedTo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Submitted
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {complaint.submittedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Last Update
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {complaint.lastUpdate}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredComplaints.length === 0 && complaints.length > 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No complaints found matching your search</p>
        </div>
      )}
    </motion.div>
  );
}

import { useState } from 'react';
import { useComplaints } from '../context/complaints-context';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function AdminDashboardPage() {
  const { complaints, updateComplaintStatus } = useComplaints();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Calculate statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
    rejected: complaints.filter((c) => c.status === 'Rejected').length,
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (id: string, newStatus: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected') => {
    updateComplaintStatus(id, newStatus);
    toast.success('Status Updated', {
      description: `Ticket ${id} status changed to ${newStatus}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'Low':
        return 'text-green-400 bg-green-500/20 border-green-500/50';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'In Progress':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      case 'Resolved':
        return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'Rejected':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Complaint Management
        </h1>
        <p className="text-purple-300">
          Monitor and manage all support tickets
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-purple-300">Total Tickets</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.pending}</p>
          <p className="text-sm text-purple-300">Pending</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
          <p className="text-sm text-purple-300">In Progress</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.resolved}</p>
          <p className="text-sm text-purple-300">Resolved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.rejected}</p>
          <p className="text-sm text-purple-300">Rejected</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-300" />
          <h3 className="font-semibold text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-purple-300"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 rounded-xl bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-12 rounded-xl bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Tickets Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                  Ticket ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                  Submitted By
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-purple-300">No tickets found</p>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {complaint.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-purple-200 max-w-xs truncate">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-purple-200">
                      {complaint.submittedBy}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={complaint.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            complaint.id,
                            value as 'Pending' | 'In Progress' | 'Resolved' | 'Rejected'
                          )
                        }
                      >
                        <SelectTrigger className="h-9 w-36 rounded-lg bg-white/10 border-white/20 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

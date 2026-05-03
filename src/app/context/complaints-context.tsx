import { createContext, useContext, useState, ReactNode } from 'react';

export interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  submittedBy: string;
  submittedDate: string;
  lastUpdate: string;
  assignedTo: string;
  progress: number;
  resolution?: string;
  rating?: number;
}

interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'submittedDate' | 'lastUpdate' | 'progress'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  rateComplaint: (id: string, rating: number) => void;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export function ComplaintsProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [ticketCounter, setTicketCounter] = useState(1001);

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'status' | 'submittedDate' | 'lastUpdate' | 'progress'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: `TKT-${ticketCounter}`,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdate: 'Just now',
      progress: 0,
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    setTicketCounter((prev) => prev + 1);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          let progress = 0;
          let lastUpdate = 'Just now';
          
          switch (status) {
            case 'Pending':
              progress = 0;
              break;
            case 'In Progress':
              progress = 50;
              break;
            case 'Resolved':
              progress = 100;
              break;
            case 'Rejected':
              progress = 0;
              break;
          }

          return { ...complaint, status, progress, lastUpdate };
        }
        return complaint;
      })
    );
  };

  const rateComplaint = (id: string, rating: number) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, rating } : complaint
      )
    );
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, addComplaint, updateComplaintStatus, rateComplaint }}>
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints must be used within ComplaintsProvider');
  }
  return context;
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText, Sparkles, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useComplaints } from '../context/complaints-context';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { classifyComplaint, validateComplaintText } from '../utils/text-classifier';

const categories = [
  'Technical Issue',
  'Billing & Payment',
  'Account Access',
  'Feature Request',
  'Product Quality',
  'Customer Service',
  'Other',
];

const assignedTeamMap: Record<string, string> = {
  'Technical Issue': 'Tech Support Team',
  'Billing & Payment': 'Billing Department',
  'Account Access': 'Account Team',
  'Feature Request': 'Product Team',
  'Product Quality': 'Quality Assurance',
  'Customer Service': 'Customer Success',
  'Other': 'General Support',
};

export function SubmitComplaintPage() {
  const navigate = useNavigate();
  const { addComplaint } = useComplaints();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    message: string;
    severity: 'error' | 'warning' | 'success';
  } | null>(null);
  const [classificationResult, setClassificationResult] = useState<any>(null);

  // Real-time text validation
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text.length > 0) {
      const validation = validateComplaintText(text);
      setValidationStatus(validation);
    } else {
      setValidationStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Classify complaint using NLP
    const classification = classifyComplaint(description, category);
    setClassificationResult(classification);

    // Check if complaint is relevant
    if (!classification.isRelevant) {
      toast.error('Complaint Rejected', {
        description: classification.reason,
      });
      setShowAiSuggestion(false);
      return;
    }
    
    // Generate AI suggestion
    const team = assignedTeamMap[classification.category || category] || 'General Support';
    
    setAiSuggestion(
      `${classification.reason} Our AI recommends routing this to the ${team}. Estimated resolution time: ${classification.priority === 'High' ? '24-48' : classification.priority === 'Medium' ? '48-72' : '72-96'} hours.`
    );
    setShowAiSuggestion(true);

    // Simulate AI processing
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Add complaint to global state
      addComplaint({
        title: description.split('.')[0].substring(0, 50) + (description.length > 50 ? '...' : ''),
        category: classification.category || category,
        description,
        priority: classification.priority,
        submittedBy: name,
        assignedTo: team,
      });

      setIsSubmitting(false);

      // Show success toast
      toast.success('Complaint Submitted Successfully!', {
        description: `Your ticket has been created with ${classification.priority} priority and assigned to ${team}.`,
      });

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/app');
      }, 1000);
    }, 1500);
  };

  const handleClear = () => {
    setName('');
    setCategory('');
    setDescription('');
    setShowAiSuggestion(false);
    setAiSuggestion('');
    setValidationStatus(null);
    setClassificationResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Submit a Complaint
        </h1>
        <p className="text-gray-600">
          Fill out the form below to submit your complaint. Our AI system will
          analyze and route it to the appropriate team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 rounded-xl border-gray-200"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Category <span className="text-red-500">*</span>
                </label>
                <Select 
                  value={category} 
                  onValueChange={setCategory} 
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Please provide detailed information about your complaint..."
                  className="min-h-[200px] rounded-xl border-gray-200 resize-none"
                  required
                  disabled={isSubmitting}
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {description.length} / 1000 characters
                  </p>
                  {validationStatus && (
                    <div className={`flex items-center gap-1 text-sm ${
                      validationStatus.severity === 'error' ? 'text-red-600' :
                      validationStatus.severity === 'warning' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {validationStatus.severity === 'error' && <AlertCircle className="w-4 h-4" />}
                      {validationStatus.severity === 'success' && <CheckCircle2 className="w-4 h-4" />}
                      {validationStatus.severity === 'warning' && <AlertCircle className="w-4 h-4" />}
                      <span>{validationStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || (validationStatus && !validationStatus.isValid)}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Complaint
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  disabled={isSubmitting}
                  className="h-12 rounded-xl border-gray-200"
                >
                  Clear
                </Button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* AI Suggestion Panel */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-purple-100 sticky top-24"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            </div>

            {!showAiSuggestion ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Submit your complaint to get AI-powered routing suggestions and
                  estimated resolution time.
                </p>
                <div className="bg-white rounded-xl p-4 border border-purple-100">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Quick Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Be specific and clear</li>
                        <li>Include relevant details</li>
                        <li>Mention any error codes</li>
                        <li>Avoid spam or test text</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="bg-white rounded-xl p-4 border border-purple-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {aiSuggestion}
                  </p>
                </div>
                {classificationResult && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Priority Level</span>
                      <span className={`font-semibold ${
                        classificationResult.priority === 'High' ? 'text-red-600' :
                        classificationResult.priority === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {classificationResult.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Confidence Score</span>
                      <span className="font-semibold text-purple-600">{classificationResult.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${classificationResult.confidence}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
import { CheckCircle2, Clock, Circle, BarChart3 } from 'lucide-react';
import { Badge } from './ui/badge';

interface BacklogItem {
  id: number;
  title: string;
  epic: string;
  userStory: string;
  priority: 'Must' | 'Should' | 'Could';
  status: 'To Do' | 'In Progress' | 'Done';
  acceptanceCriteria: string;
  functionalReq: string;
  nonFunctionalReq: string;
  originalEstimate: number;
  actualTime: number | null;
}

const backlogData: BacklogItem[] = [
  {
    id: 1,
    title: 'Ticket Impact Analysis',
    epic: 'Analytics Engine',
    userStory: 'As a support manager, I want to analyze ticket impact scores so that I can prioritize resource allocation effectively',
    priority: 'Must',
    status: 'In Progress',
    acceptanceCriteria: 'System calculates impact score based on customer tier, issue severity, and historical data',
    functionalReq: 'Calculate impact score using weighted algorithm; Display visual indicators; Generate historical reports',
    nonFunctionalReq: 'Response time < 2s; 99.9% uptime; Handle 10k concurrent requests',
    originalEstimate: 8,
    actualTime: null,
  },
  {
    id: 2,
    title: 'Priority Shift Detection',
    epic: 'AI Triage System',
    userStory: 'As a support agent, I want to be alerted when ticket priorities change so that I can respond to urgent issues promptly',
    priority: 'Must',
    status: 'To Do',
    acceptanceCriteria: 'Real-time detection of priority changes; Alert notifications sent within 30 seconds; Audit trail maintained',
    functionalReq: 'Monitor ticket priority changes; Send real-time alerts; Log all priority modifications; Dashboard visualization',
    nonFunctionalReq: 'Alert latency < 30s; 100% priority change capture; Scalable to 50k tickets/day',
    originalEstimate: 5,
    actualTime: null,
  },
  {
    id: 3,
    title: 'SLA Risk Identification',
    epic: 'SLA Management',
    userStory: 'As a team lead, I want to identify tickets at risk of SLA breach so that I can intervene before violations occur',
    priority: 'Must',
    status: 'Done',
    acceptanceCriteria: 'Predictive model identifies at-risk tickets; Risk score displayed on dashboard; Automated escalation for high-risk tickets',
    functionalReq: 'ML-based risk prediction; Risk scoring algorithm; Automated escalation workflow; Real-time dashboard updates',
    nonFunctionalReq: 'Prediction accuracy > 85%; Risk calculation < 1s; 24/7 monitoring; Zero downtime deployment',
    originalEstimate: 10,
    actualTime: 9,
  },
  {
    id: 4,
    title: 'Ticket Triage',
    epic: 'AI Triage System',
    userStory: 'As a support team, we want automated ticket categorization so that tickets are routed to the right specialists',
    priority: 'Should',
    status: 'In Progress',
    acceptanceCriteria: 'AI categorizes tickets into 12+ categories; Routing accuracy > 90%; Manual override available',
    functionalReq: 'NLP-based categorization; Auto-routing engine; Manual override interface; Category confidence scoring',
    nonFunctionalReq: 'Classification time < 3s; 95% categorization accuracy; Support multi-language; API rate limit 1000/min',
    originalEstimate: 12,
    actualTime: null,
  },
  {
    id: 5,
    title: 'Sprint Summary',
    epic: 'Reporting Module',
    userStory: 'As a product owner, I want automated sprint summaries so that I can track team velocity and performance metrics',
    priority: 'Could',
    status: 'To Do',
    acceptanceCriteria: 'Automated report generation at sprint end; Includes velocity, burn-down, and completion metrics; Export to PDF/Excel',
    functionalReq: 'Sprint metrics calculation; Automated report generation; Data visualization; Export functionality',
    nonFunctionalReq: 'Report generation < 10s; Support 100+ sprints history; Mobile responsive; Accessible (WCAG 2.1)',
    originalEstimate: 6,
    actualTime: null,
  },
  {
    id: 6,
    title: 'Kubernetes Cluster Deployment',
    epic: 'Kubernetes Infrastructure',
    userStory: 'As a DevOps engineer, I want to deploy the triage system on a Kubernetes cluster so that we achieve high availability and seamless horizontal scaling',
    priority: 'Must',
    status: 'In Progress',
    acceptanceCriteria: 'All microservices deployed as Kubernetes Deployments; Horizontal Pod Autoscaler configured; Rolling updates with zero downtime; Health probes (liveness & readiness) active on all pods',
    functionalReq: 'Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets); HPA rules per service; Ingress controller with TLS termination; Namespace isolation per environment',
    nonFunctionalReq: 'Pod startup < 30s; 99.95% cluster uptime; Auto-scale from 2 to 20 replicas under load; Resource requests/limits enforced on every container',
    originalEstimate: 10,
    actualTime: null,
  },
  {
    id: 7,
    title: 'Kubernetes Observability Stack',
    epic: 'Kubernetes Infrastructure',
    userStory: 'As a site reliability engineer, I want full observability into the Kubernetes workloads so that I can detect and resolve incidents before they impact SLAs',
    priority: 'Must',
    status: 'To Do',
    acceptanceCriteria: 'Prometheus scrapes metrics from all pods; Grafana dashboards display CPU, memory, request rate, and error rate; Alertmanager fires PagerDuty alerts for SLA-critical thresholds; Distributed traces available in Jaeger',
    functionalReq: 'Prometheus + Alertmanager deployment via Helm; Pre-built Grafana dashboards per service; OpenTelemetry SDK integration in triage services; Log aggregation with Loki; Alert rules for pod crash-loop and high latency',
    nonFunctionalReq: 'Metrics retention ≥ 30 days; Dashboard load < 3s; Alert-to-notification latency < 60s; Trace sampling rate configurable without redeployment',
    originalEstimate: 8,
    actualTime: null,
  },
  {
    id: 8,
    title: 'CI/CD Pipeline with Kubernetes GitOps',
    epic: 'Kubernetes Infrastructure',
    userStory: 'As a developer, I want a GitOps-driven CI/CD pipeline so that every code merge is automatically tested and deployed to the Kubernetes cluster without manual intervention',
    priority: 'Should',
    status: 'To Do',
    acceptanceCriteria: 'GitHub Actions builds and pushes Docker images on every PR merge; ArgoCD syncs cluster state from the Git repository; Canary deployments configurable via feature flags; Rollback completes within 2 minutes',
    functionalReq: 'GitHub Actions workflows for build, test, and push; ArgoCD Application manifests per environment (dev/staging/prod); Helm chart versioning; Automated smoke tests post-deployment; Slack notifications on deployment status',
    nonFunctionalReq: 'Pipeline execution < 8 min end-to-end; Zero manual steps for standard releases; Image scan (Trivy) must pass before deploy; Secrets never stored in Git (use Sealed Secrets)',
    originalEstimate: 7,
    actualTime: null,
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Must':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Should':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Could':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Done':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'In Progress':
      return <Clock className="w-4 h-4" />;
    case 'To Do':
      return <Circle className="w-4 h-4" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Done':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'In Progress':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'To Do':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export function ProductBacklogDashboard() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-semibold text-slate-800">
              AI-Driven Client Support Ticket Triage System
            </h1>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm px-4 py-1.5 rounded-full">
              Sprint 1
            </Badge>
            <span className="text-slate-600">Product Backlog</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Epic
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    User Story
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Acceptance Criteria
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Functional Requirements
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Non-Functional Requirements
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Original Estimate
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actual Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backlogData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 max-w-xs">
                        {item.title}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600 max-w-xs">
                        {item.epic}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600 max-w-md line-clamp-3">
                        {item.userStory}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        className={`${getPriorityColor(
                          item.priority
                        )} font-medium border px-3 py-1 rounded-full`}
                      >
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        className={`${getStatusColor(
                          item.status
                        )} font-medium border px-3 py-1 rounded-full flex items-center gap-1.5 w-fit`}
                      >
                        {getStatusIcon(item.status)}
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600 max-w-md line-clamp-2">
                        {item.acceptanceCriteria}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600 max-w-md line-clamp-2">
                        {item.functionalReq}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600 max-w-md line-clamp-2">
                        {item.nonFunctionalReq}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-slate-700 text-center">
                        {item.originalEstimate} days
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-slate-700 text-center">
                        {item.actualTime ? `${item.actualTime} days` : '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-5 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Total Items</div>
            <div className="text-2xl font-semibold text-slate-800">{backlogData.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">In Progress</div>
            <div className="text-2xl font-semibold text-blue-600">
              {backlogData.filter((item) => item.status === 'In Progress').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Completed</div>
            <div className="text-2xl font-semibold text-emerald-600">
              {backlogData.filter((item) => item.status === 'Done').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Total Estimate</div>
            <div className="text-2xl font-semibold text-slate-800">
              {backlogData.reduce((sum, item) => sum + item.originalEstimate, 0)} days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

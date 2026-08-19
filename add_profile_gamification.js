
const fs = require("fs");
let content = fs.readFileSync("app/editorial360/page.tsx", "utf-8");

// 1. Add missing lucide icons
content = content.replace(
  `  MessageSquare\n}`,
  `  MessageSquare,\n  Award,\n  Trophy,\n  Star,\n  Zap,\n  Target,\n  TrendingUp,\n  CheckCircle2,\n  Shield,\n  Edit3,\n  Clock,\n  Activity,\n  Flame,\n  Medal\n}`
);

// 2. Add role profile data builder before Editorial360Page component
const profileHelperCode = `
// Role Profile & Gamification Data Definitions
interface ProfileMetric {
  label: string
  value: string
  subtext: string
  icon: any
  color: string
}

interface RoleProfileData {
  name: string
  initials: string
  title: string
  affiliation: string
  orcid: string
  level: string
  levelNum: number
  rankNum: number
  activeTaskCount: string
  interests: string[]
  badges: string[]
  nextBadgeTitle: string
  nextBadgeGoal: string
  progressPercent: number
  metrics: ProfileMetric[]
}

function getRoleProfileData(role: UserRole): RoleProfileData {
  switch (role) {
    case "author":
      return {
        name: "Jane Doe",
        initials: "JD",
        title: "Senior Researcher, AI Ethics",
        affiliation: "Institute for Ethical AI, Cambridge, MA",
        orcid: "0000-1234-5678",
        level: "Level 4 Principal Author",
        levelNum: 4,
        rankNum: 14,
        activeTaskCount: "3 Active Submissions",
        interests: ["AI Ethics", "Machine Learning", "Data Privacy", "Autonomous Systems"],
        badges: ["Quality Contributor", "Fast Responder", "Ethics Verified"],
        nextBadgeTitle: "Integrity Champion",
        nextBadgeGoal: "Complete 3 more ethics disclosures & revisions to unlock!",
        progressPercent: 75,
        metrics: [
          { label: "Turnaround Speed", value: "4.5 Days", subtext: "Top 10% Revision Speed", icon: Clock, color: "text-amber-500" },
          { label: "Acceptance Rate", value: "88%", subtext: "Verified High Rigor", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Completed Papers", value: "12 Published", subtext: "120 Total Citations", icon: FileText, color: "text-[#0b99ff]" },
          { label: "Active Submissions", value: "3 Active", subtext: "1 Under Review", icon: Target, color: "text-indigo-500" },
          { label: "Peer Percentile", value: "Top 10%", subtext: "Level 4 Author Rank", icon: Trophy, color: "text-purple-500" }
        ]
      }
    case "reviewer":
      return {
        name: "Dr. Evelyn Vane",
        initials: "EV",
        title: "Senior Peer Reviewer & Associate Professor",
        affiliation: "Dept of Computer Science & AI Systems",
        orcid: "0000-0002-1825-0097",
        level: "Level 5 Master Reviewer",
        levelNum: 5,
        rankNum: 8,
        activeTaskCount: "2 Active Reviews Assigned",
        interests: ["Renewable Energy", "Machine Learning", "Neural Networks", "Optimization"],
        badges: ["Precision Reviewer", "Fast Responder", "Top 10% Rank", "Double-Blind Legend"],
        nextBadgeTitle: "Reviewer Master",
        nextBadgeGoal: "Complete 3 more double-blind reviews to unlock!",
        progressPercent: 82,
        metrics: [
          { label: "Review Turnaround", value: "3.2 Days", subtext: "Top 5% Speed Rank", icon: Clock, color: "text-emerald-500" },
          { label: "Review Quality", value: "94%", subtext: "Editor Rigor Score", icon: Star, color: "text-amber-500" },
          { label: "Completed Reviews", value: "42 Reviews", subtext: "Across 4 Journals", icon: CheckSquare, color: "text-[#0b99ff]" },
          { label: "Active Load", value: "2 Assigned", subtext: "1 In Progress", icon: Activity, color: "text-[#0b99ff]" },
          { label: "Reviewer Percentile", value: "Top 5%", subtext: "Level 5 Reviewer Rank", icon: Trophy, color: "text-[#0b99ff]" }
        ]
      }
    case "editor":
      return {
        name: "Prof. Aris Thorne",
        initials: "AT",
        title: "Managing Editor & Professor of Political Science",
        affiliation: "School of Public Policy & International Affairs",
        orcid: "0000-0003-9182-4410",
        level: "Level 5 Managing Editor",
        levelNum: 5,
        rankNum: 3,
        activeTaskCount: "4 Manuscripts Under Evaluation",
        interests: ["International Relations", "Political Psychology", "American Government", "Policy Analysis"],
        badges: ["Master Moderator", "Fast Decisioner", "High Rigor Editor", "Editorial Fellow"],
        nextBadgeTitle: "Editorial Board Chair",
        nextBadgeGoal: "Process 5 more manuscript decisions this cycle!",
        progressPercent: 90,
        metrics: [
          { label: "Decision Latency", value: "12.4 Days", subtext: "Sub-to-Decision Speed", icon: Zap, color: "text-amber-500" },
          { label: "Decision Accuracy", value: "96%", subtext: "Board Audit Score", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Papers Handled", value: "86 Papers", subtext: "Lifetime Portfolio", icon: BookOpen, color: "text-[#0b99ff]" },
          { label: "Queue Load", value: "4 Assigned", subtext: "2 Awaiting Assignment", icon: Layers, color: "text-indigo-500" },
          { label: "Editor Percentile", value: "Top 3%", subtext: "Level 5 Managing Rank", icon: Trophy, color: "text-purple-500" }
        ]
      }
    case "jm":
      return {
        name: "Sarah Jenkins, M.S.",
        initials: "SJ",
        title: "Journal Operations Manager & Quality Desk Lead",
        affiliation: "Scholarly Open Central Editorial Desk",
        orcid: "0000-0001-5524-8891",
        level: "Level 6 Operations Lead",
        levelNum: 6,
        rankNum: 1,
        activeTaskCount: "2 Pending Moderation Tasks",
        interests: ["Publication Ethics", "Peer Review Moderation", "Journal Analytics", "COI Security"],
        badges: ["Operations Maestro", "Rigor Guardian", "Zero Backlog", "Safety Officer"],
        nextBadgeTitle: "Chief Operations Fellow",
        nextBadgeGoal: "Audit 10 more reviewer feedback packages!",
        progressPercent: 65,
        metrics: [
          { label: "Moderation Time", value: "1.8 Days", subtext: "Redaction & Release", icon: Clock, color: "text-emerald-500" },
          { label: "Safety Clearance", value: "99.2%", subtext: "COI & Redaction Rigor", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Reviews Moderated", value: "312 Items", subtext: "All Journals Managed", icon: MessageSquare, color: "text-[#0b99ff]" },
          { label: "Active Queue", value: "2 Pending", subtext: "Vetting Required", icon: MessageSquareOff, color: "text-orange-500" },
          { label: "Manager Rank", value: "Top 1%", subtext: "Level 6 Operations Lead", icon: Trophy, color: "text-[#0b99ff]" }
        ]
      }
    case "ria":
      return {
        name: "Dr. Marcus Vance",
        initials: "MV",
        title: "Research Integrity Advisor & Forensics Analyst",
        affiliation: "Center for Publication Ethics & Algorithmic Audit",
        orcid: "0000-0004-7711-2093",
        level: "Level 5 Integrity Specialist",
        levelNum: 5,
        rankNum: 2,
        activeTaskCount: "2 Active Forensics Alerts",
        interests: ["AI Content Indexing", "Plagiarism Forensics", "Figure Duplication", "COI Verification"],
        badges: ["Forensic Hawk", "Plagiarism Shield", "AI Auditor", "Rigor Specialist"],
        nextBadgeTitle: "Master Forensics Officer",
        nextBadgeGoal: "Resolve 4 more flagged integrity alerts!",
        progressPercent: 70,
        metrics: [
          { label: "Alert Resolution", value: "0.9 Days", subtext: "Forensics Audit Speed", icon: Zap, color: "text-emerald-500" },
          { label: "Detection Precision", value: "99.8%", subtext: "Similarity Index Precision", icon: Cpu, color: "text-indigo-500" },
          { label: "Audits Completed", value: "148 Audits", subtext: "Cross-Journal Index", icon: ShieldAlert, color: "text-rose-500" },
          { label: "Active Alerts", value: "2 Flagged", subtext: "Under Forensic Inspection", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Integrity Rank", value: "Top 2%", subtext: "Level 5 Specialist Rank", icon: Trophy, color: "text-purple-500" }
        ]
      }
    default:
      return {
        name: "System Administrator",
        initials: "SA",
        title: "Chief Platform Architect & Node Admin",
        affiliation: "Scholarly Open Infrastructure Group",
        orcid: "0000-0000-0000-0001",
        level: "Level 10 System Superuser",
        levelNum: 10,
        rankNum: 1,
        activeTaskCount: "All Workspace Nodes Active",
        interests: ["Node Operations", "User Registry", "Security Protocols", "Workflow Schema"],
        badges: ["System Architect", "Security Master", "Uptime Champion"],
        nextBadgeTitle: "Infrastructure Master",
        nextBadgeGoal: "Maintain 99.99% Uptime across 320 prerendered routes!",
        progressPercent: 98,
        metrics: [
          { label: "Node Uptime", value: "99.99%", subtext: "Zero Downtime Recorded", icon: Zap, color: "text-emerald-500" },
          { label: "Node Security", value: "100%", subtext: "Verified Permissions Schema", icon: Lock, color: "text-[#0b99ff]" },
          { label: "Workspace Actions", value: "1.4k Logged", subtext: "System Audit Logs", icon: Settings, color: "text-purple-500" },
          { label: "Security Breaches", value: "0 Incidents", subtext: "All Systems Secure", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "System Rank", value: "Top 1%", subtext: "Level 10 Superuser", icon: Trophy, color: "text-amber-500" }
        ]
      }
  }
}
`;

content = content.replace("export default function Editorial360Page() {", profileHelperCode + "\nexport default function Editorial360Page() {");

// 3. Inject profile helper call inside Editorial360Page component
content = content.replace(
  `  // Theme states\n  const { theme, setTheme } = useTheme()`,
  `  const currentProfile = getRoleProfileData(role)\n\n  // Theme states\n  const { theme, setTheme } = useTheme()`
);

// 4. Inject the Universal Horizontal Profile Card & Gamification Metrics component right before role sections
const profileCardJSX = `
                {/* ========================================================= */}
                {/* UNIVERSAL HORIZONTAL PROFILE & GAMIFICATION METRICS SECTION */}
                {/* ========================================================= */}
                <div className="space-y-6">
                  {/* Top Row: Profile Info & Contributor Recognition */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Horizontal Profile Header (7 cols) */}
                    <Card className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        
                        {/* Avatar Badge */}
                        <div className="relative shrink-0">
                          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#0b99ff] via-[#0b99ff]/80 to-sky-400 flex items-center justify-center text-white text-2xl font-black shadow-md border-2 border-white dark:border-slate-900 uppercase">
                            {currentProfile.initials}
                          </div>
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full text-xs shadow-xs" title="Gamification Badge Rank">
                            <Trophy className="h-3.5 w-3.5" />
                          </span>
                        </div>

                        {/* Profile Meta Details */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">{currentProfile.name}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20 shrink-0">
                              {currentProfile.level}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {currentProfile.title} • <span className="text-slate-500 dark:text-slate-400 font-medium">{currentProfile.affiliation}</span>
                          </p>

                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              <ShieldCheck className="h-3.5 w-3.5" /> ORCID: {currentProfile.orcid}
                            </span>
                            <span className="text-[11px] text-slate-300 dark:text-slate-700">|</span>
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                              {currentProfile.activeTaskCount}
                            </span>
                          </div>

                          {/* Focus Interests / Specialization Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Focus Areas:</span>
                            {currentProfile.interests.map((interest, idx) => (
                              <span key={idx} className="text-[11px] font-medium bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        <Button variant="outline" size="sm" className="text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer">
                          <Edit3 className="h-3.5 w-3.5 mr-1.5 text-[#0b99ff]" /> Edit Profile & Preferences
                        </Button>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Verified Institutional Contributor Node
                        </span>
                      </div>
                    </Card>

                    {/* Right Column: Contributor Recognition & Gaming (5 cols) */}
                    <Card className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between transition-colors">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-amber-500" /> Contributor Recognition
                          </h4>
                          <span className="text-[10px] font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-full border border-[#0b99ff]/20">
                            Level {currentProfile.levelNum} Veteran
                          </span>
                        </div>

                        {/* Badges Earned */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Badges Earned</span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentProfile.badges.map((b, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30 shadow-2xs">
                                <Star className="h-3 w-3 text-amber-500 fill-amber-400" /> {b}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Next Badge Progress Bar */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-700 dark:text-slate-300">Next Badge: <strong className="text-[#0b99ff]">{currentProfile.nextBadgeTitle}</strong></span>
                            <span className="text-slate-500 font-bold">{currentProfile.progressPercent}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="h-full bg-gradient-to-r from-[#0b99ff] to-emerald-400 rounded-full transition-all duration-500" style={{ width: \`\${currentProfile.progressPercent}%\` }} />
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            {currentProfile.nextBadgeGoal}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <Button size="sm" className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer shadow-xs">
                          Explore Badges & Leaderboard
                        </Button>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ranked #{currentProfile.rankNum} Overall</span>
                      </div>
                    </Card>

                  </div>

                  {/* Bottom Row: 5 Horizontal KPI Metrics Bar (As seen in Screenshot 2 & 3) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {currentProfile.metrics.map((m, idx) => (
                      <Card key={idx} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-2xs hover:border-[#0b99ff]/50 transition-all">
                        <div className="flex items-center justify-between pb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">{m.label}</span>
                          <m.icon className={\`h-4 w-4 shrink-0 \${m.color}\`} />
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{m.value}</div>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mt-0.5 truncate">{m.subtext}</span>
                      </Card>
                    ))}
                  </div>
                </div>
`;

content = content.replace(
  `                {/* ========================================================= */}\n                {/* A. ROLE DASHBOARD DETAILS DISPLAY PANEL                   */}\n                {/* ========================================================= */}`,
  profileCardJSX + `\n                {/* ========================================================= */}\n                {/* A. ROLE DASHBOARD DETAILS DISPLAY PANEL                   */}\n                {/* ========================================================= */}`
);

fs.writeFileSync("app/editorial360/page.tsx", content);
console.log("Successfully integrated horizontal profile card and gamification metrics!");


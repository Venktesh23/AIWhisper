"use client"

import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Globe, Key, Activity, TrendingUp, Database, Zap } from 'lucide-react';
import { PremiumMethodBadge } from './premium-method-badge';

interface Endpoint {
  path: string;
  method: string;
  summary?: string;
  description?: string;
  parameters?: any[];
  requestBody?: any;
  responses?: Record<string, any>;
}

interface ApiMetricsProps {
  endpoints: Endpoint[];
}

// Enhanced color palettes
const methodColors = {
  GET: '#3b82f6',
  POST: '#10b981', 
  PUT: '#f59e0b',
  DELETE: '#ef4444',
  PATCH: '#8b5cf6'
};

const authColors = ['#10B981', '#3B82F6', '#F59E0B'];
const complexityColors = ['#10B981', '#F59E0B', '#EF4444'];

export default function ApiMetrics({ endpoints }: ApiMetricsProps) {
  const metrics = useMemo(() => {
    // Method distribution
    const methodCount = endpoints.reduce((acc, endpoint) => {
      acc[endpoint.method] = (acc[endpoint.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const methodData = Object.entries(methodCount).map(([method, count]) => ({
      method,
      count,
      fill: methodColors[method as keyof typeof methodColors] || '#6b7280'
    }));

    // Authentication analysis
    const authRequired = endpoints.filter(e => 
      e.description?.toLowerCase().includes('auth') ||
      e.summary?.toLowerCase().includes('auth') ||
      e.path.includes('auth')
    ).length;

    const authData = [
      { name: 'Public', value: endpoints.length - authRequired, fill: '#10b981' },
      { name: 'Auth Required', value: authRequired, fill: '#3b82f6' }
    ];

    // Endpoint complexity (based on parameters and request body)
    const complexityData = endpoints.map(endpoint => {
      const paramCount = endpoint.parameters?.length || 0;
      const hasRequestBody = !!endpoint.requestBody;
      const responseCount = Object.keys(endpoint.responses || {}).length;
      
      let complexity = 'Simple';
      const score = paramCount + (hasRequestBody ? 2 : 0) + (responseCount > 3 ? 1 : 0);
      
      if (score > 4) complexity = 'Complex';
      else if (score > 2) complexity = 'Medium';

      return { ...endpoint, complexity, score };
    });

    const complexityCount = complexityData.reduce((acc, endpoint) => {
      acc[endpoint.complexity] = (acc[endpoint.complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const complexityChartData = Object.entries(complexityCount).map(([level, count], index) => ({
      level,
      count,
      percentage: Math.round((count / endpoints.length) * 100),
      fill: complexityColors[index] || '#6B7280'
    }));

    // Path depth analysis
    const pathDepthData = endpoints.map(endpoint => ({
      path: endpoint.path.split('/').filter(Boolean).length,
      method: endpoint.method,
      endpoint: `${endpoint.method} ${endpoint.path}`
    }));

    return {
      methodData,
      authData,
      complexityChartData,
      pathDepthData,
      totalEndpoints: endpoints.length,
      uniquePaths: new Set(endpoints.map(e => e.path)).size,
      avgParameters: Math.round((endpoints.reduce((sum, e) => sum + (e.parameters?.length || 0), 0) / endpoints.length) * 10) / 10
    };
  }, [endpoints]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-lg">
          <p className="font-semibold text-white">{label}</p>
          <p className="text-emerald-400">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover p-3 rounded-lg border shadow-lg">
          <p className="font-medium flex items-center gap-2">
            {data.icon && <data.icon className="h-4 w-4" />}
            {data.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="font-medium text-foreground">{data.value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-medium text-foreground">
              {Math.round((data.value / metrics.totalEndpoints) * 100)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Activity, label: 'Total Endpoints', value: metrics.totalEndpoints, color: 'emerald' },
          { icon: Database, label: 'Unique Paths', value: metrics.uniquePaths, color: 'blue' },
          { icon: Shield, label: 'Auth Required', value: metrics.authData[1]?.value || 0, color: 'purple' },
          { icon: TrendingUp, label: 'Avg Parameters', value: metrics.avgParameters, color: 'yellow' }
        ].map((item, index) => (
          <div
            key={item.label}
            className="neuro-card-inset p-6 spotlight group cursor-pointer scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${item.color}-500/20 group-hover:bg-${item.color}-500/30 transition-colors`}>
                <item.icon className={`h-6 w-6 text-${item.color}-400`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white/70">{item.label}</p>
                <p className="text-3xl font-bold premium-heading">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Methods Chart */}
        <div className="neuro-card p-6 spotlight fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold premium-heading">HTTP Methods</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.methodData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="method" 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {metrics.methodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Method Badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            {metrics.methodData.map((item) => (
              <div key={item.method} className="flex items-center gap-2">
                <PremiumMethodBadge method={item.method} />
                <span className="text-white/70 text-sm">({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Chart */}
        <div className="neuro-card p-6 spotlight fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold premium-heading">Authentication</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.authData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {metrics.authData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
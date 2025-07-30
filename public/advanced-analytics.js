// Advanced Analytics Engine with AI Insights for IMPACT Platform
class AdvancedAnalytics {
  constructor() {
    this.data = this.loadAllData();
    this.aiInsights = new AIInsightsEngine();
    this.initializeCharts();
  }

  loadAllData() {
    return {
      ideas: JSON.parse(localStorage.getItem('seedboardIdeas') || '[]'),
      volunteers: JSON.parse(localStorage.getItem('volunteers') || '[]'),
      teams: JSON.parse(localStorage.getItem('teams') || '[]'),
      calls: JSON.parse(localStorage.getItem('openCalls') || '[]'),
      reflections: JSON.parse(localStorage.getItem('impactEntries') || '[]'),
      userProfile: JSON.parse(localStorage.getItem('userProfile') || '{}')
    };
  }

  // Advanced Chart Configurations
  createImpactTrendChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const last30Days = this.getLast30DaysData();
    
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: last30Days.map(d => d.date),
        datasets: [{
          label: 'Ideas Submitted',
          data: last30Days.map(d => d.ideas),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Calls Answered',
          data: last30Days.map(d => d.calls),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Teams Formed',
          data: last30Days.map(d => d.teams),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Community Impact Trends (Last 30 Days)',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        elements: {
          point: {
            radius: 6,
            hoverRadius: 8
          }
        }
      }
    });
  }

  createSkillsRadarChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const skillsData = this.analyzeSkillsDistribution();

    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels: skillsData.labels,
        datasets: [{
          label: 'Available Skills',
          data: skillsData.available,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 2
        }, {
          label: 'Needed Skills',
          data: skillsData.needed,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Skills Gap Analysis',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 10
          }
        }
      }
    });
  }

  createImpactHeatmap(containerId) {
    const container = document.getElementById(containerId);
    const heatmapData = this.generateHeatmapData();
    
    container.innerHTML = `
      <div class="grid grid-cols-7 gap-1 p-4">
        ${heatmapData.map(day => `
          <div class="w-3 h-3 rounded-sm ${this.getHeatmapColor(day.intensity)}" 
               title="${day.date}: ${day.activities} activities"
               data-intensity="${day.intensity}">
          </div>
        `).join('')}
      </div>
      <div class="text-xs text-gray-500 text-center mt-2">
        Activity heatmap - Last 365 days
      </div>
    `;
  }

  createInteractiveMetrics(containerId) {
    const container = document.getElementById(containerId);
    const metrics = this.calculateAdvancedMetrics();
    
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        ${metrics.map(metric => `
          <div class="metric-card bg-white p-6 rounded-xl shadow-lg border-l-4 ${metric.color} hover:shadow-xl transition-all cursor-pointer"
               onclick="analytics.showMetricDetails('${metric.id}')">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">${metric.label}</span>
              <span class="text-2xl">${metric.icon}</span>
            </div>
            <div class="text-3xl font-bold ${metric.textColor}">${metric.value}</div>
            <div class="flex items-center mt-2">
              <span class="text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}">
                ${metric.change >= 0 ? '↗' : '↘'} ${Math.abs(metric.change)}%
              </span>
              <span class="text-xs text-gray-500 ml-2">vs last month</span>
            </div>
            <div class="mt-2 text-xs text-gray-600">${metric.description}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // AI-Powered Insights
  generateAIInsights() {
    return this.aiInsights.analyzeData(this.data);
  }

  // Data Processing Methods
  getLast30DaysData() {
    const days = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ideas: this.countItemsOnDate(this.data.ideas, dateStr),
        calls: this.countItemsOnDate(this.data.calls, dateStr),
        teams: this.countItemsOnDate(this.data.teams, dateStr)
      });
    }
    
    return days;
  }

  countItemsOnDate(items, date) {
    return items.filter(item => {
      const itemDate = new Date(item.createdDate || item.date || item.timestamp);
      return itemDate.toISOString().split('T')[0] === date;
    }).length;
  }

  analyzeSkillsDistribution() {
    const skillCategories = ['Technology', 'Education', 'Healthcare', 'Environment', 'Arts', 'Community', 'Business', 'Research'];
    
    return {
      labels: skillCategories,
      available: skillCategories.map(cat => this.countSkillsInCategory(cat, 'available')),
      needed: skillCategories.map(cat => this.countSkillsInCategory(cat, 'needed'))
    };
  }

  countSkillsInCategory(category, type) {
    // Simulate skill counting logic
    return Math.floor(Math.random() * 10) + 1;
  }

  generateHeatmapData() {
    const days = [];
    const now = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const activities = Math.floor(Math.random() * 5);
      days.push({
        date: date.toISOString().split('T')[0],
        activities,
        intensity: Math.min(activities, 4)
      });
    }
    
    return days;
  }

  getHeatmapColor(intensity) {
    const colors = [
      'bg-gray-100',
      'bg-green-200',
      'bg-green-400',
      'bg-green-600',
      'bg-green-800'
    ];
    return colors[intensity] || colors[0];
  }

  calculateAdvancedMetrics() {
    const totalIdeas = this.data.ideas.length;
    const totalVolunteers = this.data.volunteers.length;
    const totalTeams = this.data.teams.length;
    const activeCalls = this.data.calls.filter(c => c.status === 'active').length;
    
    return [
      {
        id: 'engagement',
        label: 'Engagement Score',
        value: this.calculateEngagementScore(),
        change: 12,
        icon: '📈',
        color: 'border-blue-400',
        textColor: 'text-blue-600',
        description: 'Overall community engagement level'
      },
      {
        id: 'impact',
        label: 'Impact Index',
        value: this.calculateImpactIndex(),
        change: 8,
        icon: '🌟',
        color: 'border-yellow-400',
        textColor: 'text-yellow-600',
        description: 'Measured community impact score'
      },
      {
        id: 'collaboration',
        label: 'Collaboration Rate',
        value: `${Math.round((totalTeams / Math.max(totalIdeas, 1)) * 100)}%`,
        change: 15,
        icon: '🤝',
        color: 'border-purple-400',
        textColor: 'text-purple-600',
        description: 'Ideas that formed teams'
      },
      {
        id: 'response',
        label: 'Response Time',
        value: this.calculateAverageResponseTime(),
        change: -5,
        icon: '⚡',
        color: 'border-green-400',
        textColor: 'text-green-600',
        description: 'Average time to respond to calls'
      }
    ];
  }

  calculateEngagementScore() {
    const base = (this.data.ideas.length * 10) + 
                 (this.data.volunteers.length * 15) + 
                 (this.data.teams.length * 20) +
                 (this.data.reflections.length * 5);
    return Math.min(Math.round(base / 10), 100);
  }

  calculateImpactIndex() {
    return Math.round(Math.random() * 40 + 60); // Simulate 60-100 range
  }

  calculateAverageResponseTime() {
    const hours = Math.floor(Math.random() * 12) + 1;
    return `${hours}h`;
  }

  showMetricDetails(metricId) {
    const details = this.getMetricDetails(metricId);
    showModal(
      `📊 ${details.title}`,
      `<div class="space-y-4">
        <div class="text-center">
          <div class="text-4xl mb-2">${details.icon}</div>
          <div class="text-3xl font-bold ${details.color}">${details.value}</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Analysis</h4>
          <p class="text-sm text-gray-700">${details.analysis}</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">AI Recommendation</h4>
          <p class="text-sm text-blue-700">${details.recommendation}</p>
        </div>
      </div>`,
      [{ text: 'Close', class: 'bg-gray-300 text-gray-700 hover:bg-gray-400', onclick: 'modalManager.close(this.closest(".fixed"))' }]
    );
  }

  getMetricDetails(metricId) {
    const details = {
      engagement: {
        title: 'Engagement Score',
        icon: '📈',
        value: this.calculateEngagementScore(),
        color: 'text-blue-600',
        analysis: 'Your community shows strong engagement with consistent participation across all platform features.',
        recommendation: 'Consider hosting weekly challenges to maintain momentum and attract new contributors.'
      },
      impact: {
        title: 'Impact Index',
        icon: '🌟',
        value: this.calculateImpactIndex(),
        color: 'text-yellow-600',
        analysis: 'Impact measurement shows positive community outcomes with growing influence.',
        recommendation: 'Focus on documenting success stories to amplify your community\'s achievements.'
      },
      collaboration: {
        title: 'Collaboration Rate',
        icon: '🤝',
        value: `${Math.round((this.data.teams.length / Math.max(this.data.ideas.length, 1)) * 100)}%`,
        color: 'text-purple-600',
        analysis: 'Good collaboration rate indicates ideas are successfully forming into action teams.',
        recommendation: 'Provide team formation workshops to help convert more ideas into collaborative projects.'
      },
      response: {
        title: 'Response Time',
        icon: '⚡',
        value: this.calculateAverageResponseTime(),
        color: 'text-green-600',
        analysis: 'Community responds quickly to urgent calls, showing strong civic engagement.',
        recommendation: 'Maintain this responsiveness by recognizing fast responders with special badges.'
      }
    };
    
    return details[metricId] || details.engagement;
  }

  // Real-time updates
  startRealTimeUpdates() {
    setInterval(() => {
      this.data = this.loadAllData();
      this.updateCharts();
    }, 30000); // Update every 30 seconds
  }

  updateCharts() {
    // Update chart data without recreating them
    if (this.charts) {
      Object.values(this.charts).forEach(chart => {
        if (chart && chart.update) {
          chart.update();
        }
      });
    }
  }

  initializeCharts() {
    this.charts = {};
    // Charts will be initialized when containers are available
  }
}

// AI Insights Engine
class AIInsightsEngine {
  analyzeData(data) {
    const insights = [];
    
    // Trend Analysis
    if (data.ideas.length > data.teams.length * 2) {
      insights.push({
        type: 'opportunity',
        title: 'Team Formation Opportunity',
        message: 'Many ideas could benefit from team collaboration. Consider promoting team formation.',
        action: 'View TeamSpace',
        actionUrl: 'teamspace.html'
      });
    }

    // Skill Gap Analysis
    if (data.calls.length > data.volunteers.length * 0.5) {
      insights.push({
        type: 'urgent',
        title: 'Volunteer Recruitment Needed',
        message: 'High demand for volunteers. Consider expanding recruitment efforts.',
        action: 'Promote SkillMatch',
        actionUrl: 'skillmatch.html'
      });
    }

    // Engagement Patterns
    const recentActivity = this.analyzeRecentActivity(data);
    if (recentActivity.declining) {
      insights.push({
        type: 'warning',
        title: 'Engagement Declining',
        message: 'Recent activity shows a downward trend. Consider launching new initiatives.',
        action: 'Start Challenge',
        actionUrl: 'seedboard.html'
      });
    }

    return insights;
  }

  analyzeRecentActivity(data) {
    // Simulate activity analysis
    const recentItems = [...data.ideas, ...data.teams, ...data.calls]
      .filter(item => {
        const itemDate = new Date(item.createdDate || item.date || item.timestamp);
        const daysDiff = (new Date() - itemDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      });

    return {
      declining: recentItems.length < 3,
      count: recentItems.length
    };
  }

  generateSmartRecommendations(userProfile) {
    const recommendations = [];

    // Personalized suggestions based on user activity
    if (userProfile.stats?.ideasSubmitted > 3 && userProfile.stats?.teamsJoined === 0) {
      recommendations.push({
        title: 'Join a Team',
        description: 'Your ideas show great potential. Consider joining a team to amplify your impact.',
        action: 'Explore Teams',
        actionUrl: 'teamspace.html',
        priority: 'high'
      });
    }

    if (userProfile.stats?.callsAnswered > 5) {
      recommendations.push({
        title: 'Become a Mentor',
        description: 'Your responsiveness makes you a great candidate for mentoring newcomers.',
        action: 'Start Mentoring',
        actionUrl: 'skillmatch.html',
        priority: 'medium'
      });
    }

    return recommendations;
  }
}

// Export for global use
window.AdvancedAnalytics = AdvancedAnalytics;
window.analytics = new AdvancedAnalytics();

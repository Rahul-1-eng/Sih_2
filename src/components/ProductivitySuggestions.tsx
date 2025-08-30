import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Briefcase, Code, Clock, ArrowRight } from 'lucide-react';
import { mockProductivitySuggestions, type ProductivitySuggestion } from '@/lib/mockData';

interface ProductivitySuggestionsProps {
  studentInterests?: string[];
  careerGoals?: string[];
  freeTimeSlots?: string[];
}

export default function ProductivitySuggestions({ 
  studentInterests = [], 
  careerGoals = [], 
  freeTimeSlots = [] 
}: ProductivitySuggestionsProps) {
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'academic':
        return <BookOpen className="h-4 w-4" />;
      case 'career':
        return <Briefcase className="h-4 w-4" />;
      case 'skill':
        return <Code className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'career':
        return 'bg-green-100 text-green-800';
      case 'skill':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter suggestions based on student profile (simplified logic)
  const personalizedSuggestions = mockProductivitySuggestions.filter(suggestion => {
    if (suggestion.type === 'skill') {
      return studentInterests.some(interest => 
        suggestion.title.toLowerCase().includes(interest.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(interest.toLowerCase())
      );
    }
    return true;
  }).slice(0, 4);

  const currentHour = new Date().getHours();
  const isFreePeriod = freeTimeSlots.length > 0 || (currentHour >= 10 && currentHour <= 11) || (currentHour >= 15 && currentHour <= 16);

  return (
    <div className="space-y-6">
      {/* Free Time Alert */}
      {isFreePeriod && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Free Period Detected!</h3>
            </div>
            <p className="text-blue-700 text-sm">
              You have some free time now. Here are some productive activities you can do:
            </p>
          </CardContent>
        </Card>
      )}

      {/* Suggestions Grid */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Productivity Suggestions</h2>
          <Badge variant="outline" className="text-xs">
            Personalized for you
          </Badge>
        </div>

        {personalizedSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getIconForType(suggestion.type)}
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(suggestion.type)} variant="secondary">
                    {suggestion.type}
                  </Badge>
                  <Badge className={getPriorityColor(suggestion.priority)} variant="outline">
                    {suggestion.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base">
                {suggestion.description}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{suggestion.estimatedTime}</span>
                </div>
                
                <Button size="sm" variant="outline">
                  Start Task
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you can complete in your free time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Review Notes
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Briefcase className="h-4 w-4 mr-2" />
              Update Resume
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Code className="h-4 w-4 mr-2" />
              Practice Coding
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Plan Tomorrow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
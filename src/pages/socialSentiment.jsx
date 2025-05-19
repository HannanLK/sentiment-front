import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, Search, TrendingUp, TrendingDown, MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell } from "recharts";

export default function SocialSentiment() {
  const [keyword, setKeyword] = useState("");
  const [trendData, setTrendData] = useState(null);
  const [platformComparison, setPlatformComparison] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [engagementPatterns, setEngagementPatterns] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState({
    trend: false,
    platform: false,
    engagement: false
  });
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchKeywordTrend = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword to track",
        variant: "destructive"
      });
      return;
    }

    setLoading(prev => ({ ...prev, trend: true }));
    setError(null);
    try {
      const response = await api.get(`/social-media/trends/keyword/${keyword}`);
      setTrendData(response.data);
      toast({
        title: "Success",
        description: "Trend data updated successfully",
      });
    } catch (error) {
      console.error("Error fetching keyword trend:", error);
      setError("Failed to fetch trend data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch trend data",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, trend: false }));
    }
  };

  const fetchPlatformComparison = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword to compare",
        variant: "destructive"
      });
      return;
    }

    setLoading(prev => ({ ...prev, platform: true }));
    setError(null);
    try {
      const response = await api.get(`/social-media/trends/platform-comparison/${keyword}`);
      setPlatformComparison(response.data);
      toast({
        title: "Success",
        description: "Platform comparison updated successfully",
      });
    } catch (error) {
      console.error("Error fetching platform comparison:", error);
      setError("Failed to fetch platform comparison. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch platform comparison",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, platform: false }));
    }
  };

  const fetchEngagementPatterns = async (postId) => {
    setLoading(prev => ({ ...prev, engagement: true }));
    try {
      const response = await api.get(`/social-media/${postId}/engagement-patterns`);
      setEngagementPatterns(response.data);
    } catch (error) {
      console.error("Error fetching engagement patterns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch engagement patterns",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, engagement: false }));
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchEngagementPatterns(post.id);
    setIsDrawerOpen(true);
  };

  const renderTrendMetrics = (metrics) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Object.entries(metrics).map(([key, value]) => (
        <Card key={key} className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace('_', ' ')}
                </p>
                <p className="text-2xl font-bold mt-1">
                  {value > 0 ? "↑" : "↓"}
                  {Math.abs(value).toFixed(2)}
                </p>
              </div>
              {value > 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter keyword to track..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={fetchKeywordTrend}
                  disabled={loading.trend}
                  className="flex-1 sm:flex-none"
                >
                  {loading.trend ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Track Keyword
                    </>
                  )}
                </Button>
                <Button 
                  onClick={fetchPlatformComparison}
                  variant="outline"
                  disabled={loading.platform}
                  className="flex-1 sm:flex-none"
                >
                  {loading.platform ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Compare Platforms"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="trends" className="flex-1 sm:flex-none">Trends</TabsTrigger>
            <TabsTrigger value="platforms" className="flex-1 sm:flex-none">Platform Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            {loading.trend ? (
              <div className="space-y-4">
                <Skeleton className="h-[400px] w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </div>
            ) : trendData ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Keyword Trend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={Object.entries(trendData.daily_stats).map(([date, stats]) => ({
                          date,
                          posts: stats.post_count,
                          sentiment: stats.avg_sentiment,
                          engagements: stats.total_engagements
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="posts" stroke="#8884d8" />
                          <Line type="monotone" dataKey="sentiment" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="engagements" stroke="#ffc658" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {renderTrendMetrics(trendData.trend_metrics)}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    Enter a keyword and click "Track Keyword" to see trend analysis
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4">
            {loading.platform ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[200px] w-full" />
                ))}
              </div>
            ) : platformComparison ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(platformComparison.platform_comparison).map(([platform, stats]) => (
                  <Card key={platform}>
                    <CardHeader>
                      <CardTitle className="capitalize flex items-center justify-between">
                        {platform}
                        <Badge variant={stats.total_engagements > 1000 ? "default" : "secondary"}>
                          {stats.total_engagements > 1000 ? "High Engagement" : "Low Engagement"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Posts</span>
                          <span className="font-medium">{stats.total_posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Avg Sentiment</span>
                          <span className="font-medium">{stats.avg_sentiment.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Engagements</span>
                          <span className="font-medium">{stats.total_engagements}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Post Trend</span>
                          <span className={`font-medium ${stats.post_trend > 0 ? "text-green-500" : "text-red-500"}`}>
                            {stats.post_trend > 0 ? "↑" : "↓"} {Math.abs(stats.post_trend).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Sentiment Trend</span>
                          <span className={`font-medium ${stats.sentiment_trend > 0 ? "text-green-500" : "text-red-500"}`}>
                            {stats.sentiment_trend > 0 ? "↑" : "↓"} {Math.abs(stats.sentiment_trend).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Engagement Trend</span>
                          <span className={`font-medium ${stats.engagement_trend > 0 ? "text-green-500" : "text-red-500"}`}>
                            {stats.engagement_trend > 0 ? "↑" : "↓"} {Math.abs(stats.engagement_trend).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    Enter a keyword and click "Compare Platforms" to see platform comparison
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="max-h-[90vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>Post Analysis</DrawerTitle>
              <DrawerDescription>
                Detailed analysis of post engagement patterns
              </DrawerDescription>
            </DrawerHeader>
            {loading.engagement ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-[200px] w-full" />
                </div>
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : selectedPost && engagementPatterns ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Post Content</h3>
                  <p className="text-gray-600">{selectedPost.content}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.entries(engagementPatterns.engagement_types).map(([type, data]) => (
                        <div key={type} className="mb-2">
                          <div className="flex justify-between items-center">
                            <p className="capitalize font-medium">{type}</p>
                            <Badge variant="outline">
                              {data.reduce((sum, item) => sum + item.count, 0)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement Velocity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.entries(engagementPatterns.engagement_velocity).map(([type, velocity]) => (
                        <div key={type} className="mb-2">
                          <div className="flex justify-between items-center">
                            <p className="capitalize font-medium">{type}</p>
                            <Badge variant={velocity > 1 ? "default" : "secondary"}>
                              {velocity.toFixed(2)}/s
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Object.entries(engagementPatterns.engagement_types).flatMap(([type, data]) =>
                      data.map(item => ({
                        timestamp: item.timestamp,
                        type,
                        count: item.count
                      }))
                    )}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(engagementPatterns.engagement_types).map((type, index) => (
                        <Line
                          key={type}
                          type="monotone"
                          dataKey="count"
                          data={engagementPatterns.engagement_types[type]}
                          name={type}
                          stroke={`hsl(${index * 120}, 70%, 50%)`}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : null}
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

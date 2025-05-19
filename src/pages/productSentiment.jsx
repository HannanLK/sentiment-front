import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, ShoppingBag, Star } from "lucide-react";
import { api } from "@/lib/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ProductSentiment() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const analyzeProduct = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a product URL",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/product-analysis/scrape", { url });
      setProduct(response.data);
      toast({
        title: "Success",
        description: "Product analyzed successfully",
      });
    } catch (error) {
      console.error("Error analyzing product:", error);
      setError("Failed to analyze product. Please check the URL and try again.");
      toast({
        title: "Error",
        description: "Failed to analyze product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Product Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter product URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={analyzeProduct}
                disabled={loading || !url.trim()}
                className="flex-1 sm:flex-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Product"
                )}
              </Button>
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

        {loading ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : product && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="overview" className="flex-1 sm:flex-none">Overview</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 sm:flex-none">Reviews</TabsTrigger>
              <TabsTrigger value="recommendations" className="flex-1 sm:flex-none">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Name</h3>
                      <p>{product.name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Price</h3>
                      <p>${product.price}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Average Rating</h3>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <p>{product.average_rating.toFixed(1)} / 5.0</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Total Reviews</h3>
                      <Badge variant="outline">
                        {product.total_reviews} reviews
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(product.sentiment_distribution).map(([name, value]) => ({
                              name,
                              value: value * 100
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.entries(product.sentiment_distribution).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emotion Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(product.emotion_distribution).map(([emotion, score]) => (
                        <div key={emotion}>
                          <div className="flex justify-between mb-1">
                            <span className="capitalize">{emotion}</span>
                            <Badge variant="outline">
                              {(score * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <Progress value={score * 100} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col sm:flex-row justify-between mb-2">
                            <div>
                              <p className="font-medium">{review.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <p className="text-sm text-gray-500">
                                  {review.rating} / 5.0
                                </p>
                              </div>
                            </div>
                            <div className="text-right mt-2 sm:mt-0">
                              <p className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </p>
                              <Badge variant={
                                review.sentiment_score > 0.3
                                  ? "default"
                                  : review.sentiment_score < -0.3
                                  ? "destructive"
                                  : "secondary"
                              }>
                                {review.sentiment_score > 0.3
                                  ? "Positive"
                                  : review.sentiment_score < -0.3
                                  ? "Negative"
                                  : "Neutral"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Similar Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.recommendations.map((rec) => (
                      <Card key={rec.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between mb-2">
                            <div>
                              <p className="font-medium">{rec.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <p className="text-sm text-gray-500">
                                  {rec.average_rating.toFixed(1)} / 5.0
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">
                              ${rec.price}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="secondary">
                              {rec.total_reviews} reviews
                            </Badge>
                            <Badge variant={rec.similarity_score > 0.7 ? "default" : "secondary"}>
                              {rec.similarity_score.toFixed(2)} similarity
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

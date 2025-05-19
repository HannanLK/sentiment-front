import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { api } from "@/lib/api";
import { Loader2, Copy, Download, ChevronDown, ChevronUp } from "lucide-react";

const styleOptions = [
  {
    value: "formal",
    label: "Formal",
    description: "Professional and formal language suitable for business documents"
  },
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed and conversational tone for informal communication"
  },
  {
    value: "professional",
    label: "Professional",
    description: "Business-appropriate language with a professional touch"
  },
  {
    value: "marketing",
    label: "Marketing",
    description: "Engaging and persuasive language for marketing materials"
  },
  {
    value: "technical",
    label: "Technical",
    description: "Detailed and precise language for technical documentation"
  },
  {
    value: "simplified",
    label: "Simplified",
    description: "Clear and simple language for easy understanding"
  }
];

export function TextStyleEnhancement({ originalText }) {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleEnhance = async () => {
    if (!selectedStyle) {
      toast({
        title: "Error",
        description: "Please select a style",
        variant: "destructive"
      });
      return;
    }

    if (!originalText?.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to enhance",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/text/enhance", {
        text: originalText,
        style: selectedStyle
      });
      setEnhancedText(response.data.enhanced_text);
      setIsExpanded(true);
      toast({
        title: "Success",
        description: "Text enhanced successfully"
      });
    } catch (error) {
      console.error("Error enhancing text:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to enhance text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedText);
    toast({
      title: "Success",
      description: "Text copied to clipboard"
    });
  };

  const handleDownload = () => {
    const blob = new Blob([enhancedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enhanced-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Text Style Enhancement</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Style</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-sm text-gray-500">{style.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleEnhance}
              disabled={loading || !selectedStyle || !originalText?.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                "Enhance Text"
              )}
            </Button>

            {isExpanded && enhancedText && (
              <div className="space-y-4">
                <Textarea
                  value={enhancedText}
                  readOnly
                  className="min-h-[200px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
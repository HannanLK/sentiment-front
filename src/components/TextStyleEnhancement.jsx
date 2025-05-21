import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { api } from "@/lib/api";
import { Loader2, Copy, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const styleOptions = [
  { value: 'technical', label: 'Technical' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'academic', label: 'Academic' },
  { value: 'poetic', label: 'Poetic' }
];

export function TextStyleEnhancement({ originalText }) {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    setError(null);
    try {
      const response = await api.post("/text/enhance", {
        text: originalText,
        style: selectedStyle
      });
      
      if (response.data && response.data.enhancedText) {
        setEnhancedText(response.data.enhancedText);
        toast({
          title: "Success",
          description: "Text enhanced successfully"
        });
      } else {
        console.error("Invalid response format:", response.data);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error enhancing text:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to enhance text. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!enhancedText) return;
    
    navigator.clipboard.writeText(enhancedText);
    toast({
      title: "Success",
      description: "Text copied to clipboard"
    });
  };

  const handleDownload = (format) => {
    if (!enhancedText) return;

    let blob;
    let filename;
    let mimeType;

    switch (format) {
      case 'txt':
        blob = new Blob([enhancedText], { type: 'text/plain' });
        filename = 'enhanced-text.txt';
        mimeType = 'text/plain';
        break;
      case 'csv':
        const csvContent = `Original Text,Enhanced Text\n"${originalText}","${enhancedText}"`;
        blob = new Blob([csvContent], { type: 'text/csv' });
        filename = 'enhanced-text.csv';
        mimeType = 'text/csv';
        break;
      case 'docx':
        const htmlContent = `
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Enhanced Text</title>
            </head>
            <body>
              <h2>Original Text:</h2>
              <p>${originalText}</p>
              <h2>Enhanced Text:</h2>
              <p>${enhancedText}</p>
            </body>
          </html>
        `;
        blob = new Blob([htmlContent], { type: 'application/msword' });
        filename = 'enhanced-text.doc';
        mimeType = 'application/msword';
        break;
      default:
        return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          <CardTitle className="text-xl sm:text-2xl">Text Enhancement</CardTitle>
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Choose a style" />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}
        
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

        {enhancedText && (
          <div className="space-y-4">
            <Textarea
              value={enhancedText}
              readOnly
              className="min-h-[200px] w-full resize-none font-roboto text-base"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download as File
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => handleDownload('txt')}>
                    Text File (.txt)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('csv')}>
                    Spreadsheet (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('docx')}>
                    Document (.doc)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
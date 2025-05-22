import { Card, CardContent } from '@/components/ui/card';

const WelcomeMessage = () => (
  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-none">
    <CardContent className="pt-6">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to <span className="font-logo font-bold">VibeCheck</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Unlock AI-driven sentiment, emotion, and insight analysis in seconds.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <span className="font-semibold">AUTO-DETECT & PREVIEW</span>
            <p>Instantly recognize social links and show live previews</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <span className="font-semibold">COMMENT SENTIMENT</span>
            <p>Analyze the emotional tone of comments & reactions</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <span className="font-semibold">VISUAL INSIGHTS</span>
            <p>Get clear, visual breakdowns of sentiment patterns</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default WelcomeMessage; 
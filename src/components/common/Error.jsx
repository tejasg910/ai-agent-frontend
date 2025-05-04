import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ErrorAlert() {
  return (
    <Alert variant="destructive" className="bg-orange-50 text-orange-800 border-orange-300">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-700 font-medium">Error</AlertTitle>
      <AlertDescription className="text-orange-600">
        There was an error while fetching jobs. Please try again later.
      </AlertDescription>
    </Alert>
  );
}
import { AlertTriangle, Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InvalidUrlCard() {
  return (
    <Card className="w-full max-w-lg mt-24 mx-auto border-orange-300 shadow-lg">
      <CardHeader className="bg-orange-50 border-b border-orange-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          <h2 className="text-2xl font-bold text-orange-800">Invalid URL</h2>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4">
        <div className="space-y-4">
          <p className="text-orange-700 text-lg">
            The URL you've accessed is invalid or has expired. Please contact your recruiter for assistance.
          </p>
          
          <div className="bg-orange-50 p-4 rounded-md border border-orange-200 flex items-center gap-3">
            <Mail className="h-5 w-5 text-orange-600 flex-shrink-0" />
            <p className="text-orange-700">
              Your recruiter will be able to provide you with the correct link to continue your application process.
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-orange-50 border-t border-orange-200 flex justify-between">
        {/* <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button> */}
        {/* <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium">
          <Mail className="mr-2 h-4 w-4" />
          Contact Recruiter
        </Button> */}
      </CardFooter>
    </Card>
  );
}
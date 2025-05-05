"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  DollarSign,
  Mail,
  Clock,
  Briefcase,
  Star,
  Save,
  X,
  Plus,
  Check,
  Calendar,
  MapPin,
  Info,
  AlertCircle,
  IndianRupeeIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllJobs } from "@/api/hooks/jobs/useGetAllJobs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import VoiceEnabledAboutField from "./VoiceEnableAbout";
import { useGetAllJobsForCandidates } from "@/api/hooks/jobs/useGetAllJobsForCandidates";

export default function CandidateForm({
  candidate,
  id, 
  onSubmit,
  isSubmitting,
  isEdit,
}) {
  const router = useRouter();
  const { data: jobs = [] } = useGetAllJobsForCandidates({}, id);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: candidate?.name || "",
    phone: candidate?.phone || "",
    email: candidate?.email || "",
    about: candidate?.about || "",
    current_ctc: candidate?.current_ctc || "",
    expected_ctc: candidate?.expected_ctc || "",
    notice_period: candidate?.notice_period || "",
    experience: candidate?.experience || "",
    location_preference: candidate?.location_preference || "flexible",
    status: candidate?.status || "pending",
    jobAssignment: candidate?.jobAssignment || null,
    available: candidate?.available ? new Date(candidate.available) : null,
    last_contact: candidate?.last_contact
      ? new Date(candidate.last_contact)
      : null,
    ratings: candidate?.ratings || [],
  });

  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    // If editing and job is assigned, find the job details
    if (candidate?.jobAssignment && jobs.length > 0) {
      const job = jobs.find((j) => j._id === candidate.jobAssignment);
      if (job) {
        setSelectedJob(job);
      }
    }
  }, [candidate, jobs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (value, country) => {
    console.log(country, value, "this is value");
    const phone = country.dialCode + value;
    setFormData((prev) => ({ ...prev, phone: value }));

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);

    // Initialize ratings array with job skills if not already rated
    const newRatings = job.skills.map((skill) => {
      const existingRating = formData.ratings.find(
        (r) => r.skill === skill._id
      );
      return existingRating || { skill: skill._id, rating: 0 };
    });

    setFormData((prev) => ({
      ...prev,
      jobAssignment: job._id,
      ratings: newRatings,
    }));

    if (errors.jobAssignment) {
      setErrors((prev) => ({ ...prev, jobAssignment: "" }));
    }

    setJobOpen(false);
  };

  const handleRatingChange = (skillId, rating) => {
    setFormData((prev) => ({
      ...prev,
      ratings: prev.ratings.map((r) =>
        r.skill === skillId ? { ...r, rating } : r
      ),
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 6) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.about.trim()) {
      newErrors.about = "About information is required";
    }

    if (!formData.current_ctc.trim()) {
      newErrors.current_ctc = "Current CTC is required";
    }
    if (!formData.available) {
      newErrors.available = "Avaibility is required";
    }
    if (!formData.expected_ctc.trim()) {
      newErrors.expected_ctc = "Expected CTC is required";
    }

    if (!formData.notice_period.trim()) {
      newErrors.notice_period = "Notice period is required";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.jobAssignment) {
      newErrors.jobAssignment = "Job assignment is required";
    }

    // Validate ratings if job is assigned
    if (formData.jobAssignment && formData.ratings.length > 0) {
      // Check if any ratings are 0 (not rated)
      const unratedSkills = formData.ratings.filter((r) => r.rating === 0);
      if (unratedSkills.length > 0) {
        newErrors.ratings = "All skills must be rated (1-5)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validate()) {
      // Format and clean data before submission
      const submissionData = {
        ...formData,
        current_ctc: parseFloat(formData.current_ctc) || 0,
        expected_ctc: parseFloat(formData.expected_ctc) || 0,
        experience: parseInt(formData.experience, 10) || 0,
        source: "form",
      };

      onSubmit(submissionData);
    }
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-orange-500">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
          <User className="mr-2 h-5 w-5 text-orange-500" />
          {candidate ? "Edit Candidate Profile" : "Add New Candidate"}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Label
              htmlFor="name"
              className="text-sm font-medium flex items-center text-gray-700"
            >
              <User className="mr-2 h-4 w-4 text-orange-500" />
              Full Name*
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`transition-all ${
                errors.name
                  ? "border-red-300 ring-1 ring-red-300"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              }`}
              placeholder="Enter candidate's full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <X className="mr-1 h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center text-gray-700"
              >
                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                Phone Number*
              </Label>
              <div className={`${errors.phone ? "phone-input-error" : ""}`}>
                <PhoneInput
                  country={"in"} // Default to India
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "phone",
                    id: "phone",
                    required: true,
                    className:
                      "w-full focus:border-orange-500 focus:ring-orange-500",
                  }}
                  inputStyle={{
                    padding: "5px 15px",
                    border: "1px solid #e6e8ec",
                    borderRadius: "10px",
                  }}
                  enableSearch
                  searchPlaceholder="Search countries..."
                  placeholder="Enter mobile"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-sm font-medium flex items-center text-gray-700"
              >
                <Mail className="mr-2 h-4 w-4 text-orange-500" />
                Email Address*
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`transition-all ${
                  errors.email
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* <div className="space-y-1">
            <Label
              htmlFor="about"
              className="text-sm font-medium flex items-center text-gray-700"
            >
              <Info className="mr-2 h-4 w-4 text-orange-500" />
              About the Candidate*
            </Label>
            <Textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              className={`transition-all ${
                errors.about
                  ? "border-red-300 ring-1 ring-red-300"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              }`}
              placeholder="Brief description, background, or notes about the candidate"
              rows={3}
            />
            {errors.about && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <X className="mr-1 h-4 w-4" />
                {errors.about}
              </p>
            )}
          </div> */}

          <VoiceEnabledAboutField
            value={formData.about}
            onChange={handleChange}
            error={!!errors.about}
            errorMessage={errors.about}
          />

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label
                htmlFor="current_ctc"
                className="text-sm font-medium flex items-center text-gray-700"
              >
                <IndianRupeeIcon className="mr-2 h-4 w-4 text-orange-500" />
                Current CTC (INR)*
              </Label>
              <Input
                id="current_ctc"
                name="current_ctc"
                value={formData.current_ctc}
                type="number"
                onChange={handleChange}
                className={`transition-all ${
                  errors.current_ctc
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                }`}
                placeholder="Enter current salary"
              />
              {errors.current_ctc && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.current_ctc}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="expected_ctc"
                className="text-sm font-medium flex items-center text-gray-700"
              >
                <IndianRupeeIcon className="mr-2 h-4 w-4 text-orange-500" />
                Expected CTC (INR)*
              </Label>
              <Input
                id="expected_ctc"
                name="expected_ctc"
                type="number"
                value={formData.expected_ctc}
                onChange={handleChange}
                className={`transition-all ${
                  errors.expected_ctc
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                }`}
                placeholder="Enter expected salary (50000)"
              />
              {errors.expected_ctc && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.expected_ctc}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="notice_period"
                className="text-sm font-medium flex items-center text-gray-700"
              >
                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                Notice Period*
              </Label>
              <Input
                id="notice_period"
                name="notice_period"
                value={formData.notice_period}
                onChange={handleChange}
                className={`transition-all ${
                  errors.notice_period
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                }`}
                placeholder="e.g., 30 days, 2 months"
              />
              {errors.notice_period && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.notice_period}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="experience"
                className="text-sm font-medium flex items-center text-gray-700"
              >
                <Briefcase className="mr-2 h-4 w-4 text-orange-500" />
                Experience (Years)*
              </Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                className={`transition-all ${
                  errors.experience
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                }`}
                placeholder="Enter years of experience"
              />
              {errors.experience && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.experience}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label
                htmlFor="location_preference"
                className="text-sm font-medium flex items-center text-gray-700"
              >
                <MapPin className="mr-2 h-4 w-4 text-orange-500" />
                Location Preference
              </Label>
              <Select
                value={formData.location_preference}
                onValueChange={(value) =>
                  handleSelectChange("location_preference", value)
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Select location preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center text-gray-700">
                <Calendar className="mr-2 h-4 w-4 text-orange-500" />
                Can start on
              </Label>
              <DatePicker
                date={formData.available}
                onSelect={(date) => handleDateChange("available", date)}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                className={
                  errors.available
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                }
              />

              {errors.available && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.available}
                </p>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center text-gray-700">
              <Briefcase className="mr-2 h-4 w-4 text-orange-500" />
              Job Assignment*
            </Label>

            <Popover open={jobOpen} onOpenChange={setJobOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full justify-start text-left font-normal ${
                    errors.jobAssignment
                      ? "border-red-300 ring-1 ring-red-300"
                      : "border-gray-300"
                  }`}
                >
                  {selectedJob ? (
                    <span>{selectedJob.title}</span>
                  ) : (
                    <span className="text-gray-400">Select a job position</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search jobs..."
                    className="h-9"
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>No jobs found</CommandEmpty>
                    <CommandGroup>
                      {filteredJobs.map((job) => (
                        <CommandItem
                          key={job._id}
                          onSelect={() => handleSelectJob(job)}
                          className="flex items-center justify-between"
                        >
                          {job.title}
                          {formData.jobAssignment === job._id && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.jobAssignment && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <X className="mr-1 h-4 w-4" />
                {errors.jobAssignment}
              </p>
            )}
          </div>

          {/* Skill Ratings - Only visible when job is selected */}
          {selectedJob && formData.jobAssignment && (
            <>
              <Separator className="my-4" />

              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center text-gray-700">
                  <Star className="mr-2 h-4 w-4 text-orange-500" />
                  Skill Ratings*
                </Label>

                <div className="space-y-4">
                  {selectedJob.skills.map((skill, index) => {
                    const skillId = skill._id;
                    const ratingObj = formData.ratings.find(
                      (r) => r.skill === skillId
                    );
                    const currentRating = ratingObj ? ratingObj.rating : 0;

                    return (
                      <div key={skillId} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {skill.name || skill}
                          </span>
                          <span className="text-sm text-gray-500">
                            {currentRating}/5
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(skillId, star)}
                              className={`rounded-full p-1 focus:outline-none ${
                                currentRating >= star
                                  ? "text-yellow-400 hover:text-yellow-500"
                                  : "text-gray-300 hover:text-yellow-300"
                              }`}
                            >
                              <Star className="h-5 w-5 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.ratings && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <X className="mr-1 h-4 w-4" />
                    {errors.ratings}
                  </p>
                )}
              </div>
            </>
          )}

          {formSubmitted && Object.keys(errors).length > 0 && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTitle className="text-red-800 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                Please fix the errors
              </AlertTitle>
              <AlertDescription className="text-red-700">
                There are some validation errors in the form. Please correct
                them before submitting.
              </AlertDescription>
            </Alert>
          )}

          {formSubmitted && Object.keys(errors).length === 0 && (
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle className="text-green-800 flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Form is ready to submit
              </AlertTitle>
              <AlertDescription className="text-green-700">
                All fields have been successfully validated.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>

      <CardFooter className="bg-gray-50 flex justify-end space-x-3 py-4 px-6 border-t border-gray-100">
        {/* <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button> */}
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {candidate ? "Update Candidate" : "Save Candidate"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

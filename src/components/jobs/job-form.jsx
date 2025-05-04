'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, FileText, ListChecks, Save, X, Search, Tag, Check, Plus, 
  MapPin, Clock, IndianRupee, BarChart 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetAllSkills } from '@/api/hooks/skills/useGetAllSkills';

export default function JobForm({ job, onSubmit, isSubmitting, isEdit }) {
  const router = useRouter();
  const { data: skills = [] } = useGetAllSkills();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    requirements: job?.requirements || '',
    min_experience: job?.min_experience || 0,
    ctc_range: {
      min: job?.ctc_range?.min || '',
      max: job?.ctc_range?.max || ''
    },
    location: job?.location || '',
    job_type: job?.job_type || 'onsite',
    skills: job?.skills || [],
  });
  
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties for ctc_range
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectSkill = (skill) => {
    // Check if skill already exists
    if (formData.skills.some(s => s._id === skill._id)) {
      return;
    }
    
    // Only allow up to 5 skills
    if (formData.skills.length >= 5) {
      setErrors(prev => ({ ...prev, skills: 'Maximum 5 skills allowed' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    
    // Clear skills error if we now have at least one skill
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
    
    setOpen(false);
  };
  
  const removeSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill._id !== skillId)
    }));
    
    // Add error if no skills left
    if (formData.skills.length <= 1) {
      setErrors(prev => ({ ...prev, skills: 'At least one skill is required' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Job requirements are required';
    }

    if (formData.min_experience === '' || formData.min_experience < 0) {
      newErrors.min_experience = 'Valid minimum experience is required';
    }

    if (formData.ctc_range.min === '' || isNaN(formData.ctc_range.min) || Number(formData.ctc_range.min) <= 0) {
      newErrors['ctc_range.min'] = 'Valid minimum salary is required';
    }
    
    if (formData.ctc_range.max === '' || isNaN(formData.ctc_range.max) || Number(formData.ctc_range.max) <= 0) {
      newErrors['ctc_range.max'] = 'Valid maximum salary is required';
    }
    
    if (Number(formData.ctc_range.min) >= Number(formData.ctc_range.max)) {
      newErrors['ctc_range.max'] = 'Maximum salary must be greater than minimum salary';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Job location is required';
    }
    
    if (!formData.job_type) {
      newErrors.job_type = 'Job type is required';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    } else if (formData.skills.length !== 5) {
      newErrors.skills = 'Exactly 5 skills must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validate()) {
      // Format data for submission
      const formattedData = {
        ...formData,
        min_experience: Number(formData.min_experience),
        ctc_range: {
          min: Number(formData.ctc_range.min),
          max: Number(formData.ctc_range.max)
        },
        skills: formData.skills.map(skill => skill._id)
      };
      onSubmit(formattedData);
    }
  };
  
  // Filter skills based on search term
  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="w-full shadow-lg border-t-4 border-t-orange-500">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
          <Briefcase className="mr-2 h-5 w-5 text-orange-500" />
          {job ? 'Edit Job Listing' : 'Create New Job Listing'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm font-medium flex items-center text-gray-700">
              <Briefcase className="mr-2 h-4 w-4 text-orange-500" />
              Job Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`transition-all ${
                errors.title ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="Enter job position title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <X className="mr-1 h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="location" className="text-sm font-medium flex items-center text-gray-700">
                <MapPin className="mr-2 h-4 w-4 text-orange-500" />
                Job Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`transition-all ${
                  errors.location ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                }`}
                placeholder="City, Country or Remote"
              />
              {errors.location && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.location}
                </p>
              )}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="job_type" className="text-sm font-medium flex items-center text-gray-700">
                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                Job Type
              </Label>
              <Select 
                value={formData.job_type} 
                onValueChange={(value) => handleSelectChange('job_type', value)}
              >
                <SelectTrigger 
                  className={`w-full ${
                    errors.job_type ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                >
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.job_type && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.job_type}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="min_experience" className="text-sm font-medium flex items-center text-gray-700">
                <BarChart className="mr-2 h-4 w-4 text-orange-500" />
                Minimum Experience (years)
              </Label>
              <Input
                id="min_experience"
                name="min_experience"
                type="number"
                min="0"
                value={formData.min_experience}
                onChange={handleChange}
                className={`transition-all ${
                  errors.min_experience ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                }`}
                placeholder="0"
              />
              {errors.min_experience && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors.min_experience}
                </p>
              )}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="ctc_range.min" className="text-sm font-medium flex items-center text-gray-700">
                <IndianRupee className="mr-2 h-4 w-4 text-orange-500" />
                Min Salary (Annual)
              </Label>
              <Input
                id="ctc_range.min"
                name="ctc_range.min"
                type="number"
                min="1"
                value={formData.ctc_range.min}
                onChange={handleChange}
                className={`transition-all ${
                  errors['ctc_range.min'] ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                }`}
                placeholder="Minimum salary"
              />
              {errors['ctc_range.min'] && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors['ctc_range.min']}
                </p>
              )}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="ctc_range.max" className="text-sm font-medium flex items-center text-gray-700">
                <IndianRupee className="mr-2 h-4 w-4 text-orange-500" />
                Max Salary (Annual)
              </Label>
              <Input
                id="ctc_range.max"
                name="ctc_range.max"
                type="number"
                min="1"
                value={formData.ctc_range.max}
                onChange={handleChange}
                className={`transition-all ${
                  errors['ctc_range.max'] ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                }`}
                placeholder="Maximum salary"
              />
              {errors['ctc_range.max'] && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <X className="mr-1 h-4 w-4" />
                  {errors['ctc_range.max']}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description" className="text-sm font-medium flex items-center text-gray-700">
              <FileText className="mr-2 h-4 w-4 text-orange-500" />
              Job Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`transition-all ${
                errors.description ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="Describe the responsibilities and duties of this position"
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <X className="mr-1 h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="requirements" className="text-sm font-medium flex items-center text-gray-700">
              <ListChecks className="mr-2 h-4 w-4 text-orange-500" />
              Job Requirements
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className={`transition-all ${
                errors.requirements ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="List qualifications, experience, and skills required"
            />
            {errors.requirements && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <X className="mr-1 h-4 w-4" />
                {errors.requirements}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center text-gray-700">
              <Tag className="mr-2 h-4 w-4 text-orange-500" />
              Required Skills <span className="text-xs text-gray-500 ml-1">(Select exactly 5)</span>
            </Label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map(skill => (
                <Badge 
                  key={skill._id} 
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1 flex items-center gap-1"
                >
                  {skill.name}
                  <X 
                    className="h-3 w-3 cursor-pointer ml-1" 
                    onClick={() => removeSkill(skill._id)}
                  />
                </Badge>
              ))}
              
              {formData.skills.length < 5 && (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 border-dashed border-gray-300 text-gray-500 hover:text-orange-500 hover:border-orange-300"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Skill {formData.skills.length}/5
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search skills..." 
                        className="h-9"
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandList>
                        <CommandEmpty>No skills found</CommandEmpty>
                        <CommandGroup>
                          {filteredSkills.map(skill => (
                            <CommandItem
                              key={skill._id}
                              onSelect={() => handleSelectSkill(skill)}
                              className="flex items-center justify-between"
                            >
                              {skill.name}
                              {formData.skills.some(s => s._id === skill._id) && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            
            {errors.skills && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <X className="mr-1 h-4 w-4" />
                {errors.skills}
              </p>
            )}
            
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-xs text-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                The job listing requires exactly 5 skills to be selected.
              </p>
            </div>
          </div>
          
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
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {job ? 'Update Job' : 'Create Job'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
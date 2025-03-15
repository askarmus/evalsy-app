import { showToast } from "@/app/utils/toastUtils";
import { deleteResume, fetchResumes, processResumeById, uploadResume } from "@/services/resume.service";
import { Button, getKeyValue, Drawer, DrawerBody, DrawerContent, DrawerHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Input, CheckboxGroup, Checkbox, Card, CardBody, Chip, DrawerFooter, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineDelete, AiOutlineDownload, AiOutlineExperiment, AiOutlineEye, AiOutlineUpload } from "react-icons/ai";
import { ToastContainer } from "react-toastify";

export default function JobResumes({ jobId, isOpen, onClose }: { jobId: string; isOpen: boolean; onClose: () => void }) {
  const [resumes, setResumes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [processingRows, setProcessingRows] = useState<{ [key: string]: boolean }>({});
  const [isProcessing, setIsProcessing] = useState(false); // State to disable button

  // Define score categories with colors
  const SCORE_CATEGORIES = [
    { label: "❌ Poor", value: "poor", min: 0, max: 59, color: "bg-red-500 text-white" },
    { label: "🟠 Fair", value: "fair", min: 60, max: 74, color: "bg-orange-400 text-white" },
    { label: "🟡 Good", value: "good", min: 75, max: 84, color: "bg-yellow-400 text-black" },
    { label: "🔵 V Good", value: "very-good", min: 85, max: 94, color: "bg-blue-500 text-white" },
    { label: "🟢 Excellent", value: "excellent", min: 95, max: 100, color: "bg-green-500 text-white" },
  ];

  // Function to determine if a score matches the selected category
  const isScoreInCategory = (score: number, selectedCategories: string[]) => {
    return SCORE_CATEGORIES.some(({ value, min, max }) => selectedCategories.includes(value) && score >= min && score <= max);
  };

  // Function to get the color based on score
  const getScoreCategoryColor = (score: number) => {
    return SCORE_CATEGORIES.find(({ min, max }) => score >= min && score <= max)?.color || "bg-gray-300 text-black";
  };

  // Function to get filter categories dynamically
  const getFilterCategories = () => SCORE_CATEGORIES.map(({ label, value }) => ({ label, value }));

  // Usage in table filtering
  const filteredResumes = resumes
    .filter((r) => {
      const score = r.analysis?.match_score || 0;
      return selectedCategories.length === 0 || isScoreInCategory(score, selectedCategories);
    })
    .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.analysis?.email.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    loadResumes();
  }, [jobId]);

  const loadResumes = async () => {
    setIsLoading(true);

    const data = await fetchResumes(jobId);
    const cleanedData = data.map((resume) => ({
      ...resume,
      analysis: resume.analysis
        ? {
            ...resume.analysis,
            match_score: resume.analysis.match_score ? parseFloat(resume.analysis.match_score.replace("%", "")) : null,
          }
        : null,
    }));

    setIsLoading(true);
    setResumes(cleanedData);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      const updatedResumes = await uploadResume(jobId, acceptedFiles[0]);
      setResumes(updatedResumes);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    try {
      const updatedResumes = await deleteResume(jobId, resumeId);
      setResumes(updatedResumes);
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const processSelectedResumes = async () => {
    setIsProcessing(true); // Disable process button

    const newProcessingState = { ...processingRows };
    selectedResumes.forEach((resumeId) => {
      newProcessingState[resumeId] = true;
    });
    setProcessingRows(newProcessingState);

    try {
      const updatedResumes = await Promise.all(
        Array.from(selectedResumes).map(async (resumeId) => {
          try {
            const updatedAnalysis = await processResumeById(resumeId, jobId); // Process and get updated analysis

            // Update the specific resume's analysis in the state
            setResumes((prevResumes) => prevResumes.map((resume) => (resume.id === resumeId ? { ...resume, analysis: updatedAnalysis } : resume)));

            return resumeId;
          } catch (error) {
            console.error(`Error processing resume ${resumeId}:`, error);
            showToast.error(`Error processing resume: ${resumeId}`);
            return null;
          }
        })
      );

      showToast.success("Selected resumes processed successfully!");
    } catch (error) {
      showToast.error("An error occurred while processing resumes.");
    } finally {
      // Reset processing state
      setProcessingRows((prevState) => {
        const updatedProcessingState = { ...prevState };
        selectedResumes.forEach((resumeId) => {
          updatedProcessingState[resumeId] = false;
        });
        return updatedProcessingState;
      });

      setIsProcessing(false); // Re-enable process button
    }
  };

  const handleSelectionChange = (resumeId: string) => {
    setSelectedResumes((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(resumeId)) {
        newSelected.delete(resumeId);
      } else {
        newSelected.add(resumeId);
      }
      return newSelected;
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Drawer size='3xl' isOpen={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader> Resume</DrawerHeader>
        <DrawerBody>
          {/* File Upload */}
          <Card>
            <CardBody>
              <div {...getRootProps()} className='flex flex-col items-center cursor-pointer hover:bg-gray-100 transition'>
                {!uploading && <AiOutlineUpload className='h-6 w-6' />}
                <p className='mt-2 text-sm'>{uploading ? <Spinner /> : "Drag & Drop files here, or click to select"}</p>
                <input {...getInputProps()} />
              </div>
            </CardBody>
          </Card>

          {/* Table */}
          <div className='mt-4'>
            <div className='mt-4 mb-4 flex items-center gap-4'>
              <Input className='flex-1' placeholder='Search by name or email' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

              <CheckboxGroup size='sm' orientation='horizontal' className='flex flex-wrap' value={selectedCategories} onChange={setSelectedCategories}>
                {getFilterCategories().map(({ label, value }) => (
                  <Checkbox key={value} value={value}>
                    {label}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>

            <Table>
              <TableHeader>
                <TableColumn>{""}</TableColumn>
                <TableColumn>Name</TableColumn>

                <TableColumn>Experience</TableColumn>
                <TableColumn>Score</TableColumn>
                <TableColumn align='end'>{""}</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No resumes to display."} loadingContent='Loading resumes... '>
                {filteredResumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>
                      <Checkbox isDisabled={resume.isProcessed} isSelected={selectedResumes.has(resume.id)} onChange={() => handleSelectionChange(resume.id)} />
                    </TableCell>
                    <TableCell>
                      {resume.analysis && resume.analysis?.name}
                      {!resume.analysis && resume.name}
                    </TableCell>
                    <TableCell>{resume.analysis?.total_experience || "--"}</TableCell>
                    <TableCell>
                      {resume.analysis?.match_score ? (
                        <Chip size='sm' radius='full' className={`${getScoreCategoryColor(resume.analysis.match_score)}`}>
                          {resume.analysis.match_score}%
                        </Chip>
                      ) : (
                        "--"
                      )}
                    </TableCell>

                    <TableCell align='right'>
                      {processingRows[resume.id] ? (
                        <Spinner size='sm' />
                      ) : (
                        <>
                          <div className='flex items-center gap-2'>
                            <Button onPress={() => handleDelete(resume.id)} isIconOnly={true} color='default' variant='faded' size='sm'>
                              <AiOutlineDelete />
                            </Button>

                            <Button onPress={() => handleDelete(resume.id)} isIconOnly={true} color='default' variant='faded' size='sm'>
                              <AiOutlineDownload />
                            </Button>
                            <Popover placement='right'>
                              <PopoverTrigger>
                                <Button isIconOnly={true} color='default' variant='faded' size='sm'>
                                  <AiOutlineEye />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <div className='px-4 py-3 w-[350px]'>
                                  <div className='flex justify-between items-center mt-2'>
                                    <h2 className='text-sm font-bold'>Email:</h2>
                                    <p className='text-sm text-gray-500'>{resume?.analysis?.email}</p>
                                  </div>

                                  <div className='flex justify-between items-center mt-2'>
                                    <h2 className='text-sm font-bold'>Phone:</h2>
                                    <p className='text-sm text-gray-500'>{resume?.analysis?.phone}</p>
                                  </div>

                                  <div className='flex justify-between items-center mt-2'>
                                    <h2 className='text-sm font-bold'>Total Experience:</h2>
                                    <p className='text-sm text-gray-500'>{resume?.analysis?.total_experience}</p>
                                  </div>

                                  <div className='flex justify-between items-center mt-2'>
                                    <h2 className='text-sm font-bold'>Relevant Experience:</h2>
                                    <p className='text-sm text-gray-500'>{resume?.analysis?.relevant_experience}</p>
                                  </div>

                                  <hr className='my-2' />
                                  <h2 className='text-lg font-bold'>Skills:</h2>
                                  <div className='text-xs flex flex-wrap gap-1'>
                                    {resume?.analysis?.skills?.map((skill, index) => (
                                      <span key={index} className='bg-gray-200 text-gray-700 px-2 py-1 rounded-md'>
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button onPress={processSelectedResumes} isDisabled={isProcessing || selectedResumes.size === 0} color='primary' startContent={<AiOutlineExperiment />}>
            Process
          </Button>
        </DrawerFooter>
      </DrawerContent>
      <ToastContainer />
    </Drawer>
  );
}

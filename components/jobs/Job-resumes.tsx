import { showToast } from "@/app/utils/toastUtils";
import { deleteResume, fetchResumes, processResumeById, uploadResume } from "@/services/resume.service";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Input, CheckboxGroup, Checkbox, Card, CardBody, Chip, DrawerFooter, Popover, PopoverTrigger, PopoverContent, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCheck, AiOutlineClose, AiOutlineDelete, AiOutlineExperiment, AiOutlineEye, AiOutlineSend, AiOutlineUpload, AiOutlineUserAdd } from "react-icons/ai";
import { SendInvitationDrawer } from "./send-invitation";
import ResultPopoverContent from "./components/result.poover.content";

export default function JobResumes({ jobId, isOpen, onClose }: { jobId: string; isOpen: boolean; onClose: () => void }) {
  const [resumes, setResumes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());
  const [selectedSingleResume, setSelectedSingleResume] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [processingRows, setProcessingRows] = useState<{ [key: string]: boolean }>({});
  const [isProcessing, setIsProcessing] = useState(false); // State to disable button
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

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

    setIsLoading(false);
    setResumes(cleanedData);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      const updatedResumes = await uploadResume(jobId, acceptedFiles[0]);
      setResumes(updatedResumes);
    } catch (error) {
    } finally {
      setUploading(false);
    }
  };

  const handleInviteClick = (jobId: string, resume: any) => {
    setSelectedJobId(jobId);
    setSelectedSingleResume(resume);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedJobId(null);
    setDrawerOpen(false);
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
      await Promise.all(
        Array.from(selectedResumes).map(async (resumeId) => {
          try {
            const updatedAnalysis = await processResumeById(resumeId, jobId);

            setResumes((prevResumes) => prevResumes.map((resume) => (resume.id === resumeId ? { ...resume, analysis: updatedAnalysis } : resume)));

            return resumeId;
          } catch (error) {
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

      setIsProcessing(false);
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
        <DrawerHeader>Manage Resume and Invitation</DrawerHeader>
        <DrawerBody>
          {/* File Upload */}
          <Card shadow='sm' className='cursor-pointer hover:bg-gray-100 transition'>
            <CardBody>
              <div {...getRootProps()} className='flex flex-col items-center'>
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
                <TableColumn>Invite</TableColumn>
                <TableColumn align='end'>{""}</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No resumes to display."} loadingContent='Loading resumes... ' isLoading={isLoading}>
                {filteredResumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>
                      <Checkbox isDisabled={resume.isProcessed} isSelected={selectedResumes.has(resume.id)} onChange={() => handleSelectionChange(resume.id)} />
                    </TableCell>
                    <TableCell>
                      {resume.analysis && (
                        <a href={resume.url} target='_blank' className='text-blue-600'>
                          {resume.analysis?.name}
                        </a>
                      )}
                      {!resume.analysis && (
                        <a href={resume.url} target='_blank' className='text-blue-600'>
                          {resume.name}
                        </a>
                      )}
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
                    <TableCell>{resume.analysis?.isInvite ? <AiOutlineCheck /> : <AiOutlineClose />}</TableCell>
                    <TableCell align='right'>
                      {processingRows[resume.id] ? (
                        <Spinner size='sm' />
                      ) : (
                        <>
                          <div className='flex items-center gap-2'>
                            <Tooltip content='Delete resume'>
                              <Button onPress={() => handleDelete(resume.id)} isIconOnly={true} color='default' variant='faded' size='sm'>
                                <AiOutlineDelete />
                              </Button>
                            </Tooltip>
                            <Tooltip content='Send invitation'>
                              <Button onPress={() => handleInviteClick(jobId, resume)} isDisabled={!resume.analysis} isIconOnly={true} color='default' variant='faded' size='sm'>
                                <AiOutlineUserAdd />
                              </Button>
                            </Tooltip>

                            <Popover placement='right'>
                              <PopoverTrigger>
                                <Button isIconOnly={true} color='default' isDisabled={!resume.analysis} variant='faded' size='sm'>
                                  <AiOutlineEye />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <ResultPopoverContent resume={resume} />
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

      {selectedSingleResume && <SendInvitationDrawer isOpen={isDrawerOpen} name={selectedSingleResume.analysis?.name} email={selectedSingleResume.analysis?.email} onClose={handleCloseDrawer} jobId={selectedJobId} />}
    </Drawer>
  );
}

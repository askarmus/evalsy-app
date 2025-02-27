import { Button, Card, CardBody } from "@heroui/react";
import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

const EvaluationTable = ({ data }) => {
  const categories = ["relevance", "completeness", "clarity", "grammar_language", "technical_accuracy"];
  let totalScore = 0;
  let totalPossibleScore = data.questionAnswers.length * 25;

  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const datas = [
    { id: 1, name: "Alice", role: "Software Engineer", status: "Active", details: "Joined in 2021, works on frontend" },
    { id: 2, name: "Bob", role: "Backend Engineer", status: "Paused", details: "Expert in Node.js and databases" },
    { id: 3, name: "Charlie", role: "DevOps Engineer", status: "Vacation", details: "AWS Certified, works on CI/CD" },
  ];
  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  return (
    <Card>
      <CardBody>
        <div className='overflow-x-auto'>
          <table className='w-full  '>
            <tr className='bg-gray-100 uppercase text-xs font-semibold'>
              <th className='px-2 h-8 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-[10px] font-semibold first:rounded-s-lg last:rounded-e-lg'>QUESTION</th>
              <th className='px-2 bg-default-100 whitespace-nowrap text-foreground-500 text-[10px] font-semibold'>Rel.</th>
              <th className='px-2 h-8 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-[10px] font-semibold first:rounded-s-lg last:rounded-e-lg'>Comp.</th>
              <th className='px-2 h-8 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-[10px] font-semibold first:rounded-s-lg last:rounded-e-lg'>Clar.</th>
              <th className='px-2 h-8 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-[10px] font-semibold first:rounded-s-lg last:rounded-e-lg'>Gram.</th>
              <th className='px-2 h-8 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-[10px] font-semibold first:rounded-s-lg last:rounded-e-lg'>Acc.</th>
              <th className='px-2 h-8 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-[10px] font-semibold first:rounded-s-lg last:rounded-e-lg'>Score</th>
              <th className='px-2 h-8 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-[10px] font-semibold first:rounded-s-lg last:rounded-e-lg'></th>
            </tr>

            <tbody>
              {data.questionAnswers.map((answer, index) => {
                const scores = answer.evaluation.scores;
                const questionScore = categories.reduce((sum, category) => sum + (scores[category] || 0), 0);
                totalScore += questionScore;

                return (
                  <>
                    <tr key={answer.id || index} className=' hover:bg-gray-50'>
                      <td className='py-2 px-3 relative align-middle whitespace-normal text-small font-normal'>{answer.text}</td>
                      <td className='py-2 px-3 relative align-middle whitespace-normal text-small font-normal'>{scores.relevance || 0}</td>
                      <td className='py-2 px-3 relative align-middle whitespace-normal text-small font-normal'>{scores.completeness || 0}</td>
                      <td className='py-2 px-3 relative align-middle whitespace-normal text-small font-normal'>{scores.clarity || 0}</td>
                      <td className='py-2 px-3 relative align-middle whitespace-normal text-small font-normal'>{scores.grammar_language || 0}</td>
                      <td className='py-2 px-3 relative align-middle whitespace-normal text-small font-normal'>{scores.technical_accuracy || 0}</td>
                      <td className='py-2 px-3 relative align-middle whitespace-normal text-small font-normal'>{`${questionScore}/25`}</td>
                      <td className='py-2 px-3 relative align-middle whitespace-normal text-small font-normal'>
                        <Button size='sm' isIconOnly onPress={() => toggleRow(answer.id)}>
                          {expandedRow === answer.id ? <AiOutlineUp /> : <AiOutlineDown />}
                        </Button>
                      </td>
                    </tr>
                    {expandedRow === answer.id && (
                      <tr>
                        <td colSpan={8} className='p-3'>
                          <p className='text-gray-700 text-small'>
                            <strong>Answer:</strong> {answer.transcription || "No transcription available."}
                          </p>
                          {answer.recordedUrl && (
                            <audio controls className='mt-4 mb-2 w-full'>
                              <source src={answer.recordedUrl} type='audio/mpeg' />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};

export default EvaluationTable;

import { Button, Card, CardBody } from "@heroui/react";
import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

const EvaluationTable = ({ data }) => {
  const categories = ["relevance", "completeness", "clarity", "grammar_language", "technical_accuracy"];
  let totalScore = 0;
  let totalPossibleScore = data.questionAnswers.length * 25;

  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  return (
    <Card>
      <CardBody>
        <div className='overflow-x-auto'>
          <table className='w-full  '>
            <thead>
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
            </thead>
            <tbody>
              {data.questionAnswers.map((answer, index) => {
                const scores = answer.evaluation.scores;
                const questionScore = categories.reduce((sum, category) => sum + (scores[category] || 0), 0);
                totalScore += questionScore;

                return (
                  <React.Fragment key={answer.id || `question-${index}`}>
                    <tr key={`row-${answer.id || index}`} className='hover:bg-gray-50'>
                      <td className='py-2 px-3 text-[12px]'>{answer.text}</td>
                      <td className='py-2 px-3 text-[12px]'>{scores.relevance || 0}</td>
                      <td className='py-2 px-3 text-[12px]'>{scores.completeness || 0}</td>
                      <td className='py-2 px-3 text-[12px]'>{scores.clarity || 0}</td>
                      <td className='py-2 px-3 text-[12px]'>{scores.grammar_language || 0}</td>
                      <td className='py-2 px-3 text-[12px]'>{scores.technical_accuracy || 0}</td>
                      <td className='py-2 px-3 text-[12px]'>{`${questionScore}/25`}</td>
                      <td className='py-2 px-3 text-[12px]'>
                        <Button size='sm' isIconOnly onPress={() => toggleRow(answer.id)}>
                          {expandedRow === answer.id ? <AiOutlineUp /> : <AiOutlineDown />}
                        </Button>
                      </td>
                    </tr>
                    {expandedRow === answer.id && (
                      <tr key={`expanded-${answer.id || index}`}>
                        {" "}
                        {/* ✅ Unique key for expanded row */}
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
                  </React.Fragment>
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

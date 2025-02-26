import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

const EvaluationTable = ({ data }) => {
  const categories = ["relevance", "completeness", "clarity", "grammar_language", "technical_accuracy"];
  let totalScore = 0;
  let totalPossibleScore = data.questionAnswers.length * 25;

  return (
    <Table aria-label='Example static collection table'>
      <TableHeader>
        <TableColumn>Question</TableColumn>
        <TableColumn>Relevance</TableColumn>
        <TableColumn>Completeness</TableColumn>
        <TableColumn>Clarity</TableColumn>
        <TableColumn>Grammar</TableColumn>
        <TableColumn>Accuracy</TableColumn>
        <TableColumn>Score</TableColumn>
      </TableHeader>
      <TableBody>
        {data.questionAnswers.map((answer, index) => {
          const scores = answer.evaluation.scores;
          const questionScore = categories.reduce((sum, category) => sum + (scores[category] || 0), 0);
          totalScore += questionScore;

          return (
            <TableRow key={index}>
              <TableCell>{answer.text}</TableCell>
              <TableCell>{scores.relevance || 0}</TableCell>
              <TableCell>{scores.completeness || 0}</TableCell>
              <TableCell>{scores.clarity || 0}</TableCell>
              <TableCell>{scores.grammar_language || 0}</TableCell>
              <TableCell>{scores.technical_accuracy || 0}</TableCell>
              <TableCell>{`${questionScore}/25`}</TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell colSpan={2}>Final Evaluation</TableCell>
          <TableCell className='hidden'> </TableCell>
          <TableCell className='hidden'> </TableCell>
          <TableCell className='hidden'> </TableCell>
          <TableCell className='hidden'> </TableCell>
          <TableCell className='hidden'> </TableCell>
          <TableCell colSpan={5}>{`Total Score: ${totalScore}/${totalPossibleScore} | Overall Rating: ${((totalScore / totalPossibleScore) * 100).toFixed(2)}% (Excellent)`}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default EvaluationTable;

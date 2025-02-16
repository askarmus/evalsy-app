import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Helvetica" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  section: { marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  textBold: { fontSize: 12, fontWeight: "bold" },
  text: { fontSize: 12 },
  divider: { marginVertical: 5, borderBottomWidth: 1, borderBottomColor: "#CCC" },
});

const PDFReport = ({ interviewerData }: { interviewerData: any }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      {/* Interviewer Header */}
      <View style={styles.section}>
        <Text style={styles.title}>{interviewerData?.name}</Text>
        <Text style={styles.text}>{interviewerData?.jobTitle}</Text>
        <View style={styles.divider} />
      </View>

      {/* Evaluation Summary */}
      <View style={styles.section}>
        <Text style={styles.textBold}>Overall Evaluation</Text>
        {interviewerData?.overallCriteria?.map((criteria: any, index: number) => (
          <View key={index} style={styles.row}>
            <Text style={styles.text}>{criteria.name}:</Text>
            <Text style={styles.textBold}>{criteria.expectedValue}</Text>
          </View>
        ))}
        <View style={styles.divider} />
      </View>

      {/* Feedback Section */}
      <View style={styles.section}>
        <Text style={styles.textBold}>Feedback</Text>
        <Text style={styles.text}>{interviewerData?.notes || "No feedback available."}</Text>
        <View style={styles.divider} />
      </View>

      {/* Questions & Answers */}
      <View style={styles.section}>
        <Text style={styles.textBold}>Questions & Answers</Text>
        {interviewerData?.questionAnswers?.map((qa: any, index: number) => (
          <View key={index} style={styles.section}>
            <Text style={styles.textBold}>{`${index + 1}. ${qa.text}`}</Text>
            <Text style={styles.text}>{qa.transcription || "No transcription available."}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFReport;

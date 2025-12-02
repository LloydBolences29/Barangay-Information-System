import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Helvetica" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
    textAlign: "justify",
    textIndent: 30,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerPhilippines: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerBarangay: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 2,
  },
  headerRegion: {
    fontSize: 12,
  },
  leftLogo: {
    width: 80,
    height: 80,
  },
  rightLogo: {
    width: 80,
    height: 80,
  },
  headerTextContainer: {
    flex: 1, // KEY: This forces it to take up all remaining width
    textAlign: "center", // Centers the text inside that width
    marginLeft: 10, // Optional: Safety space from left logo
    marginRight: 10, // Optional: Safety space from right logo
  },

  workingPermitContainer: {
    marginTop: 12,
    flexDirection: "row",
    flex: 1,
  },
});

import brgyLogo from "../../assets/BRGYLOGO.png";
import pasayLogo from "../../assets/pasayLogo.png";
const WorkingPermit = ({ resident, purpose }) => {
  const date = new Date();

  // 2. Extract the parts
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // 3. Helper function for "st, nd, rd, th"
  const getOrdinalDay = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Existing Header, Title, To Whom It May Concern, and initial text blocks
        will remain above the columns, spanning full width. */}
        <View style={styles.headerContainer}>
          {/* Left Logo */}
          <Image src={brgyLogo} style={styles.leftLogo} />

          {/* Center Text */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerPhilippines}>
              Republic of the Philippines
            </Text>
            <Text style={styles.headerTitle}>
              Office OF SANGGUNIANG BARANGAY
            </Text>
            <Text style={styles.headerBarangay}>Barangay 35, Zone 03</Text>
            <Text style={styles.headerRegion}>
              1974 LEVERIZA ST., PASAY CITY
            </Text>
          </View>

          {/* Right Logo */}
          <Image src={pasayLogo} style={styles.rightLogo} />
        </View>

        <View style={styles.workingPermitContainer}></View>
      </Page>
    </Document>
  );
};

export default WorkingPermit;

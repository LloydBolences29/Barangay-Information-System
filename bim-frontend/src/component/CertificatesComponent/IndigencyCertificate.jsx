import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
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
  header: { textAlign: "center", marginBottom: 20 },
  signature: { marginTop: 50, textAlign: "right" },
columnContainer: {
    flexDirection: "row", // Key: Children must flow horizontally
    marginTop: 20,
    // Note: No need for a width here, it defaults to 100% of the parent view.
  },

  // 2. Fixed Width Column (The left side)
  leftColumnFixed: {
    width: "100px", // Key: Sets the specific width (e.g., for labels or dates)
    padding: 2,
    // Add margin to create space between the two columns
    marginRight: 2, 
  },

  // 3. Flexible Column (The right side)
  rightColumnFlexible: {
    flex: 1, // Key: This makes the column take up all the *remaining* space
    padding: 2,
  },
});
const IndigencyCertificate = ({resident, purpose}) => {
  return (
   <Document>
  <Page size="A4" style={styles.page}>
    {/* Existing Header, Title, To Whom It May Concern, and initial text blocks
        will remain above the columns, spanning full width. */}
    <View style={styles.header}>
      <Text>Republic of the Philippines</Text>
      <Text>City of Pasay</Text>
      <Text style={{ fontWeight: "bold" }}>BARANGAY 35</Text>
    </View>

    <Text style={styles.title}>CERTIFICATE OF INDIGENCY</Text>
    <Text style={styles.text}>TO WHOM IT MAY CONCERN:</Text>

    {/* ... (The rest of your initial text blocks) ... */}

    {/* --- START OF TWO-COLUMN LAYOUT --- */}
    <View style={styles.columnContainer}>
      {/* Column 1: This will hold the main body of the certificate */}
      <View style={styles.leftColumnFixed}>
        <Text style={styles.text}>
          This is to certify that{" "}
          <Text style={{ fontWeight: "bold" }}>
            {resident.firstname} {resident.lastname}
          </Text>
          , of legal age, {resident.civil_status}, Filipino, is a resident of{" "}
          {resident.house_no} {resident.street}.
        </Text>

        <Text style={styles.text}>
          This is to certify further that the above-named person belongs to an
          indigent family in this Barangay.
        </Text>

        <Text style={styles.text}>
          This certification is issued upon the request of the interested party
          for the purpose of:
          <Text style={{ fontWeight: "bold", textTransform: "uppercase" }}>
            {" "}
            {purpose}
          </Text>
          .
        </Text>

        {/* ... Other content for Column 1 ... */}
      </View>

      {/* Column 2: This will typically hold signatures, placeholders, etc. */}
      <View style={styles.rightColumnFlexible}>
        <View style={styles.signature}>
          <Text style={{ fontWeight: "bold", textDecoration: "underline" }}>
            HON. KAPITAN NAME
          </Text>
          <Text>Punong Barangay</Text>
        </View>

        {/* ... Other content for Column 2 (e.g., control number, date) ... */}
      </View>
    </View>
    {/* --- END OF TWO-COLUMN LAYOUT --- */}
  </Page>
</Document>
  );
};

export default IndigencyCertificate;

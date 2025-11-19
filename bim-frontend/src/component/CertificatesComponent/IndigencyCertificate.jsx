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
});
const IndigencyCertificate = ({resident, purpose}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Republic of the Philippines</Text>
          <Text>City of Pasay</Text>
          <Text style={{ fontWeight: "bold" }}>BARANGAY 35</Text>
        </View>

        <Text style={styles.title}>CERTIFICATE OF INDIGENCY</Text>

        <Text style={styles.text}>TO WHOM IT MAY CONCERN:</Text>

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

        <View style={styles.signature}>
          <Text style={{ fontWeight: "bold", textDecoration: "underline" }}>
            HON. KAPITAN NAME
          </Text>
          <Text>Punong Barangay</Text>
        </View>
      </Page>
    </Document>
  );
};

export default IndigencyCertificate;

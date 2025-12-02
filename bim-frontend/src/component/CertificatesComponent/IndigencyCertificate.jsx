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

  indigencyContainer: {
    marginTop: 12,
    flexDirection: "row",
    flex: 1,
  },

  contentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  controlNumbertext: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 15,
    marginTop: 15,
  },
  toWhomItMayConcern: {
    fontSize: 14,
    marginBottom: 20,
  },
  leftWrapper: {
    width: "30%",
    borderRight: 2,
    borderColor: "#000",
  },

  officialNameText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  positionText: {
    fontSize: 12,
    marginBottom: 20,
    marginTop: 0,
    color: "red",
  },

  noteText: {
    fontSize: 10,
    marginTop: 20,
    fontWeight: "bold",
  },
  rightWrapper: {
    flex: 1, // Remaining percentage
    // OR use flex: 1 to automatically take whatever is left
    padding: 20,
  },

  dateRequested: {
    fontSize: 12,
    marginBottom: 30,
    lineHeight: 1.5,
    textAlign: "justify",
    textIndent: 30,
  },
  firstTextContent: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: "justify",
    textIndent: 30,
    marginBottom: 15,
  },
});

import brgyLogo from "../../assets/BRGYLOGO.png";
import pasayLogo from "../../assets/pasayLogo.png";
const IndigencyCertificate = ({ resident, purpose }) => {
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
              CERTIFICATE OF SANGGUNIANG BARANGAY
            </Text>
            <Text style={styles.headerBarangay}>
              Barangay 35, Zone 03, District 01
            </Text>
            <Text style={styles.headerRegion}>Pasay City, Metro Manila</Text>
          </View>

          {/* Right Logo */}
          <Image src={pasayLogo} style={styles.rightLogo} />
        </View>

        <View style={styles.indigencyContainer}>
          <View style={styles.leftWrapper}>
            <Text style={styles.officialNameText}>Lily M. Balanon</Text>
            <Text style={styles.positionText}>Barangay Chairwoman</Text>
            <Text style={styles.officialNameText}>Sunny Boy Loriezo</Text>
            <Text style={styles.positionText}>Barangay Kagawad</Text>
            <Text style={styles.officialNameText}>Hetty N. Dalugdugan</Text>
            <Text style={styles.positionText}>Barangay Kagawad</Text>
            <Text style={styles.officialNameText}>Enrique M. Galicer Jr.</Text>
            <Text style={styles.positionText}>Barangay Kagawad</Text>
            <Text style={styles.officialNameText}>Rofil L. Abonador</Text>
            <Text style={styles.positionText}>Barangay Kagawad</Text>
            <Text style={styles.officialNameText}>salvador V. Aguilar</Text>
            <Text style={styles.positionText}>Barangay Kagawad</Text>
            <Text style={styles.officialNameText}>Mailene T. Balmes</Text>
            <Text style={styles.positionText}>Barangay Kagawad</Text>
            <Text style={styles.officialNameText}>Marjoe E. Dieto</Text>
            <Text style={styles.positionText}>Barangay Kagawad</Text>
            <Text style={styles.officialNameText}>Angela Mae D. Balmes</Text>
            <Text style={styles.positionText}>SK Chairman</Text>
            <Text style={styles.officialNameText}>Myle M. Laqui</Text>
            <Text style={styles.positionText}>Barangay Secretary</Text>
            <Text style={styles.officialNameText}>
              Maxima Angelita R. Arasa
            </Text>
            <Text style={styles.positionText}>Barangay Treasurer</Text>
            <Text style={styles.noteText}>
              Note:{" "}
              <Text style={{ fontSize: 10, color: "red" }}>
                "Not Valid Without Dryseal"
              </Text>
            </Text>
          </View>
          <View style={styles.rightWrapper}>
            <Text style={styles.contentTitle}>CERTIFICATE OF INDIGENCY</Text>
            <Text style={styles.controlNumbertext}>
              Control No. 2025 - _________
            </Text>
            <Text style={styles.toWhomItMayConcern}>
              TO WHOM IT MAY CONCERN:
            </Text>

            <Text style={styles.text}>
              Name: {resident.firstname} {resident.middlename}{" "}
              {resident.lastname}
            </Text>

            <Text style={styles.text}>Address: {resident.address}</Text>
            <Text style={styles.text}>
              Contact Number:{" "}
              {resident.contactnumber ? resident.contactnumber : "N/A"}
            </Text>

            <Text style={styles.text}>
              Birthdate:{" "}
              {resident.dob
                ? new Date(resident.dob).toLocaleDateString()
                : "N/A"}
            </Text>

            <Text style={styles.text}>
              Birth Place:{" "}
              {resident.place_of_birth ? resident.place_of_birth : "N/A"}
            </Text>

            <Text style={styles.text}>
              Civil Status:{" "}
              {resident.civil_status
                ? resident.civil_status.charAt(0).toUpperCase() +
                  resident.civil_status.slice(1)
                : "N/A"}
            </Text>

            <Text style={styles.text}>
              Purpose: {purpose ? purpose : "N/A"}
            </Text>

            <Text style={styles.dateRequested}>
              Date Requested: {new Date().toLocaleDateString()}
            </Text>

            <Text style={styles.firstTextContent}>
              This is to certify that the person mentioned above is of legal age
              and a registered voter/member of the said barangay.
            </Text>
            <Text style={styles.firstTextContent}>
              That as per interview and investigation conducted by the Barangay
              Officials of Barangay 35, Zone 03, Pasay City, the said
              constituents has not enough source of income.
            </Text>
            <Text style={styles.firstTextContent}>
              This certification is issued upon the request of the above
              mentions for <Text style={styles.contentPurpose}>{purpose} </Text>{" "}
              purposes.
            </Text>
            <Text style={styles.text}>
              Issued this {getOrdinalDay(day)} day of {month}, {year}.
            </Text>
            <Text
              style={{
                textDecoration: "underline",
                marginTop: 10,
                marginBottom: 0,
                fontSize: 14,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              Lily M. Balanon
            </Text>
            <Text style={{ fontSize: 12, textAlign: "right" }}>
              Barangay Chairwoman
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default IndigencyCertificate;

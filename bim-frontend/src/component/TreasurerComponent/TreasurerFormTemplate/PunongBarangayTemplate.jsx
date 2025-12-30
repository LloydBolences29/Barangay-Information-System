import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
  
} from "@react-pdf/renderer";



const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Helvetica" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTextContainer: {
    flex: 1, // KEY: This forces it to take up all remaining width
    textAlign: "center", // Centers the text inside that width
    marginLeft: 10, // Optional: Safety space from left logo
    marginRight: 10, // Optional: Safety space from right logo
  },
  leftLogo: {
    width: 80,
    height: 80,
  },
  rightLogo: {
    width: 80,
    height: 80,
  },
  headerPhilippines: {
    fontSize: 16,
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

  certificateInformation: {
    textAlign: "center",
    marginBottom: 10,
  },
  brgyAndZone: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  formName: {
    textAlign: "center",
    marginBottom: 10,
  },
  formInfo: {
    flexDirection: "column",
    //position to right
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 10,
  },
  bankSalutation: {
    flexDirection: "column",
    marginBottom: 15,
    marginLeft: 15,
  },
  formMessage: {
    fontSize: 10,
    textAlign: "center",
    
    marginLeft: 20,
    marginRight: 20,
  },
  formTable: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "center",
    height: 30, // Fixed height for rows
  },
  tableHeader: {
    backgroundColor: "#f0f0f0", // Light gray background for header
    fontWeight: "bold",
  },
  tableCol: {
    width: "25%", // 4 Columns = 25% each
    borderRightWidth: 1,
    borderRightColor: "#000",
    height: "100%",
    justifyContent: "center", // Vertically center text
  },
  lastCol: {
    borderRightWidth: 0, // Remove right border for the last column
  },
  tableCell: {
    fontSize: 10,
    textAlign: "center",
  },
  signatoryWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  }
});

import brgyLogo from "../../../assets/BRGYLOGO.png";
import pasayLogo from "../../../assets/pasayLogo.png";

const PunongBarangayTemplate = ({
  brgyNo,
  zone,
  province,
  checkData = [],
  totalAmount,
}) => {
  const date = new Date();
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerContainer}>
          {/* Left Logo */}
          <Image src={brgyLogo} style={styles.leftLogo} />

          {/* Center Text */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerPhilippines}>
              Republic of the Philippines
            </Text>
            <Text style={styles.headerTitle}>
              OFFICIAL OF THE SANGGUNIANG BARANGAY
            </Text>
            <Text style={styles.headerBarangay}>
              Barangay 35, Zone 03, District 01
            </Text>
            <Text style={styles.headerRegion}>Pasay City, Metro Manila</Text>
          </View>

          {/* Right Logo */}
          <Image src={pasayLogo} style={styles.rightLogo} />
        </View>

        <View style={styles.certificateInformation}>
          <View style={styles.brgyAndZone}>
            <Text style={{ fontSize: 8 }}>Barangay of {brgyNo}</Text>
            <Text style={{ fontSize: 8 }}>Zone {zone}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 8 }}>Province of {province}</Text>
          </View>
        </View>

        <View style={styles.formName}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            PUNONG BARANGAY'S CERTIFICATION (PBC)
          </Text>
        </View>

        <View style={styles.formInfo}>
          <Text style={{ fontSize: 10, marginRight: 12 }}>PRC No: _____________</Text>
          <Text style={{ fontSize: 10, marginRight: 12 }}>Date: _____________</Text>
        </View>

        <View style={styles.bankSalutation}>
          <Text style={{ fontSize: 10 }}>To the Bank Manager</Text>
          <Text style={{ fontSize: 10 }}>LandBank of the Philippines</Text>
          <Text style={{ fontSize: 10 }}>Libertad Branch, Pasay City</Text>
          <Text style={{ fontSize: 10 }}>Sir/Madam: </Text>
        </View>

        <View style={styles.formMessage}>
          <Text style={{ fontSize: 10 }}>
            This is to certify that the following checks were duly issued to
            BARANGAY {brgyNo} ZONE {zone}.
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 5 }}>
            (Ito ay pagpapatunay na ang mga cheke na nakalista sa ibaba ay
            naisyu ng BARANGAY {brgyNo} ZONE {zone}.)
          </Text>
        </View>

        <View style={styles.formMessage}>
          <Text style={{ fontSize: 10 }}>
            Completely with respective Disbursement Vouchers and supporting
            documents.
          </Text>
          <Text style={{ fontSize: 10 }}>
            (Na kumpleto ng kanya-kanyang Disbursement Vouchers at kalakip na
            Disbursement Vouchers at mga sumusuportang dokumento.)
          </Text>
        </View>

        <View style={styles.formTable}>
          {/* Table Header (Static) */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Account No</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>CHECK NO.</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Date</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Payee</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Amount</Text>
            </View>
            <View style={[styles.tableCol, styles.lastCol]}>
              <Text style={styles.tableCell}>Purpose</Text>
            </View>
          </View>

          {/* Table Rows (Dynamic) */}
          {checkData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.accountNo}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.checkNo}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.date}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.payee}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.amount}</Text>
              </View>
              <View style={[styles.tableCol, styles.lastCol]}>
                <Text style={styles.tableCell}>{item.purpose}</Text>
              </View>
            </View>
          ))}

          <View>
           
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "67.40%" }]}>
                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                  TOTAL AMOUNT: 
                </Text>
              </View>

              <View style={[styles.tableCol, styles.lastCol, { width: "33.60%" }]}>
                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                  PHP {totalAmount}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 5, marginBottom: 5, alignItems: "center" }}>
            <Text style={{ fontSize: 10 }}>
              -------- NOTHING FOLLOWS --------
            </Text>
          </View>
        </View>

        <View style={styles.formMessage}>
          <Text style={{ fontSize: 10, marginTop: 10}}>
            As a condition for the encashment of said checks.
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 5 }}>
            (Bilang kondisyon para sa pagpapalit ng mga cheke)
          </Text>
        </View>
        <View style={styles.formMessage}>
          <Text style={{ fontSize: 10 }}>
            The undersigned attest to the truthfulness of the foregoing facts, under pain of liability for
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 5 }}>
            (Pinapatotohanan ng mga lagda ang mga nakasaad sa itaas, 
          </Text>
        </View>
        <View style={styles.formMessage}>
          <Text style={{ fontSize: 10 }}>
            Falsification, pursuant to Article 171 (4) of the Revised Penal Code.
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 5 }}>
            Kasong "Falsification" sang ayon sa Artikulo 171 (4) ng Revised Penal Code.)
          </Text>
        </View>

        <View style={styles.signatoryWrapper}>
            <View style={styles.leftSignatory}>
                <View style={styles.brgyTreasurer}>
                <Text style={{ fontSize: 10, marginTop: 20 }}>
                    Delivered By:
                    </Text>
                    <Text style={{ fontSize: 10, marginTop: 15}}>
                    ___________________________
                    </Text>
                    <Text style={{ fontSize: 10, marginBottom: 5, marginTop: 2 }}>
                    Maxima Angelita R. Arasa
                    </Text>
                    <Text style={{ fontSize: 8 }}>Barangay Treasurer</Text>
                </View>
                <View style={styles.brgyTreasurer}>
                <Text style={{ fontSize: 10, marginTop: 20 }}>
                    Date: ___________________________
                    </Text>
                </View>
            </View>
            <View style={styles.rightSignatory}>
                <Text style={{ fontSize: 10, marginTop: 25 }}>
                    Very truly Yours,
                    </Text>
                    <Text style={{ fontSize: 10, marginTop: 15 }}>
                    ___________________________
                    </Text>
                    <Text style={{ fontSize: 10, marginBottom: 5, marginTop: 2 }}>
                    Lily M. Balanon
                    </Text>
                    <Text style={{ fontSize: 8 }}>Punong Barangay</Text>
            </View>
        </View>

      </Page>
    </Document>
  );
};

export default PunongBarangayTemplate;

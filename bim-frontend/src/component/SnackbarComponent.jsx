import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackbarComponent = ({pageState, successSnackBarState, handleClose, notification, failedSnackBarState}) => {

    return (
    <>
      {pageState === `${pageState}` ? (
        <Snackbar
          open={successSnackBarState}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{
              width: "100%",
              margin: "1em",
              fontSize: "1em",
            }}
          >
            {notification}
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          open={failedSnackBarState}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{
              width: "100%",
              margin: "1em",
              fontSize: "1em",
            }}
          >
            {notification}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default SnackbarComponent;

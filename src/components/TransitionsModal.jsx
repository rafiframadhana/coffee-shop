import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "420px",
  backgroundColor: "#2C1A15",
  color: "#EAD9C6",
  borderRadius: "16px",
  boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.5)",
  padding: "24px",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  fontFamily: "'Merriweather', serif",
  transition: "all 0.4s ease-in-out",
  backdropFilter: "blur(10px)",
  letterSpacing: "0.5px",
};

export default function TransitionsModal({
  open,
  handleClose,
  title,
  message,
}) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6">
            {title}
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
          <Button
            onClick={handleClose}
            sx={{
              mt: 3,
              backgroundColor: "#C89F85",
              color: "#2C1A15",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "8px 16px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#B38B6D",
              },
            }}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}

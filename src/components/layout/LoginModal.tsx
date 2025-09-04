import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button } from "@mui/material";

import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./signUp";

type ModalProps = {
  text: string;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export default function LoginModal({ text }: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsSignUp(false);
  };

  const toggleMode = () => setIsSignUp(!isSignUp);

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        {text}
      </Button>
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
            {isSignUp ? (
              <SignUpForm onToggleMode={toggleMode} />
            ) : (
              <LoginForm onToggleMode={toggleMode} />
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

import React, { useState } from "react";
import supabase from "./config/supabaseClient.js";
import {
  Button,
  TextField,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AddData = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newChapter, setNewChapter] = useState("");
  const [success, setSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSuccess(false);
    }, 1000); 
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleChapterChange = (event) => {
    setNewChapter(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newData = { title: newTitle, chapter: newChapter };
    const { data: error } = await supabase.from("Manhwa").insert([newData]);
    if (error) {
      console.error("Error adding data:", error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      handleClose();
      setNewTitle("");
      setNewChapter("");
      onAdd(newData);
    }
  };

  const handleBackdropClick = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="add data"
        sx={{
          mt: 2,
          position: 'absolute',
          right: '20px',
          mb: 2,
          bgcolor: "#003C43",
          color: "primary.contrastText",
          "&:hover": {
            bgcolor: "#135D66",
          },
        }}
      >
        <AddIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        BackdropProps={{ onClick: handleBackdropClick }}
        fullWidth={!isMobile}
        maxWidth="md"
      >
        <DialogTitle sx={{ bgcolor: "#003C43", color: "primary.contrastText" }}>
          New Manhwa
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ marginBottom: 2, marginTop: 2 }}>
              <FormControl fullWidth>
                <FormLabel>Title:</FormLabel>
                <TextField
                  label="Title"
                  value={newTitle}
                  onChange={handleTitleChange}
                  fullWidth
                />
              </FormControl>
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <FormControl fullWidth>
                <FormLabel>Chapter:</FormLabel>
                <TextField
                  label="Chapter"
                  value={newChapter}
                  onChange={handleChapterChange}
                  fullWidth
                />
              </FormControl>
            </Box>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#0034C3",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "#135D66",
                  },
                }}
              >
                Add Data
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Data added successfully! <CheckCircleIcon sx={{ ml: 1 }} />
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddData;

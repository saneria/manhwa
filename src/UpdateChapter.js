import React, { useState } from "react";
import {
  Button,
  Modal,
  TextField,
  FormControl,
  FormGroup,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close';
import supabase from "./config/supabaseClient.js";
import { useTheme, useMediaQuery } from "@mui/material";

const UpdateChapter = ({ id, initialChapter, onUpdate }) => {
  const [chapter, setChapter] = useState(initialChapter || "");
  const [showModal, setShowModal] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChapterChange = (event) => {
    setChapter(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Chapter before update:", chapter);

    onUpdate({ id, chapter });

    console.log("Chapter after update:", chapter);

    const { error } = await supabase
      .from("Manhwa")
      .update({ chapter: chapter })
      .eq("id", id);
    if (error) {
      console.error("Error updating chapter:", error.message);
    } else {
      setChapter(""); 
      setShowModal(false);
    }
  };

  return (
    <>
      <IconButton onClick={() => setShowModal(true)}>
        <EditIcon />
      </IconButton>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            width: isMobile ? "90%" : "30%",
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <IconButton onClick={() => setShowModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FormControl component="form" onSubmit={handleSubmit} fullWidth>
            <FormGroup>
              <TextField
                label="Chapter"
                type="text"
                value={chapter}
                onChange={handleChapterChange}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ mt: 2 }}
              >
                Update Chapter
              </Button>
            </FormGroup>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateChapter;

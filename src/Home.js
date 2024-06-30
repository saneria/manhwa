import React, { useState, useEffect } from "react";
import supabase from "./config/supabaseClient.js";
import AddData from "./AddData.js";
import UpdateChapter from "./UpdateChapter.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  InputBase,
  Typography,
  Pagination,
  Box,
  TableSortLabel,
  useMediaQuery,
  useTheme,
  Snackbar, 
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const Home = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null); // Notification state

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: fetchedData, error } = await supabase
      .from("Manhwa")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setData(fetchedData);
    }
  };

  const handleAddData = (newData) => {
    setData([newData, ...data]);
  };

  const handleUpdateChapter = (updatedData) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === updatedData.id
          ? { ...item, chapter: updatedData.chapter }
          : item
      )
    );
    // Set notification
    setNotification("Chapter updated successfully");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedData = [...data].sort((a, b) => {
      if (key === "title") {
        return direction === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (key === "chapter") {
        return direction === "asc"
          ? a.chapter - b.chapter
          : b.chapter - a.chapter;
      }
      return 0;
    });
    setData(sortedData);
  };

  const filteredData = data.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div>
      <Snackbar
        open={notification !== null}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        message={notification}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      />
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#003C43", boxShadow: 5, padding: "10px 0" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant={isMobile ? "h6" : "h4"}
            noWrap
            sx={{ fontWeight: "bold", letterSpacing: 1 }}
          >
            CATALOG OF MANWHA
          </Typography>
          <Box
            sx={{
              position: "relative",
              backgroundColor: "#E3FEF7",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              width: isMobile ? "70%" : "auto",
            }}
          >
            <SearchIcon style={{ marginRight: "10px", color: "gray" }} />
            <InputBase
              placeholder="Search by title"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ padding: "5px 0", width: "100%" }}
            />
          </Box>
          {/* Button for Recently Read removed */}
        </Toolbar>
      </AppBar>
      <AddData onAdd={handleAddData} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 5,
          px: isMobile ? 2 : 0,
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            width: isMobile ? "100%" : "80%",
            boxShadow: 5,
            padding: isMobile ? 1 : 3,
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              "& .MuiTableCell-root": {
                borderBottom: "1px solid #ddd",
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "title"}
                    direction={sortConfig.direction}
                    onClick={() => handleSort("title")}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "chapter"}
                    direction={sortConfig.direction}
                    onClick={() => handleSort("chapter")}
                  >
                    Chapter
                  </TableSortLabel>
                </TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.chapter}</TableCell>
                  <TableCell>
                    <UpdateChapter
                      id={item.id}
                      initialChapter={item.chapter}
                      onUpdate={handleUpdateChapter}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 3 }}>
        <Pagination
          count={Math.ceil(filteredData.length / itemsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          size="small"  // Changed this line to make the pagination numbers smaller
          color="primary"
        />
      </Box>
    </div>
  );
};

export default Home;

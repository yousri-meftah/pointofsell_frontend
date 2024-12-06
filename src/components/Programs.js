import React, { useState, useEffect } from "react";
import {
  Button,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PrintIcon from "@mui/icons-material/Print";
import api from "../services/api";
import ProgramModal from "../components/ProgramModal";

const Programs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [couponPrograms, setCouponPrograms] = useState([]);
  const [buyXGetYPrograms, setBuyXGetYPrograms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchcoupanPrograms();
    fetchBUYXGETYPrograms();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };
  const fetchBUYXGETYPrograms = async () => {
    try {
      const response = await api.get("/programs/BUYXGETY_program", {});
      const programs = response.data.programs;
      setBuyXGetYPrograms(programs || []);
    } catch (error) {
      console.error("Failed to fetch programs", error);
    }
  };
  const fetchcoupanPrograms = async () => {
    try {
      const response = await api.get("/programs/coupon_program", {});
      const programs = response.data.programs;
      setCouponPrograms(programs || []);
    } catch (error) {
      console.error("Failed to fetch programs", error);
    }
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleAddProgram = () => {
    setSelectedProgram(null);
    setModalOpen(true);
  };

  const handleSaveProgram = async (program) => {
    try {
      
      
      console.log("program = ",program);
      
      // Normalize the program object
      const normalizedProgram = {
        name: program.name || "",
        description: program.description || "",
        program_type: program.program_type || "DISCOUNT",
        start_date: program.start_date || null,
        end_date: program.end_date || null,
        discount: parseFloat(program.discount) ?? 0, // Ensure null if not provided
        product_buy_id: program.buy_item ?? null,
        product_get_id: program.get_item ?? null,
        program_status: 1,
        count: program.coupon_count|| 0 ,
      };
  
      // Send to API
      if (selectedProgram) {
        // Update existing program
        await api.put(`/programs/${selectedProgram.id}`, normalizedProgram, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        // Add new program
        await api.post("/programs", normalizedProgram, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
  
      // Refetch programs
      fetchcoupanPrograms();
      fetchBUYXGETYPrograms();
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save program", error);
      alert("An error occurred while saving the program. Please try again.");
    }
  };
  

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };
  //console.log("couponPrograms = ", couponPrograms);
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="program tabs"
        >
          <Tab label="Coupon" />
          <Tab label="BuyXGetY" />
        </Tabs>
        <Button variant="contained" color="primary" onClick={handleAddProgram}>
          Add Program
        </Button>
      </Box>
      {tabIndex === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Send</TableCell>
                <TableCell>Print</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {couponPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>{program.code}</TableCell>
                  <TableCell>{program.discount}</TableCell>
                  <TableCell>{program.status}</TableCell>
                  <TableCell>
                    <IconButton>
                      <SendIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {tabIndex === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Buy Item</TableCell>
                <TableCell>Get Item</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Send</TableCell>
                <TableCell>Print</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buyXGetYPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>{program.code}</TableCell>
                  <TableCell>{program.product_buy_id}</TableCell>
                  <TableCell>{program.product_get_id}</TableCell>
                  <TableCell>{program.status}</TableCell>
                  <TableCell>
                    <IconButton>
                      <SendIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ProgramModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProgram}
        initialData={selectedProgram || {}}
        products={products}
      />
    </Box>
  );
};

export default Programs;

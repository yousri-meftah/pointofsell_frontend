import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import PricelistModal from "../components/PricelistModal"; // Adjust this to a more suitable name for pricelists if needed
import ProductLineModal from "../components/ProductLineModal"; // New modal for adding product lines

const Pricelists = () => {
  const [pricelists, setPricelists] = useState([]);
  const [pricelistProducts, setPricelistProducts] = useState({});
  const [selectedPricelist, setSelectedPricelist] = useState(null);
  const [selectedProductLine, setSelectedProductLine] = useState(null); // For editing product lines
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Separate confirm modal for deleting product lines
  const [productLineModalOpen, setProductLineModalOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchPricelists();
    fetchProducts();
  }, []);

  const fetchPricelists = async () => {
    try {
      const response = await api.get("/pricelists", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPricelists(response.data.items);
    } catch (error) {
      console.error("Failed to fetch pricelists", error);
    }

    try {
      const response = await api.get("/pricelists/pricelists_with_lines", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPricelistProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch pricelist products", error);
    }
  };

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

  const handleAddPricelist = () => {
    setSelectedPricelist(null);
    setModalOpen(true);
  };

  const handleEditPricelist = (pricelist) => {
    setSelectedPricelist(pricelist);
    setModalOpen(true);
  };

  const handleDeletePricelist = (name) => {
    setSelectedPricelist({ name });
    setConfirmOpen(true);
  };

  const handleSavePricelist = async (pricelist) => {
    if (selectedPricelist && selectedPricelist.name) {
      // Update pricelist
      try {
        await api.patch(`/pricelists/${selectedPricelist.id}`, pricelist, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to update pricelist", error);
      }
    } else {
      // Add pricelist
      try {
        await api.post("/pricelists/pricelists", pricelist, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to add pricelist", error);
      }
    }
    setModalOpen(false);
    fetchPricelists();
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/pricelists/${selectedPricelist.name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPricelists();
    } catch (error) {
      console.error("Failed to delete pricelist", error);
    }
    setConfirmOpen(false);
  };

  const handleAddProductLine = (pricelistId) => {
    setSelectedPricelist(pricelistId);
    setSelectedProductLine(null); // Ensure no product line is selected for adding new
    setProductLineModalOpen(true);
  };

  const handleEditProductLine = (line) => {
    setSelectedProductLine(line);
    setProductLineModalOpen(true);
  };

  const handleSaveProductLine = async (productLine) => {
    if (selectedProductLine && selectedProductLine.id) {
      // Update product line
      try {
        await api.patch(
          `/pricelist/${selectedProductLine.id}`,
          productLine,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchPricelists();
      } catch (error) {
        console.error("Failed to update product line", error);
      }
    } else {
      // Add product line
      try {
        await api.post("/pricelist", productLine, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to add product line", error);
      }
    }
    setProductLineModalOpen(false);
    fetchPricelists();
  };

  const handleDeleteProductLine = (line) => {
    setSelectedProductLine(line);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteProductLine = async () => {
    try {
      await api.delete(`/pricelists/pricelist_line/${selectedProductLine.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPricelists();
    } catch (error) {
      console.error("Failed to delete product line", error);
    }
    setConfirmDeleteOpen(false);
  };
  console.log("yo = ", pricelistProducts);
  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Pricelists</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPricelist}
        >
          Add Pricelist
        </Button>
      </Box>
      {pricelists.map((pricelist) => (
        <Accordion key={pricelist.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${pricelist.id}-content`}
            id={`panel${pricelist.id}-header`}
          >
            <Typography>{pricelist.name}</Typography>
            <Typography sx={{ color: "text.secondary", ml: 2 }}>
              {pricelist.description}
            </Typography>
            <IconButton onClick={() => handleEditPricelist(pricelist)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeletePricelist(pricelist.name)}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => handleAddProductLine(pricelist.id)}>
              <AddIcon />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>New Price</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(pricelistProducts[pricelist.id] || []).map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>{line.product_name}</TableCell>
                      <TableCell>{line.new_price}</TableCell>
                      <TableCell>
                        {new Date(line.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(line.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditProductLine(line)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDeleteProductLine(line)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
      <PricelistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSavePricelist}
        initialData={selectedPricelist || {}}
      />
      <ProductLineModal
        open={productLineModalOpen}
        onClose={() => setProductLineModalOpen(false)}
        onSave={handleSaveProductLine}
        pricelistId={selectedPricelist}
        products={products}
        initialData={selectedProductLine || {}} // Pass initial data for editing
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this pricelist?"
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDeleteProductLine}
        message="Are you sure you want to delete this product line?"
      />
    </Box>
  );
};

export default Pricelists;

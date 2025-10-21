import { useState, useMemo, useCallback } from "react";
import { useProducts, useUpdateProduct, useDeleteProduct } from "../../hooks/useProducts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Modal,
  Button,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import { filterBySearch, truncateText } from "../../utils/search";
import { formatCurrency } from "../../utils/format";
import { useToast } from "../../hooks/useToast";

function EditProduct() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // React Query hooks
  const { data: products = [], isLoading } = useProducts();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Toast notifications
  const { message, type, showSuccess, showError } = useToast();

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return filterBySearch(products, searchTerm, [
      'item',
      'description',
      'contain',
      'src',
      'price',
      '_id'
    ]);
  }, [products, searchTerm]);

  // Memoized callbacks
  const handleEditClick = useCallback((product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      await updateProduct.mutateAsync({
        id: selectedProduct._id,
        data: {
          item: selectedProduct.item,
          src: selectedProduct.src,
          contain: selectedProduct.contain,
          price: Number(selectedProduct.price),
          description: selectedProduct.description,
        },
      });

      showSuccess("Product updated successfully");
      setOpenModal(false);
    } catch (err) {
      showError(err.message || "Failed to update product");
      console.error(err);
    }
  }, [selectedProduct, updateProduct, showSuccess, showError]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteProduct.mutateAsync(id);
      showSuccess("Product deleted successfully");
      setConfirmOpen(false);
    } catch (err) {
      showError(err.message || "Failed to delete product");
    }
  }, [deleteProduct, showSuccess, showError]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <h2 className="form-title">
        Edit Product Details{" "}
        <EditIcon sx={{ ml: 0.5, verticalAlign: "middle", mb: 0.5 }} />
      </h2>

      <label>
        <SearchIcon sx={{ ml: 3, verticalAlign: "middle", color: "black" }} />
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </label>

      <Box sx={{ maxWidth: 1500, margin: "2rem auto", p: 2 }}>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontSize: "18px",
                    fontFamily: "Arial",
                    textAlign: "center",
                    verticalAlign: "middle",
                  },
                }}
              >
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Item</strong>
                </TableCell>
                <TableCell>
                  <strong>Image</strong>
                </TableCell>
                <TableCell>
                  <strong>Contain</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.map(
                ({ _id, item, src, contain, price, description }) => (
                  <TableRow
                    key={_id}
                    sx={{
                      "& td": {
                        fontSize: "14px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: "0.8rem",
                        maxWidth: 150,
                        wordBreak: "break-all",
                        fontWeight: "600",
                      }}
                    >
                      {_id}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        wordBreak: "break-all",
                      }}
                    >
                      {item}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        wordBreak: "break-all",
                      }}
                    >
                      {src}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        wordBreak: "break-all",
                      }}
                    >
                      {contain}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(price)}
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 280,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                    >
                      {truncateText(description, 100)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit Product" arrow>
                        <EditIcon
                          sx={{
                            color: "grey",
                            ml: 0.5,
                            verticalAlign: "middle",
                            cursor: "pointer",
                            "&:hover": {
                              color: "black",
                            },
                          }}
                          onClick={() =>
                            handleEditClick({
                              _id,
                              item,
                              src,
                              contain,
                              price,
                              description,
                            })
                          }
                        />
                      </Tooltip>

                      <Tooltip title="Delete Product" arrow>
                        <DeleteIcon
                          sx={{
                            color: "red",
                            ml: 2,
                            verticalAlign: "middle",
                            cursor: "pointer",
                            "&:hover": {
                              color: "black",
                            },
                          }}
                          onClick={() => {
                            setProductToDelete({ _id, item });
                            setConfirmOpen(true);
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              )}

              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <div className="notification-container">
        {message && <p className={`notification ${type}`}>{message}</p>}
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            fontFamily: "Arial, sans-serif",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: "bold",
              fontSize: "1.6rem",
              color: "#333",
              fontFamily: "Arial, sans-serif",
              textAlign: "center",
            }}
          >
            Edit Product Details
          </h2>

          <TextField
            name="item"
            label="Item"
            value={selectedProduct?.item || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="src"
            label="Image URL"
            value={selectedProduct?.src || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="contain"
            label="Contain"
            value={selectedProduct?.contain || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={selectedProduct?.price || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            multiline
            rows={3}
            value={selectedProduct?.description || ""}
            onChange={handleInputChange}
            fullWidth
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              onClick={() => setOpenModal(false)}
              variant="outlined"
              sx={{
                fontFamily: "Arial",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              sx={{
                fontFamily: "Arial",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            p: 4,
          }}
        >
          <h2
            style={{
              fontFamily: "Arial, sans-serif",
              margin: "0 0 16px",
              fontWeight: "bold",
              fontSize: "1.3rem",
              textAlign: "center",
              color: "black",
            }}
          >
            Confirm Deletion
          </h2>
          <p
            style={{
              marginBottom: "24px",
              fontSize: "1rem",
              lineHeight: 1.5,
              fontFamily: "Arial, sans-serif",
              textAlign: "center",
              color: "black",
            }}
          >
            Are you sure you want to delete{" "}
            <strong>{productToDelete?.item}</strong> from your database? This
            action cannot be undone.
          </p>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              onClick={() => setConfirmOpen(false)}
              variant="outlined"
              sx={{
                fontFamily: "Arial",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDelete(productToDelete._id);
                setConfirmOpen(false);
              }}
              variant="contained"
              color="error"
              sx={{
                fontFamily: "Arial",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
              }}
            >
              Yes, Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default EditProduct;

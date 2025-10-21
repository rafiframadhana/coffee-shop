import { useState, useMemo, useCallback } from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { useProducts } from "../../hooks/useProducts";
import { filterBySearch, truncateText } from "../../utils/search";
import { formatCurrency } from "../../utils/format";

function ViewProducts() {
  const [searchTerm, setSearchTerm] = useState("");

  // React Query hook for products data
  const { data: products = [], isLoading, error } = useProducts();

  // Memoized filtered products using utility function
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

  // Memoized copy to clipboard handler
  const handleCopyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
  }, []);

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
        View All Products{" "}
        <ViewListIcon
          sx={{ color: "grey", ml: 0.5, verticalAlign: "middle", mb: 0.5 }}
        />
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
                  <strong>View</strong>
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
                      <Tooltip title="Copy to clipboard" arrow>
                        <ContentCopyRoundedIcon
                          sx={{
                            fontSize: 17,
                            ml: 1.2,
                            verticalAlign: "middle",
                            mb: 0.4,
                            cursor: "pointer",
                            color: "grey",
                            transition: "color 0.3s",
                            "&:hover": {
                              color: "black",
                            },
                          }}
                          onClick={() => handleCopyToClipboard(_id)}
                        />
                      </Tooltip>
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
                      <Tooltip title="Copy to clipboard" arrow>
                        <ContentCopyRoundedIcon
                          sx={{
                            fontSize: 17,
                            ml: 1.2,
                            verticalAlign: "middle",
                            mb: 0.4,
                            cursor: "pointer",
                            color: "grey",
                            transition: "color 0.3s",
                            "&:hover": {
                              color: "black",
                            },
                          }}
                          onClick={() => handleCopyToClipboard(src)}
                        />
                      </Tooltip>
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
                      <a
                        href={`https://coffeeculture-id.netlify.app/product/${_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-link-style"
                      >
                        <Tooltip title="View Products" arrow>
                          <RemoveRedEyeIcon
                            sx={{
                              color: "grey",
                              ml: 0.5,
                              verticalAlign: "middle",
                              cursor: "pointer",
                              "&:hover": {
                                color: "black",
                              },
                            }}
                          />
                        </Tooltip>
                      </a>
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
        {error && <p className="notification error">{error.message || "Failed to load products"}</p>}
      </div>
    </>
  );
}

export default ViewProducts;

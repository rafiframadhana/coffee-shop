import { useEffect, useState } from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import PersonIcon from "@mui/icons-material/Person";

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/user`, {
          credentials: "include",
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

    function truncateText(text, maxLength) {
      if (!text) return "";
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

  const handleEditClick = (users) => {
    setSelectedUser(users);
    setOpenModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${API_URL}/api/user/${selectedUser._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: selectedUser.displayName,
            username: selectedUser.username,
            avatarUrl: selectedUser.avatarUrl,
            role: selectedUser.role,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit User");
      }

      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      setSuccess("User updated succesfully");

      setOpenModal(false);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUser) => prevUser.filter((user) => user._id !== id));

      setSuccess("User deleted succesfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      user.displayName.toLowerCase().includes(lowerCaseSearch) ||
      user.username.toLowerCase().includes(lowerCaseSearch) ||
      user.avatarUrl?.toLowerCase().includes(lowerCaseSearch) ||
      user.role.toLowerCase().includes(lowerCaseSearch) ||
      user._id.toLowerCase().includes(lowerCaseSearch)
    );
  });

  return (
    <>
      <h2 className="form-title">
        User Management{" "}
        <PersonIcon sx={{ ml: 0.5, verticalAlign: "middle", mb: 0.5 }} />
      </h2>

      <label>
        <SearchIcon sx={{ ml: 3, verticalAlign: "middle", color: "black" }} />
        <input
          type="text"
          placeholder="Search user..."
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
                  <strong>Display Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Username</strong>
                </TableCell>
                <TableCell>
                  <strong>Avatar URL</strong>
                </TableCell>
                <TableCell>
                  <strong>Role</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map(
                ({ _id, displayName, username, avatarUrl, role }) => (
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
                      {displayName}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        wordBreak: "break-all",
                      }}
                    >
                      {username}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                    >
                      {truncateText(avatarUrl ? avatarUrl : "Default", 100)}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        wordBreak: "break-all",
                      }}
                    >
                      {role}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit User" arrow>
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
                              displayName,
                              username,
                              avatarUrl,
                              role,
                            })
                          }
                        />
                      </Tooltip>

                      <Tooltip title="Delete User" arrow>
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
                            setUserToDelete({ _id, username });
                            setConfirmOpen(true);
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              )}

              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <div className="notification-container">
        {error && <p className="notification error">{error}</p>}
        {success && <p className="notification success">{success}</p>}
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
            Edit User Details
          </h2>

          <TextField
            name="displayName"
            label="Display Name"
            value={selectedUser?.displayName || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="username"
            label="Username"
            value={selectedUser?.username || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="avatarUrl"
            label="Avatar URL"
            value={selectedUser?.avatarUrl || ""}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={selectedUser?.role || ""}
              onChange={handleInputChange}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

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
            Are you sure you want to delete user:{" "}
            <strong>{userToDelete?.username}</strong> from your database? This
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
                handleDelete(userToDelete._id);
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

export default UserManagement;

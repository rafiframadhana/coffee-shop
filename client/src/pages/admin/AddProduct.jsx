import AddBoxIcon from "@mui/icons-material/AddBox";
import { useEffect, useState } from "react";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    item: "",
    src: "",
    contain: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const productData = {
      ...formData,
      contain: formData.contain
        .split(",")
        .map((item) => item.trim())
        .join(" | "),
      price: parseFloat(formData.price),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/coffee`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save Product");
      }

      const savedProduct = await response.json();
      setSuccess("Product saved succesfully");
      setFormData({
        item: "",
        src: "",
        contain: "",
        price: "",
        description: "",
      });
      console.log(savedProduct);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="form-title">
        Add Product to the Database{" "}
        <AddBoxIcon
          sx={{ color: "green", ml: 0.5, verticalAlign: "middle", mb: 0.5 }}
        />
      </h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          Item Name:
          <input
            name="item"
            type="text"
            value={formData.item}
            onChange={handleChange}
            required
            placeholder="e.g. Mango Juice"
          />
        </label>

        <label>
          Image Link:
          <input
            name="src"
            type="text"
            value={formData.src}
            onChange={handleChange}
            required
            placeholder="e.g. https://..."
          />
        </label>

        <label>
          Drink Contain:
          <input
            name="contain"
            type="text"
            value={formData.contain}
            onChange={handleChange}
            required
            placeholder="e.g. Milk, Sugar"
          />
        </label>

        <label>
          Price:
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="e.g. 10000"
            type="number"
            step="0.01"
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Write something about the product..."
            rows={4}
          ></textarea>
        </label>

        <div className="button-wrapper">
          <button disabled={loading} type="submit">
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>

      <div className="notification-container">
        {error && <p className="notification error">{error}</p>}
        {success && <p className="notification success">{success}</p>}
      </div>
    </>
  );
}

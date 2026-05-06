import {
  useEffect,
  useState,
} from "react";

import API from "../../../services/api";

import "./MetaManager.css";

const MetaManager = () => {

  // =====================================================
  // ================= STATES ============================
  // =====================================================

  const [categories, setCategories] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  const [categoryInput, setCategoryInput] =
    useState("");

  const [cityInput, setCityInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // ================= FETCH =============================
  // =====================================================

  const fetchData = async () => {

    try {

      setLoading(true);

      const catRes =
        await API.get(
          "/meta/categories"
        );

      const cityRes =
        await API.get(
          "/meta/cities"
        );

      setCategories(
        Array.isArray(
          catRes.data
        )
          ? catRes.data
          : []
      );

      setCities(
        Array.isArray(
          cityRes.data
        )
          ? cityRes.data
          : []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // =====================================================
  // ================= ADD CATEGORY ======================
// =====================================================

  const addCategory =
    async () => {

      if (
        !categoryInput.trim()
      ) {
        return alert(
          "Enter category"
        );
      }

      try {

        await API.post(
          "/meta/categories",
          {
            name:
              categoryInput,
          }
        );

        setCategoryInput("");

        fetchData();

      } catch (err) {

        console.log(err);

        alert(
          "Add category failed"
        );
      }
    };

  // =====================================================
  // ================= ADD CITY ==========================
// =====================================================

  const addCity =
    async () => {

      if (
        !cityInput.trim()
      ) {
        return alert(
          "Enter city"
        );
      }

      try {

        await API.post(
          "/meta/cities",
          {
            name:
              cityInput,
          }
        );

        setCityInput("");

        fetchData();

      } catch (err) {

        console.log(err);

        alert(
          "Add city failed"
        );
      }
    };

  // =====================================================
  // ================= DELETE CATEGORY ===================
// =====================================================

  const deleteCategory =
    async (id) => {

      if (
        !window.confirm(
          "Delete category?"
        )
      ) {
        return;
      }

      try {

        await API.delete(
          `/meta/categories/${id}`
        );

        fetchData();

      } catch (err) {

        console.log(err);

        alert(
          "Delete failed"
        );
      }
    };

  // =====================================================
  // ================= DELETE CITY =======================
// =====================================================

  const deleteCity =
    async (id) => {

      if (
        !window.confirm(
          "Delete city?"
        )
      ) {
        return;
      }

      try {

        await API.delete(
          `/meta/cities/${id}`
        );

        fetchData();

      } catch (err) {

        console.log(err);

        alert(
          "Delete failed"
        );
      }
    };

  // =====================================================
  // ================= UI ================================
// =====================================================

  return (
    <div className="meta-container">

      <h2 className="meta-title">
        ⚙ Meta Manager
      </h2>

      {loading && (
        <p>
          Loading...
        </p>
      )}

      {/* ================================================= */}
      {/* ================= CATEGORY ====================== */}
      {/* ================================================= */}

      <div className="meta-box">

        <h3>
          📂 Categories
        </h3>

        <div className="meta-form">

          <input
            type="text"
            placeholder="Add category"
            value={
              categoryInput
            }
            onChange={(e) =>
              setCategoryInput(
                e.target.value
              )
            }
          />

          <button
            onClick={
              addCategory
            }
          >
            Add
          </button>

        </div>

        <div className="meta-list">

          {categories.map(
            (item) => (
              <div
                key={item._id}
                className="meta-item"
              >
                <span>
                  {item.name}
                </span>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteCategory(
                      item._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            )
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* ================= CITIES ======================== */}
      {/* ================================================= */}

      <div className="meta-box">

        <h3>
          🏙 Cities
        </h3>

        <div className="meta-form">

          <input
            type="text"
            placeholder="Add city"
            value={cityInput}
            onChange={(e) =>
              setCityInput(
                e.target.value
              )
            }
          />

          <button
            onClick={addCity}
          >
            Add
          </button>

        </div>

        <div className="meta-list">

          {cities.map(
            (item) => (
              <div
                key={item._id}
                className="meta-item"
              >
                <span>
                  {item.name}
                </span>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteCity(
                      item._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default MetaManager;
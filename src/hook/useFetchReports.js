import { useEffect, useState } from "react";
import axios from "axios";

export const useFetchReports = () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/reports`);
        setData(response.data);
      } catch (err) {
        setError(err.message || "Error call api");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { data, loading, error };
};

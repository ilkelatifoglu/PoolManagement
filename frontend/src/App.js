import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [apiStatus, setApiStatus] = useState({ status: "loading" });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/test`)
      .then((response) => setApiStatus(response.data))
      .catch((error) =>
        setApiStatus({
          status: "error",
          message: "Failed to connect to API",
        })
      );
  }, []);

  return (
    <div className="App">
      <h1>API Status</h1>
      {apiStatus.status === "loading" ? (
        <p>Checking API status...</p>
      ) : (
        <div>
          <p>Status: {apiStatus.status}</p>
          <p>Message: {apiStatus.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useReducer } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListProduct from "../components/list-product";
import { productReducer, initialState } from "../api/reducers";
import FetchingSpinner from "../components/spinner";
import MessageBox from "../components/message-box";
import logger from "use-reducer-logger";
import { Helmet } from "react-helmet-async";
import { errorHandler } from "../script/error";
import http from "../lib/http";

function HomePage() {
  const [{ loading, error, products }, dispatch] = useReducer(
    logger(productReducer),
    initialState
  );

  const styleLoader = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "fixed",
    left: "0px",
    top: "80px",
    width: "100%",
    height: "70%",
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await http.get("/api/products");

        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        console.log(error);
        dispatch({ type: "FETCH_FAIL", payload: errorHandler(error) });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-4">
      {loading ? (
        <div style={styleLoader} className="fs-3">
          <FetchingSpinner />
          <div className="pl-4 ml-4"> fetching...</div>
        </div>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : !loading && !error && products.length === 0 ? (
        <div style={styleLoader} className="fs-4">
          <div>
            <i className="bi bi-exclamation-circle fs-3"></i>
          </div>
          <div className="pl-4 ml-4">No Product</div>
        </div>
      ) : (
        <Row>
          <Helmet>
            <title>Home</title>
          </Helmet>
          <h1>Feature Product</h1>
          {products.length > 0 &&
            products.map((product) => (
              <Col
                key={product._id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-3"
              >
                <ListProduct product={product} />
              </Col>
            ))}
        </Row>
      )}
    </div>
  );
}

export default HomePage;

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../firebase";
import { Spinner } from "./components/Spinner";
const db = getFirestore(firebaseApp);
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function Album() {
  const [value, setValue] = useState(2);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProductos() {
      const productosCol = collection(db, "products");
      const productosSnapshot = await getDocs(productosCol);
      const productosList = productosSnapshot.docs.map((doc) => doc.data());
      setProducts(productosList);
      setIsLoading(false);
    }
    getProductos();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container sx={{ py: 8 }} maxWidth="ms">
          <Grid
            container
            spacing={4}
            display={"flex"}
            justifyContent={"center"}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              products.map((products) => (
                <Grid item key={products} xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        // 16:9

                        pt: "0%",
                      }}
                      image={products.img}
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {products.name}
                        <Rating
                          name="simple-controlled"
                          value={value}
                          onChange={(event, newValue) => {
                            setValue(newValue);
                          }}
                        />
                        <Typography gutterBottom variant="h5" component="h2">
                          {" "}
                          $ {products.price}
                        </Typography>
                      </Typography>
                      <Typography>
                        {products.description &&
                        products.description.length > 100
                          ? products.description.substring(0, 100) + "..."
                          : products.description}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ display: "flex", justifyContent: "end" }}
                    >
                      {" "}
                      <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddShoppingCartIcon />}
                      >
                        Añadir al Carrito
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}

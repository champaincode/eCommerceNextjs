"use client";
import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
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
import Link from "next/link";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Spinner from "./components/Spinner";
import { useAuth } from "../app/context/authContext";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { useProductsContext } from "./context/productsContext";
import { useCartContext } from "./context/cartContext";
import { db } from "../firebase";

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

const theme = createTheme();

export default function Home() {
  const [value, setValue] = useState(2);
  const { products, isLoading } = useProductsContext();
  const { addToCart, getCartItems } = useCartContext();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [getCartItems, user]);

  const handleAddtoCartNoLogged = () => {
    toast("Tienes que inicia sesión, para poder comprar.", {
      action: {
        label: (
          <p
            style={{
              marginTop: "5px",
              height: "200px",
              width: "100px",
              textAlign: "center",
            }}
          >
            Iniciar sesión
          </p>
        ),
        onClick: () => router.push("/views/login"),
      },
    });
    //
  };

  const handleAddtoCartLogged = async (products) => {
    toast.success("Agregaste este producto a tu carrito");
    getCartItems();
  };
  function handleAddtoFavoritesLogged() {
    toast("¿Quieres agregar este producto a tus favoritos", {
      action: {
        label: (
          <p
            style={{
              marginTop: "5px",
              height: "200px",
              width: "100px",
              textAlign: "center",
            }}
          >
            Agregar
          </p>
        ),
        onClick: () => toast.success("Agregaste este producto a tus favoritos"),
      },
    });
  }

  function handleAddtoFavoritesLogged() {
    toast("¿Quieres agregar este producto a tus favoritos", {
      action: {
        label: (
          <p
            style={{
              marginTop: "5px",
              height: "200px",
              width: "100px",
              textAlign: "center",
            }}
          >
            Agregar
          </p>
        ),
        onClick: () => toast.success("Agregaste este producto a tus favoritos"),
      },
    });
  }

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
              products.map((products, id) => (
                <Grid item key={id} xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link href={`/views/products/${products.id}`}>
                      <CardMedia
                        component="img"
                        sx={{
                          // 16:9

                          pt: "0%",
                        }}
                        image={products.img}
                        alt="random"
                      />
                    </Link>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {products.name}
                        <Rating
                          name="simple-controlled"
                          value={products?.rating}
                          onChange={async (event, newValue) => {
                            setValue(newValue);
                            products.rating = newValue;
                            const productRef = doc(db, "products", products.id);
                            await setDoc(
                              productRef,
                              { rating: newValue },
                              { merge: true }
                            );
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
                      {user ? (
                        <IconButton
                          aria-label="add to favorites"
                          onClick={handleAddtoFavoritesLogged}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      ) : (
                        ""
                      )}
                      {user ? (
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() =>
                            handleAddtoCartLogged(addToCart(products))
                          }
                        >
                          Añadir al Carrito
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleAddtoCartNoLogged}
                          startIcon={<AddShoppingCartIcon />}
                        >
                          Añadir al Carrito
                        </Button>
                      )}
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

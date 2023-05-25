"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useFavoriteContext } from "@/app/context/favoriteContext";
import { useProductsContext } from "../../context/productsContext";
import { useAuth } from "../../context/authContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Spinner from "../../components/Spinner";
import { IconButton } from "@mui/material";

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

export default function Favorites() {
  const { isLoading } = useProductsContext();
  const { user, logout } = useAuth();
  const { favorite, getFavoriteItems, logoutFavorite } = useFavoriteContext();

  useEffect(() => {
    if (user) {
      getFavoriteItems();
    }
  }, [getFavoriteItems, user, logout]);

  useEffect(() => {
    if (!user) {
      logoutFavorite();
    }
  }, [logoutFavorite, user]);

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
            ) : favorite?.length ? (
              favorite.map((products, id) => (
                <Grid item key={id} xs={12} sm={6} md={3}>
                  <h1>Tus favoritos</h1>
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
                          // onClick={handleAddtoFavoritesLogged}
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
                          // onClick={() =>
                          //   handleAddtoCartLogged(addToCart(products))
                          // }
                        >
                          Comprar otra vez
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          // onClick={handleAddtoCartNoLogged}
                          startIcon={<AddShoppingCartIcon />}
                        >
                          Añadir al Carrito
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <h1>NO TENES FAVORITOS REY</h1>
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

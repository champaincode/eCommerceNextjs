"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardActionArea,
  Typography,
  CardMedia,
  Box,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import styles from "../../../styles/productId.module.css";
import { useAuth } from "@/app/context/authContext";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useCartContext } from "@/app/context/cartContext";
import Spinner from "../../../components/Spinner";

async function getProduct(productsId) {
  const docRef = doc(db, "products", productsId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    data.id = productsId;
    return data;
  } else {
    console.log("No such document!");
    return null;
  }
}

function ProductView({ params }) {
  const [value, setValue] = useState(1);
  const { productsId } = params;
  const [productData, setProductData] = useState(null);
  const { addToCart, getCartItems } = useCartContext();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [getCartItems, user]);

  useEffect(() => {
    async function fetchData() {
      const data = await getProduct(productsId);
      setProductData(data);
    }
    fetchData();
  }, [productsId]);

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
  };

  const handleAddtoCartLogged = async () => {
    if (user) {
      getCartItems();
    }
    toast.success("Agregaste este producto a tu carrito");
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

  return (
    <div>
      {productData ? (
        <>
          <Container sx={{ py: 8 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ maxWidth: 500, maxHeight: 500 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={productData.img}
                      alt={productData.name}
                    />
                  </CardActionArea>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h4" sx={{ marginBottom: "30px" }}>
                  {productData.name}
                </Typography>

                <Typography variant="p" sx={{ marginBottom: "100px" }}>
                  <Typography variant="h6">Description:</Typography>
                  {productData.description}
                </Typography>
                <Box
                  sx={{
                    py: 10,
                    display: "flex",
                  }}
                >
                  {user ? (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() =>
                        handleAddtoCartLogged(addToCart(productData))
                      }
                    >
                      Añadir al Carrito
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={handleAddtoCartNoLogged}
                    >
                      Añadir al Carrito
                    </Button>
                  )}
                  {user && (
                    <IconButton
                      aria-label="add to favorites"
                      onClick={handleAddtoFavoritesLogged}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  )}
                  <Typography variant="h6" sx={{ py: 1, marginLeft: "20px" }}>
                    ${productData.price}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default ProductView;

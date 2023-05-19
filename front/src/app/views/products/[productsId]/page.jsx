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
} from "@mui/material";
import Rating from "@mui/material/Rating";
import useMediaQuery from "@mui/material/useMediaQuery";
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

function page({ params }) {
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
  }, [user]);
  const matches = useMediaQuery("(max-width:1004px)");

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
          <Container
            sx={{ py: 8 }}
            className={matches ? styles.phoneView : styles.pcView}
          >
            <Box
              sx={{
                width: "500px",
                height: "500px",
              }}
            >
              <Typography variant="h4" sx={{ marginBottom: "30px" }}>
                {productData.name}
              </Typography>
              {/* <Rating
                name="simple-controlled"
                value={productData?.rating}
                onChange={async (event, newValue) => {
                  if (productData) {
                    setValue(newValue);
                    productData.rating = newValue;
                    const productRef = doc(db, "products", productData.id);
                   
                    await setDoc(
                      productRef,
                      { rating: newValue },
                      { merge: true }
                    );
                  } else {
                    throw new Error("productData is undefined");
                    setProductData(null);
                  }
                }}
              /> */}
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
            </Box>

            <Card
              sx={{ maxWidth: 500, marginTop: "10px", maxHeight: 500 }}
              className={styles.imgCard}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={productData.img}
                  alt={productData.name}
                />
              </CardActionArea>
            </Card>
          </Container>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default page;

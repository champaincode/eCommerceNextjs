import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Paper from "@mui/material/Paper";
import { useAuth } from "../context/authContext";
import { getDoc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase";
import { useCartContext } from "../context/cartContext";
import { toast } from "sonner";

const db = getFirestore(firebaseApp);
const CartDrawer = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { cart, setCart } = useCartContext();
  const { user } = useAuth();

  const userId = user?.uid;

  const cartsCollection = collection(db, "carts");

  const updateCartInFirestore = async () => {
    const cartDocRef = doc(cartsCollection, userId);

    const cartData = {
      cart: cart,
      total: getTotal(),
    };
    await setDoc(cartDocRef, cartData);

    const cartDocSnapshot = await getDoc(cartDocRef);

    if (cartDocSnapshot.exists()) {
      const cartData = cartDocSnapshot.data();
      setCart(cartData.cart);
    }

    const updatedCartData = {
      cart: cart,
      total: getTotal(),
    };
    await updateDoc(cartDocRef, updatedCartData);
  };

  const saveCartToFirestore = async (userId, cart) => {
    try {
      const cartRef = doc(db, "carts", userId);
      await setDoc(cartRef, { items: cart });
    } catch (error) {
      console.error("Error saving cart to Firestore: ", error);
    }
  };

  const loadCartFromFirestore = async (userId) => {
    try {
      const cartRef = doc(db, "carts", userId);
      const cartSnapshot = await getDoc(cartRef);
      return cartSnapshot.data().items;
    } catch (error) {
      console.error("Error loading cart from Firestore: ", error);
      return [];
    }
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleAddQuantity = (index) => {
    const newCartItems = [...cart];
    newCartItems[index].quantity += 1;
    setCart(newCartItems);
  };

  const handleRemoveQuantity = (index) => {
    const newCartItems = [...cart];
    if (newCartItems[index].quantity > 1) {
      newCartItems[index].quantity -= 1;
      setCart(newCartItems);
    }
  };
  const handleFinishPay = () => {
    setCart([]);
    toast.success("Compra finalizada");
  };

  const handleRemoveItem = (index) => {
    const newCartItems = [...cart];
    newCartItems.splice(index, 1);
    setCart(newCartItems);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <>
      <IconButton
        sx={{ marginRight: "15px", marginTop: "5px" }}
        onClick={handleDrawerOpen}
      >
        <Badge badgeContent={cart.length} color="error">
          <ShoppingCartIcon sx={{ fontSize: "35px" }} />
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerClose}>
        <List sx={{ width: "350px" }}>
          {cart.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <ListItemAvatar>
                <Paper elevation={3}>
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9

                      pt: "0%",
                    }}
                    image={
                      "https://images.pexels.com/photos/733854/pexels-photo-733854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=800&dpr=1"
                    }
                    alt="random"
                  />
                </Paper>
              </ListItemAvatar>
              <Box
                sx={{ display: "flex", alignContent: "flex-start" }}
                className="sda"
              >
                <ListItemText
                  primary={item.name}
                  secondary={`Precio: $${item.price}`}
                />
                <Box sx={{ marginLeft: "100px" }}>
                  <IconButton onClick={() => handleRemoveQuantity(index)}>
                    <RemoveIcon />
                  </IconButton>
                  {item.quantity}
                  <IconButton onClick={() => handleAddQuantity(index)}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              <ListItemSecondaryAction>
                <IconButton
                  sx={{ position: "absolute", top: -128, right: 27 }}
                  onClick={() => handleRemoveItem(index)}
                >
                  <DeleteIcon size={"large"} color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem>
            <ListItemText primary={`Total: $${getTotal()}`} />
          </ListItem>
          <ListItem>
            <Button variant="contained" onClick={handleFinishPay}>
              Finalizar Compra
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
export default CartDrawer;

import React, { useState, useEffect } from "react";
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
import { useCartContext } from "../context/cartContext";
import { toast } from "sonner";

const CartDrawer = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { cart, setCart } = useCartContext();
  const { removeFromCart, getCartItems, clearCart } = useCartContext();
  const { incrementQuantity, decrementQuantity } = useCartContext();
  const { user } = useAuth();

  const handleDrawerOpen = () => {
    if (user?.uid) {
      getCartItems();
    }

    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleAddQuantity = (productId) => {
    incrementQuantity(productId);
  };

  const handleRemoveQuantity = (productId) => {
    decrementQuantity(productId);
  };

  const handleFinishPay = () => {
    clearCart();
    toast.success("Compra finalizada");
  };

  const handleRemoveItem = (productId) => {
    toast.success("Eliminaste un producto");
    removeFromCart(productId);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalQuantity = cart.reduce((total, item) => {
    if (typeof item.quantity === "number") {
      return total + item.quantity;
    } else {
      return total;
    }
  }, 0);
  return (
    <>
      <IconButton
        sx={{ marginRight: "15px", marginTop: "5px" }}
        onClick={handleDrawerOpen}
      >
        <Badge badgeContent={totalQuantity} color="error">
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
                    image={item.img}
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
                  <IconButton onClick={() => handleRemoveQuantity(item.id)}>
                    <RemoveIcon />
                  </IconButton>
                  {item.quantity}
                  <IconButton onClick={() => handleAddQuantity(item.id)}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              <ListItemSecondaryAction>
                <IconButton
                  sx={{ position: "absolute", top: -128, right: 27 }}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <DeleteIcon size={"large"} color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem>
            <ListItemText
              primary={`Total: $${getTotal() ? getTotal() : "0"}`}
            />
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

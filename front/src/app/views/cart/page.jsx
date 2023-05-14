"use client";
import React, { useState } from "react";
import {
  Box,
  SwipeableDrawer,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { MoveToInbox, Mail } from "@mui/icons-material";

export default function SwipeableTemporaryDrawer() {
  const [state, setState] = useState({
    top: false,
    right: false,
    bottom: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event?.type === "keydown" && ["Tab", "Shift"].includes(event.key)) {
      return;
    }

    setState((prevState) => ({ ...prevState, [anchor]: open }));
  };

  const listItems = [
    { text: "Inbox", icon: <MoveToInbox /> },
    { text: "Starred", icon: <Mail /> },
    { text: "Send email", icon: <MoveToInbox /> },
    { text: "Drafts", icon: <Mail /> },
  ];

  const secondaryListItems = [
    { text: "All mail", icon: <MoveToInbox /> },
    { text: "Trash", icon: <Mail /> },
    { text: "Spam", icon: <MoveToInbox /> },
  ];

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {listItems.map(({ text, icon }, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {secondaryListItems.map(({ text, icon }, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </>
  );
}

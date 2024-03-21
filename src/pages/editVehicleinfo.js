import React, { useState, useEffect } from "react";
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@apollo/client";
// import { updateStationMutation } from "./yourGraphQLModule";

const EditVehicleModal = ({ open, setOpen, station }) => {
  const [editedStation, setEditedStation] = useState({});

  useEffect(() => {
    setEditedStation(station || {});
  }, [station]);

  const handleSave = () => {
    // Perform your GraphQL mutation to update the station data
    updateStationMutation({
      variables: {
        // Pass the necessary updated station details
        id: editedStation.id,
        // ... Other fields you want to update
      },
    });
    setOpen(false);
  };

  const handleClose = () => {
    setEditedStation({});
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card>
        <CardHeader title="Edit Station" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Station Name"
                value={editedStation.name || ""}
                onChange={(e) =>
                  setEditedStation({
                    ...editedStation,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CPO"
                value={editedStation.name || ""}
                onChange={(e) =>
                  setEditedStation({
                    ...editedStation,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                value={editedStation.name || ""}
                onChange={(e) =>
                  setEditedStation({
                    ...editedStation,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={editedStation.name || ""}
                onChange={(e) =>
                  setEditedStation({
                    ...editedStation,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Plugs"
                value={editedStation.name || ""}
                onChange={(e) =>
                  setEditedStation({
                    ...editedStation,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Power"
                value={editedStation.name || ""}
                onChange={(e) =>
                  setEditedStation({
                    ...editedStation,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Template ID"
                value={editedStation.name || ""}
                onChange={(e) =>
                  setEditedStation({
                    ...editedStation,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            {/* Add other fields to edit */}
          </Grid>
          <Button onClick={handleSave}>Update</Button>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default EditVehicleModal;

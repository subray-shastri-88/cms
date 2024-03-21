import React, { useState, useEffect } from "react";
import {
  Modal,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { useMutation } from "@apollo/client";
// import { updateOperatorMutation } from "./yourGraphQLModule"; // Import your GraphQL mutation

const EditCorporateModal = ({ open, setOpen, operator }) => {
  const [editedOperator, setEditedOperator] = useState({});

  useEffect(() => {
    setEditedOperator(operator || {});
  }, [operator]);

  const handleSave = () => {
    // Perform your GraphQL mutation to update the operator data
    updateOperatorMutation({
      variables: {
        // Pass the necessary updated operator details
        id: editedOperator.id,
        // ... Other fields you want to update
      },
    });
    setOpen(false);
  };

  const handleClose = () => {
    setEditedOperator({});
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card>
        <CardHeader title={operator ? "Edit Operator" : "Add Operator"} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Operator Name"
                value={editedOperator.name || ""}
                onChange={(e) =>
                  setEditedOperator({
                    ...editedOperator,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Operator ID"
                value={editedOperator.id || ""}
                onChange={(e) =>
                  setEditedOperator({
                    ...editedOperator,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="City"
                value={editedOperator.xs || ""}
                onChange={(e) =>
                  setEditedOperator({
                    ...editedOperator,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                value={editedOperator.xs || ""}
                onChange={(e) =>
                  setEditedOperator({
                    ...editedOperator,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Per Unit AC Charge"
                value={editedOperator.xs || ""}
                onChange={(e) =>
                  setEditedOperator({
                    ...editedOperator,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Per Unit DC Charge"
                value={editedOperator.xs || ""}
                onChange={(e) =>
                  setEditedOperator({
                    ...editedOperator,
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

export default EditCorporateModal;

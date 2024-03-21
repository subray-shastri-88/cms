import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export const ConfirmationModal = ({
    open, handleClose, title , handleCloseSubmit
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >

                <DialogContent>
                    <DialogContentText>
                        {title}
                    </DialogContentText>
                    <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                            Close
                        </Button>
                        <Button autoFocus onClick={handleCloseSubmit}>
                            Submit
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )
}
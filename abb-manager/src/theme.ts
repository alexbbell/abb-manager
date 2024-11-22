import { createTheme } from "@mui/material";

export const theme = createTheme({
    components: {

        MuiTextField: {
            defaultProps: {
                fullWidth: true
            },
            styleOverrides: {
                root: {
                    backgroundColor: '#FFF',

                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    background: '#FFF'
                }
            }
        }
    }
});
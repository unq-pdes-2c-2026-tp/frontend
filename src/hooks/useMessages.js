import { useSnackbar } from "notistack";

export function useMessages() {
  const {enqueueSnackbar}=useSnackbar()

  const success = (message) => enqueueSnackbar(message, {variant: "success"})
  const error = (message) => enqueueSnackbar(message, {variant: "error"})
  const warning = (message) => enqueueSnackbar(message, {variant: "warning"})

  return {success, error, warning}
}
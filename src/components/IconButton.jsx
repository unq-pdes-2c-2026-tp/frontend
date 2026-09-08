import { Button } from "react-bootstrap";

export function IconButton({icon, ...rest}){
  return <Button {...rest} style={{borderRadius: '60px'}} variant="light">{icon}</Button>
}
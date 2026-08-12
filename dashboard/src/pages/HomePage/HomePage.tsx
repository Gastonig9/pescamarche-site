import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import { useAppSelector } from "../../app/hooks";

const summaryCards = [
  {
    label: "Productos",
    icon: <Inventory2Icon fontSize="large" color="primary" />,
  },
  {
    label: "Pedidos",
    icon: <LocalShippingIcon fontSize="large" color="primary" />,
  },
  { label: "Usuarios", icon: <GroupIcon fontSize="large" color="primary" /> },
];

export function HomePage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        ¡Bienvenido{user?.name ? `, ${user.name}` : ""}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Desde acá podés gestionar los productos, pedidos y usuarios de Pesca
        Marché.
      </Typography>

      <Grid container spacing={3}>
        {summaryCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 4 }}>
            <Card variant="outlined">
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {card.icon}
                <Typography variant="h6">{card.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

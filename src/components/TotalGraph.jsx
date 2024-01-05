import { ArrowCircleRight, Pets } from "@mui/icons-material";
import { Stack, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function TotalGraph(props) {
  const { total, totaltype, color, icon, link } = props;

  const IconComponent = icon || Pets;
  return (
    <>
      <Stack
        padding={2}
        mr={2}
        sx={{
          width: "230px",
          height: "125px",
          backgroundColor: color,
          borderRadius: "5px",
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              color={"white"}
              fontWeight={"bold"}
              fontFamily={"monospace"}
            >
              {total ? total : 0}
            </Typography>
            <Typography variant="h6" color={"white"} fontFamily={"sans-serif"}>
              Total {totaltype}
            </Typography>
          </Box>
          <IconComponent
            color="disabled"
            sx={{ width: "50px", height: "50px" }}
          />
        </Stack>
        {/* <Button size="small" sx={{ height: "20px", mt: 1 }}> */}
        <Typography
          color={"white"}
          fontSize={"15px"}
          component={Link}
          to={link}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          More info
          <ArrowCircleRight fontSize="small" color="action" />{" "}
        </Typography>{" "}
        {/* </Button> */}
      </Stack>
    </>
  );
}

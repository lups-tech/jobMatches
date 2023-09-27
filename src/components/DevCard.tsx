import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Typography,
  IconButton,
  IconButtonProps,
  styled,
  Avatar,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EmailIcon from "@mui/icons-material/Email";
import { Developer } from "../types/innerTypes";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

type Skill = {
  id: string;
  title: string;
  type: string;
};

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const DevCard = ({ developer }: { developer: Developer }) => {
  const [expanded, setExpanded] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const saveDeveloper = () => {
    // need to add logic to save developer to favorites for user
    setFavorite(!favorite);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const groupSkillsByCategory = (skills: Skill[]) => {
    const groupedSkills: { [key: string]: string[] } = {};

    skills.forEach((skill) => {
      if (!groupedSkills[skill.type]) {
        groupedSkills[skill.type] = [];
      }
      groupedSkills[skill.type].push(skill.title);
    });

    return groupedSkills;
  };

  const groupedSkills = groupSkillsByCategory(developer.skills);

  return (
    <Card
      sx={{
        marginBlock: 2,
        paddingInline: 5,
        display: "flex",
        flexDirection: "column",
        minWidth: "500px",
        borderRadius: 6,
      }}
    >
      <CardHeader />
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={2}>
          <Avatar alt={developer.name} src={`https://i.pravatar.cc/300?img=${developer.id.slice(0,1)}`} sx={{ width: 72, height: 72 }}/>
        </Grid>
        <Grid item xs={10}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {developer.name}
            </Typography>
            <Typography variant="body1">
              <EmailIcon fontSize="small" sx={{ marginRight: 1 }} />
              {developer.email}
            </Typography>
            <div>
              {groupedSkills["Programming Language"] && (
                <Typography>
                  Programming Language:{" "}
                  {groupedSkills["Programming Language"].join(", ")}
                </Typography>
              )}
              {groupedSkills["Technical Skills"] && (
                <Typography>
                  Technical Skills: {groupedSkills["Technical Skills"].join(", ")}
                </Typography>
              )}
            </div>
          </CardContent>
        </Grid>
      </Grid>

      <CardActions disableSpacing sx={{ paddingBottom: 3 }}>
        
        <IconButton aria-label="add to favorites" onClick={saveDeveloper}>
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon/>}
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{ maxHeight: "100%", width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "100%",
              overflowY: "auto",
            }}
          >
            {groupedSkills["Prior Experience"] && (
              <Typography>
                Prior Experience: {groupedSkills["Prior Experience"].join(", ")}
              </Typography>
            )}
            {groupedSkills["Speaking Languages"] && (
              <Typography gutterBottom>
                Speaking Languages:{" "}
                {groupedSkills["Speaking Languages"].join(", ")}
              </Typography>
            )}
            <div>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <Typography variant="body1" style={{maxWidth: "400px"}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                dapibus ante sit amet dolor tincidunt, non rutrum nibh rhoncus.
                Aliquam at ex tellus. Nullam a dolor purus. Pellentesque vitae
                ante ac felis congue congue tristique ac neque. Class aptent
                taciti sociosqu ad litora torquent per conubia nostra, per
                inceptos himenaeos.
              </Typography>
            </div>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default DevCard;

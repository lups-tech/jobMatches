import { Button, Paper, Typography, Stack, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { cardColorLogic } from '../../../data/programmingLanguageColors';
import { Developer } from '../../../types/innerTypes';
import { Matches } from '../../../types/scraperTypes';

const JobMatchesDevPaper = ({
  dev,
  matches,
}: {
  dev: Developer;
  matches: Matches;
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        padding: 2,
        marginBottom: 2,
        borderRadius: 6,
        width: 440,
        // Following logic is to color the dev card based on the first Programming Language they have
        backgroundColor: `${
          cardColorLogic[
            dev.skills.filter((skill) => skill.type === 'Programming Language')
              .length > 0
              ? dev.skills.filter(
                  (skill) => skill.type === 'Programming Language',
                )[0].title
              : 'no_such_programming_skill'
          ]
        }`,
      }}
      key={dev.id}
    >
      <div className="flex justify-between">
        <div>
          <Typography variant="h5">{dev.name}</Typography>
          <Typography variant="body1">
            <EmailIcon fontSize="small" sx={{ marginRight: 1 }} />
            {dev.email}
          </Typography>
          <Stack spacing={1} direction="row">
            {dev.skills
              .filter((skill) =>
                matches.jobSkills.some((jobSkill) => jobSkill.id === skill.id),
              )
              .map((skill) => (
                <Chip label={skill.title} size="small" key={skill.id} />
              ))}
          </Stack>
        </div>
        <Button className="h-[40px] w-[170px]">Start Matching</Button>
      </div>
    </Paper>
  );
};

export default JobMatchesDevPaper;

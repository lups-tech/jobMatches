import { mockSkills } from '../data/mockSkills';
import {
  Developer,
  DeveloperFilterFormValues,
  Skill,
} from '../types/innerTypes';
import { Job } from '../types/jobTechApiTypes';

//used in dataVisualization
export const updateCounts = (dataPublicationData: string[]) => {
  let thisWeek = 0;
  let oneWeekOld = 0;
  let twoWeekOld = 0;
  let threeWeekOld = 0;

  dataPublicationData.forEach((date) => {
    const timeDiff = Date.now() - new Date(date).getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (days < 8) {
      thisWeek++;
    }
    if (days >= 8 && days < 15) {
      oneWeekOld++;
    }
    if (days >= 15 && days < 22) {
      twoWeekOld++;
    }
    if (days >= 22 && days < 29) {
      threeWeekOld++;
    }
  });

  return [threeWeekOld, twoWeekOld, oneWeekOld, thisWeek];
};

//used in dataVisualization
export const labels = [
  '3-4 weeks',
  '2-3 weeks',
  '1-2 weeks',
  'Less than 1 week',
];

export const groupSkillsByCategory = (skills: Skill[]) => {
  const groupedSkills: { [key: string]: string[] } = {};

  skills.forEach((skill) => {
    if (!groupedSkills[skill.type]) {
      groupedSkills[skill.type] = [];
    }
    groupedSkills[skill.type].push(skill.title);
  });

  return groupedSkills;
};

export const developerFilter = ({
  orderedDevelopers,
  searchFilter,
}: {
  orderedDevelopers: Developer[];
  searchFilter: DeveloperFilterFormValues;
}) => {
  return orderedDevelopers.filter((dev: Developer) => {
    const devSkills = dev.skills.map((skill: Skill) => skill.title);
    const devName = dev.name.toLowerCase();
    const speaksSwedish = devSkills.includes('Swedish');
    const matchingSkills = devSkills.includes(searchFilter.searchKeyword);
    const matchingName = devName.includes(searchFilter.searchKeyword);
    const matchingProgrammingLanguages = searchFilter.skillsFilter.every(
      (skill) => devSkills.includes(skill),
    );

    if (searchFilter.speaksSwedish && !speaksSwedish) {
      return false;
    }

    if (
      searchFilter.speaksSwedish &&
      speaksSwedish &&
      searchFilter.searchKeyword === '' &&
      searchFilter.skillsFilter.length === 0
    ) {
      return true;
    }

    if (
      searchFilter.speaksSwedish &&
      speaksSwedish &&
      matchingProgrammingLanguages &&
      (matchingSkills || matchingName)
    ) {
      return true;
    }

    if (matchingProgrammingLanguages && (matchingSkills || matchingName)) {
      return true;
    }

    return false;
  });
};

export const sortMockDevelopers = (
  developers: Developer[],
  descriptionSkills: Skill[],
) => {
  const orderedDevs: Developer[] = [];
  developers.map((dev: Developer) => {
    const devSkillsId = dev.skills.map((skill: Skill) => skill.id);
    const descriptionSkillsId = descriptionSkills.map(
      (skill: Skill) => skill.id,
    );
    const matchingSkills = devSkillsId.filter((skillId: string) =>
      descriptionSkillsId.includes(skillId),
    );
    dev.skillMatch = matchingSkills.length;
    if (matchingSkills.length > 0) {
      orderedDevs.push(dev);
    }
  });

  orderedDevs.sort((devA: Developer, devB: Developer) => {
    const devASkillMatches = devA.skillMatch;
    const devBSkillMatches = devB.skillMatch;

    return devBSkillMatches - devASkillMatches;
  });

  return orderedDevs;
};

export const findMatchingSkills = (job: Job) => {
  const jobDescriptionStrArr = {
    description: job.description.text,
  }.description
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s#]/g, '')
    .split(' ');
  const matchingSkills = mockSkills.filter((skill) =>
    jobDescriptionStrArr.includes(skill.title.toLowerCase()),
  );
  return matchingSkills;
};

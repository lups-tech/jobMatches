import { Skill } from '../types/innerTypes';

//used in dataVisualization
export const updateCounts = (dataPublicationData: string[]) => {
  let thisWeek = 0;
  let oneWeekOld = 0;
  let twoWeekOld = 0;
  let threeWeekOld = 0;

  dataPublicationData.forEach(date => {
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

  skills.forEach(skill => {
    if (!groupedSkills[skill.type]) {
      groupedSkills[skill.type] = [];
    }
    groupedSkills[skill.type].push(skill.title);
  });

  return groupedSkills;
};

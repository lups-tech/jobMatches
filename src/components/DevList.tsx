import { useState } from 'react';
import { DeveloperDTO } from '../types/innerTypes';
import DevCard from './DevCard';

const DevList = ({ developers }: { developers: DeveloperDTO[] }) => {
  const [currentDevelopers, setCurrentDevelopers] = useState(developers);

  return (
    <>
      {currentDevelopers.map(developer => (
        <DevCard
          key={developer.id}
          developer={developer}
          isLiked={true}
          currentDevelopers={currentDevelopers}
          setCurrentDevelopers={setCurrentDevelopers}
        />
      ))}
    </>
  );
};

export default DevList;

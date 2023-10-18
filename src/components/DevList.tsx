import { DeveloperDTO } from '../types/innerTypes';
import DevCard from './DevCard';

const DevList = ({ developers }: { developers: DeveloperDTO[] }) => {
  return (
    <>
      {developers.map(developer => (
        <DevCard key={developer.id} developer={developer} isLiked={true} />
      ))}
    </>
  );
};

export default DevList;

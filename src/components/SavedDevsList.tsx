import { DeveloperDTO } from '../types/innerTypes';
import DevCard from './DevCard';

const SavedDevsList = ({ developers }: { developers: DeveloperDTO[] }) => {
  return (
    <div className="max-w-[500px]">
      <h4>Saved Developers</h4>
      {developers.map(developer => (
        <DevCard key={developer.id} developer={developer} isLiked={true} />
      ))}
    </div>
  );
};

export default SavedDevsList;

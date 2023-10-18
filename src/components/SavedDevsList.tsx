import { Typography } from '@mui/material';
import { DeveloperDTO } from '../types/innerTypes';
import DevCard from './DevCard';

const SavedDevsList = ({ developers }: { developers: DeveloperDTO[] }) => {
  return (
    <div className="w-[415px] mx-5" overflow-hidden hover:overflow-y-auto>
      <Typography variant="h5">Saved Developers</Typography>
      <div className="w-full h-[600px] mx-auto overflow-hidden hover:overflow-y-auto">
        <div className="w-[400px]">
          {developers.map(developer => (
            <DevCard key={developer.id} developer={developer} isLiked={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedDevsList;

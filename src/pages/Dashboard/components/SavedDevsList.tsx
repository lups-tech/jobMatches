import { Typography } from '@mui/material';
import { Developer } from '../../../types/innerTypes';
import { DevCard } from '../../../components';

const SavedDevsList = ({ developers }: { developers: Developer[] }) => {
  return (
    <div className="w-[415px] mx-5">
      <Typography variant="h5">Saved Developers</Typography>
      <div className="w-full h-[600px] mx-auto overflow-hidden hover:overflow-y-auto">
        <div className="w-[400px]">
          {developers.map((developer) => (
            <DevCard key={developer.id} developer={developer} isLiked={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedDevsList;

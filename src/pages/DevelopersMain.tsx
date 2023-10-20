import { useState } from 'react';
import DevForm from '../components/DevForm';
import AllDevs from '../components/AllDevs';
import { Button } from '@mui/material';

const DevelopersMainRoute = () => {
  const [showForm, setShowForm] = useState(false);
  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-center my-5">
        <Button onClick={handleShowForm} className="w-[600px] mx-auto">
          {showForm ? 'Show Developers' : 'Add a Developer'}
        </Button>
      </div>

      {showForm && <DevForm />}
      {!showForm && <AllDevs />}
    </div>
  );
};

export default DevelopersMainRoute;

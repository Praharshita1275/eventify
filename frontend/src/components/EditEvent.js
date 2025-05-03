import React from 'react';
import { useParams } from 'react-router-dom';
import CreateEvent from './CreateEvent';

const EditEvent = () => {
  const { id } = useParams();
  
  return (
    <CreateEvent isEditing={true} eventId={id} />
  );
};

export default EditEvent; 
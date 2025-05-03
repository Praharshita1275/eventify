import { useState, useCallback } from 'react';
import moment from 'moment';

/**
 * Custom hook to handle event form state and prevent excessive re-renders
 */
export const useEventForm = (initialState) => {
  const [formState, setFormState] = useState(() => ({
    title: '',
    description: '',
    date: moment().format('YYYY-MM-DD'),
    startTime: '10:00',
    endTime: '12:00',
    venue: '',
    organizer: '',
    image: null,
    ...initialState
  }));

  // Memoized input change handler to prevent re-creation on each render
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Use a direct state update without any checks
    setFormState(prevState => {
      const newState = {
        ...prevState,
        [name]: value
      };
      return newState;
    });
  }, []);

  // Memoized date select handler
  const handleDateSelect = useCallback((date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setFormState(prevState => ({
      ...prevState,
      date: formattedDate
    }));
  }, []);

  // Reset form state
  const resetForm = useCallback(() => {
    setFormState({
      title: '',
      description: '',
      date: moment().format('YYYY-MM-DD'),
      startTime: '10:00',
      endTime: '12:00',
      venue: '',
      organizer: '',
      image: null
    });
  }, []);

  // Set a specific field
  const setField = useCallback((fieldName, value) => {
    setFormState(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  }, []);

  return {
    formState,
    handleInputChange,
    handleDateSelect,
    resetForm,
    setField
  };
};

export default useEventForm; 
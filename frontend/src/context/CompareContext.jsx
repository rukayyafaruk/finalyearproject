import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [selectedSchools, setSelectedSchools] = useState(() => {
    try {
      const saved = localStorage.getItem('rukys_compare_schools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rukys_compare_schools', JSON.stringify(selectedSchools));
    } catch (e) {
      console.error('Failed to save comparison to localStorage', e);
    }
  }, [selectedSchools]);

  const addSchool = (school) => {
    if (selectedSchools.find(s => s.id === school.id)) return;
    if (selectedSchools.length >= 4) {
      alert('You can compare a maximum of 4 schools at once.');
      return;
    }
    setSelectedSchools(prev => [...prev, school]);
  };

  const removeSchool = (schoolId) => {
    setSelectedSchools(prev => prev.filter(s => s.id !== schoolId));
  };

  const clearCompare = () => {
    setSelectedSchools([]);
  };

  const isComparing = (schoolId) => {
    return selectedSchools.some(s => s.id === schoolId);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedSchools,
        addSchool,
        removeSchool,
        clearCompare,
        isComparing,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

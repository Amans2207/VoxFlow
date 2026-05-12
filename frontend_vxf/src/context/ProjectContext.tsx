"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MasterVideo {
  videoId: string;
  videoUrl: string;
  filename: string;
}

interface ProjectState {
  masterVideo: MasterVideo | null;
  unlinkedModules: string[]; // List of module titles that are unlinked
  moduleLocalVideos: Record<string, MasterVideo>; // moduleTitle -> VideoData
}

interface ProjectContextType {
  state: ProjectState;
  setGlobalProject: (videoId: string, videoUrl: string, filename: string) => void;
  setModuleLocalProject: (moduleTitle: string, videoId: string, videoUrl: string, filename: string) => void;
  toggleModuleLink: (moduleTitle: string) => void;
  resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState>({
    masterVideo: null,
    unlinkedModules: [],
    moduleLocalVideos: {},
  });

  const setGlobalProject = (videoId: string, videoUrl: string, filename: string) => {
    const newMaster = { videoId, videoUrl, filename };
    setState(prev => ({
      ...prev,
      masterVideo: newMaster,
    }));
  };

  const setModuleLocalProject = (moduleTitle: string, videoId: string, videoUrl: string, filename: string) => {
    setState(prev => ({
      ...prev,
      moduleLocalVideos: {
        ...prev.moduleLocalVideos,
        [moduleTitle]: { videoId, videoUrl, filename },
      },
    }));
  };

  const toggleModuleLink = (moduleTitle: string) => {
    setState(prev => {
      const isUnlinked = prev.unlinkedModules.includes(moduleTitle);
      const newUnlinked = isUnlinked
        ? prev.unlinkedModules.filter(m => m !== moduleTitle)
        : [...prev.unlinkedModules, moduleTitle];
      
      return {
        ...prev,
        unlinkedModules: newUnlinked,
      };
    });
  };

  const resetProject = () => {
    setState({
      masterVideo: null,
      unlinkedModules: [],
      moduleLocalVideos: {},
    });
  };

  return (
    <ProjectContext.Provider value={{ state, setGlobalProject, setModuleLocalProject, toggleModuleLink, resetProject }}>
      {children}
    </ProjectContext.Provider>
  );
}



export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

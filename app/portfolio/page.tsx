'use client';

import { useEffect, useState } from 'react';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import InterView from '@/components/InterView/InterView';
import About from '@/components/About/About';
import Project from '@/components/Project/Project';
import ScrollButton from '@/components/ScrollButton/ScrollButton';
import axiosClient from '@/services/api';
import { ProjectData } from '@/shared/types/project';
import { SESSION_ABOUT, SESSION_PROJECT } from '@/shared/constants';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const fetchProjects = async () => {
    try {
      const { result } = await axiosClient.apiGetProject();
      setProjects(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-5 bg-white text-black dark:bg-black dark:text-white overflow-x-hidden">
      <ControlPanel />
      <InterView />
      <div id={SESSION_ABOUT}>
        <About />
      </div>
      <div id={SESSION_PROJECT}>
        <Project projects={projects} />
      </div>
      <ScrollButton />
    </div>
  );
}

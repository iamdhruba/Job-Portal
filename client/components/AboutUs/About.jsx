import React from 'react';
import WhoWeAre from './Whoweare';
import StatsSection from './StatsSection';
import MissionSection from '../MissionSection/MissionSection';
import Teammembers from '../TeammemberSection/Teammembers';
import WhyChooseClickJob from '../WhyChooseClickJob/WhyChooseClickJob';

const About = () => {
  return (
    <div>
      <WhoWeAre />
      <StatsSection />
      <MissionSection />
      <WhyChooseClickJob/>
      <Teammembers />
    </div>
  );
};

export default About;
import PageHero from '@shared/PageHero.jsx'
import IntroductionSection from '@sections/about/IntroductionSection.jsx'
import MissionVisionSection from '@sections/about/MissionVisionSection.jsx'
import OurStorySection from '@sections/about/OurStorySection.jsx'
import FaqSection from '@sections/about/FaqSection.jsx'
import AboutCtaSection from '@sections/about/AboutCtaSection.jsx'
import TeamSection from '@sections/about/TeamSection.jsx'

function AboutPage({ content }) {
  return (
    <>
      <PageHero {...content.hero} />
      <IntroductionSection content={content.introduction} />
      <MissionVisionSection content={content.missionVision} />
      <OurStorySection content={content.story} />
      <TeamSection content={content.team} />
      <FaqSection content={content.faq} />
      <AboutCtaSection content={content.cta} />
    </>
  )
}

export default AboutPage

import PageHero from '@shared/PageHero.jsx'
import IntroductionSection from '@sections/about/IntroductionSection.jsx'
import MissionVisionSection from '@sections/about/MissionVisionSection.jsx'

function AboutPage({ content }) {
  return (
    <>
      <PageHero {...content.hero} />
      <IntroductionSection content={content.introduction} />
      <MissionVisionSection content={content.missionVision} />
    </>
  )
}

export default AboutPage

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
      {content.hero.visible !== false && <PageHero {...content.hero} />}
      {content.introduction.visible !== false && <IntroductionSection content={content.introduction} />}
      {content.missionVision.visible !== false && <MissionVisionSection content={content.missionVision} />}
      {content.story.visible !== false && <OurStorySection content={content.story} />}
      {content.team.visible !== false && <TeamSection content={content.team} />}
      {content.faq.visible !== false && <FaqSection content={content.faq} />}
      {content.cta.visible !== false && <AboutCtaSection content={content.cta} />}
    </>
  )
}

export default AboutPage

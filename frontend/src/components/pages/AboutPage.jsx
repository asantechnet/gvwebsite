import PageHero from '@shared/PageHero.jsx'
import IntroductionSection from '@sections/about/IntroductionSection.jsx'

function AboutPage({ content }) {
  return (
    <>
      <PageHero {...content.hero} />
      <IntroductionSection content={content.introduction} />
    </>
  )
}

export default AboutPage

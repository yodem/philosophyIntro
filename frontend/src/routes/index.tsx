import { Box, Container } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import Description from '../components/LandingPage/Description'
import ContentDisplaySection from '../components/LandingPage/ContentDisplaySection'
import AboutDisplay from '../components/LandingPage/AboutDisplay'
import PhilosophySection from '../components/LandingPage/PhilosophySection'
import NavBar from '@/components/NavBar'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box>
      <NavBar />
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }} >
        <Description />
        <PhilosophySection />
        <ContentDisplaySection />
        <AboutDisplay />
      </Container>
    </Box>
  )
}
